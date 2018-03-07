import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../features/Navbar';
import Dashboard from '../features/Dashboard';
import RedisRpc from '../features/RedisRpc';
import { FullpageDimmer } from './helpers';
import NotFound from './NotFound';


const AppWrapper = styled.div`
  margin-top: 45px;
`;


const RouteWithActions = ({ component: Component, actions, ...rest }) => (
    <Route
        { ...rest }
        render={ props => <Component { ...props } actions={ actions } /> }
    />
);


class DefaultLayout extends React.Component {
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
            return <FullpageDimmer message='Loading Redis instances' />;

        return (
            <AppWrapper className='redis-navigator-app'>
                <Helmet
                    titleTemplate='%s - Redis Navigator'
                    defaultTitle='Redis Navigator'
                >
                    <meta name='description' content='Redis Navigator application' />
                </Helmet>

                <Navbar actions={ this.props.actions } />

                <Switch>
                    { /*<Route exact path='/' component={ HomePage } />*/ }
                    <RouteWithActions
                        path='/:instanceName/dashboard'
                        actions={ this.props.actions }
                        component={ Dashboard } />
                    <RouteWithActions
                        path='/:instanceName/rpc'
                        actions={ this.props.actions }
                        component={ RedisRpc } />
                    { <Route path='' component={ NotFound } /> }
                </Switch>

            </AppWrapper>
        );
    }
}

export default DefaultLayout;
