import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage as Tr } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

import messages from '../messages';

import AppContentWrapper from './AppContentWrapper';
import AppWrapper from './AppWrapper';

import RedisConsole from 'features/RedisConsole';
import NotificationSystem from 'features/NotificationSystem';
import Navbar from 'features/Navbar';
import KeyViewer from 'features/KeyViewer';
import Dashboard from 'features/Dashboard';
import { FullPageDimmer, NotFound } from 'features/Common/components';


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
        shouldFetchEndpoints: PropTypes.bool,
        shouldFetchInspections: PropTypes.bool,
        shouldFetchInstances: PropTypes.bool,

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
            return <FullPageDimmer message={ <Tr { ...messages.loadingRedisInstances } /> } />;

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
                        <Route path='/:instanceName' component={ KeyViewer } />
                        <Route path='' component={ NotFound } />
                    </Switch>
                </AppContentWrapper>

                <NotificationSystem />

            </AppWrapper>
        );
    }
}
