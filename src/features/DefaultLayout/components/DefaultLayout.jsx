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


export default class DefaultLayout extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            fetchEndpoints: PropTypes.func,
            loadInstances: PropTypes.func,
            setActiveInstance: PropTypes.func,
            loadInspections: PropTypes.func,
            fetchInfo: PropTypes.func,
            initStoreWithUrls: PropTypes.func,
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

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized', props);
    }

    handleInitStoreWithUrls = () => {
        const { endpointsUrl, baseUrl, actions } = this.props;
        actions.initStoreWithUrls({ endpoints: endpointsUrl, base: baseUrl });
    };

    componentDidMount() {
        this.handleInitStoreWithUrls();
    }

    componentWillReceiveProps(newProps) {
        const { instances, inspections, activeInstanceName, urls, hasLoadedEndpoints, actions } = newProps;

        if (!isEmpty(instances) && !activeInstanceName)
            actions.setActiveInstance(instances[0].name);

        if (!hasLoadedEndpoints && urls.endpoints)
            actions.fetchEndpoints();

        if (hasLoadedEndpoints && isEmpty(instances))
            actions.loadInstances();

        if (hasLoadedEndpoints && isEmpty(inspections))
            actions.loadInspections();
    }

    render() {
        const { isReady } = this.props;
        if (!isReady)
            return <FullPageDimmer message='Loading Redis instances' />;

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
