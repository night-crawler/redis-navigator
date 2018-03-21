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
            loadInstances: PropTypes.func,
            setActiveInstance: PropTypes.func,
            loadInspections: PropTypes.func,
            loadInfo: PropTypes.func,
            initStoreWithUrls: PropTypes.func,
        }),
        instances: PropTypes.array,
        inspections: PropTypes.object,
        instancesData: PropTypes.object,
        activeInstanceName: PropTypes.string,
        isReady: PropTypes.bool,

        rpcEndpointUrl: PropTypes.string.isRequired,
        statusUrl: PropTypes.string.isRequired,
        inspectionsUrl: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized', props);
    }

    handleInitStoreWithUrls = () => {
        const { rpcEndpointUrl, statusUrl, inspectionsUrl, actions } = this.props;
        actions.initStoreWithUrls({ rpcEndpointUrl, statusUrl, inspectionsUrl });
    };

    componentDidMount() {
        this.handleInitStoreWithUrls();

        const { instances, inspections } = this.props;
        isEmpty(instances) && this.props.actions.loadInstances();
        isEmpty(inspections) && this.props.actions.loadInspections();
    }

    componentWillReceiveProps(newProps) {
        const { instances, activeInstanceName } = newProps;
        if (!isEmpty(instances) && !activeInstanceName) {
            this.props.actions.setActiveInstance(instances[0].name);
        }
        // this.handleInitStoreWithUrls();
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
                        <Route path='/:instanceName' component={ KeyViewer } />
                        <Route path='' component={ NotFound } />
                    </Switch>
                </AppContentWrapper>

                <NotificationSystem />

            </AppWrapper>
        );
    }
}
