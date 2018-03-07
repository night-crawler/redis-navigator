import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import Navbar from '../../Navbar/index';
import Dashboard from '../../Dashboard';
import RedisConsole from '../../RedisConsole';
import { FullPageDimmer, NotFound } from '../../Common/components';
import AppWrapper from './AppWrapper';
import RouteWithActions from './RouteWithActions';

import AppContentWrapper from './AppContentWrapper';


export default class DefaultLayout extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            handleLoadInstances: PropTypes.func,
            handleSetActiveInstance: PropTypes.func,
            handleLoadInspections: PropTypes.func,
            handleLoadInfo: PropTypes.func,
        }),
        instances: PropTypes.array,
        inspections: PropTypes.object,
        instancesData: PropTypes.object,
        activeInstanceName: PropTypes.string,
        isReady: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized', props);
    }

    componentDidMount() {
        const { instances, inspections } = this.props;
        isEmpty(instances) && this.props.actions.handleLoadInstances();
        isEmpty(inspections) && this.props.actions.handleLoadInspections();
    }

    componentWillReceiveProps(newProps) {
        this.log('componentWillReceiveProps', newProps);
        const { instances, activeInstanceName } = newProps;
        if (!isEmpty(instances) && !activeInstanceName) {
            this.props.actions.handleSetActiveInstance(instances[0].name);
        }
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

                <Navbar actions={ this.props.actions } />

                <AppContentWrapper>
                    <Switch>
                        { /*<Route exact path='/' component={ HomePage } />*/ }
                        <RouteWithActions
                            path='/:instanceName/dashboard'
                            actions={ this.props.actions }
                            component={ Dashboard } />
                        <RouteWithActions
                            path='/:instanceName/console'
                            actions={ this.props.actions }
                            component={ RedisConsole } />
                        { <Route path='' component={ NotFound } /> }
                    </Switch>
                </AppContentWrapper>

            </AppWrapper>
        );
    }
}
