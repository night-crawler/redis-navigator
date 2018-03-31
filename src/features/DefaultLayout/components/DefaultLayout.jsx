import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import Navbar from '../../Navbar/index';
import Dashboard from '../../Dashboard';
import RedisConsole from '../../RedisConsole';
import KeyViewer from '../../KeyViewer';
import { FullPageDimmer, NotFound } from '../../Common/components';
import AppWrapper from './AppWrapper';
import AppContentWrapper from './AppContentWrapper';
import NotificationSystem from '../../NotificationSystem';


import { FormattedMessage } from 'react-intl';
import messages from '../messages';


const MsgLoadingRedisInstances = <FormattedMessage { ...messages.loadingRedisInstances } />;


export default class DefaultLayout extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            initStoreWithUrls: PropTypes.func,

            initializeUrls: PropTypes.func,
            setActiveInstance: PropTypes.func,
            fetchInstances: PropTypes.func,
            fetchInspections: PropTypes.func,
            fetchInfo: PropTypes.func,
        }),
        instances: PropTypes.array,
        inspections: PropTypes.object,
        instancesData: PropTypes.object,
        activeInstanceName: PropTypes.string,

        isReady: PropTypes.bool,
        hasLoadedEndpoints: PropTypes.bool,
        hasLoadedInspections: PropTypes.bool,
        hasLoadedInstances: PropTypes.bool,

        endpointsUrl: PropTypes.string.isRequired,
        baseUrl: PropTypes.string,
    };

    state = {};

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized', props);
    }

    componentDidMount() {
        const { endpointsUrl, baseUrl, actions } = this.props;
        actions.initStoreWithUrls(baseUrl, endpointsUrl);
    }

    static getDerivedStateFromProps(newProps) {
        const {
            instances, activeInstanceName, urls, actions,
            shouldFetchEndpoints, shouldFetchInspections, shouldFetchInstances,
        } = newProps;

        if (!isEmpty(instances) && !activeInstanceName)
            actions.setActiveInstance(instances[0].name);

        shouldFetchEndpoints && actions.fetchEndpoints(urls.endpoints);
        shouldFetchInstances && actions.fetchInstances(urls.status);
        shouldFetchInspections && actions.fetchInspections(urls.inspections);

        return null;
    }

    render() {
        const { isReady } = this.props;
        if (!isReady)
            return <FullPageDimmer message={ MsgLoadingRedisInstances } />;

        return (
            <AppWrapper className='redis-navigator-app'>
                <Helmet
                    titleTemplate='%s - Redis Navigator'
                    defaultTitle='Redis Navigator'
                >
                    <meta name='description' content='Redis Navigator application' />
                </Helmet>

                <Navbar />

                <AppContentWrapper>
                    <Switch>
                        { /*<Route exact path='/' component={ HomePage } />*/ }
                        <Route path='/:instanceName/dashboard' component={ Dashboard } />
                        <Route path='/:instanceName/console' component={ RedisConsole } />
                        {/*<Route path='/:instanceName/keys/:pattern' component={ KeyViewer } />*/}
                        <Route path='/:instanceName' component={ KeyViewer } />
                        <Route path='' component={ NotFound } />
                    </Switch>
                </AppContentWrapper>

                <NotificationSystem />

            </AppWrapper>
        );
    }
}
