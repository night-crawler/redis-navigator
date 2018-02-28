import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Dashboard from '../containers/Dashboard';
import { FullpageDimmer } from './helpers';


const AppWrapper = styled.div`
  margin-top: 45px;
`;


const RouteWithActions = ({ component: Component, actions, ...rest }) => (
    <Route
        { ...rest }
        render={ props => <Component { ...props } actions={ actions } /> }
    />
);


class DefaultLayout extends Component {
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
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized');
        this.log(props);
    }

    componentDidMount() {
        const { instances, inspections } = this.props;
        isEmpty(instances) && this.props.actions.handleLoadInstances();
        isEmpty(inspections) && this.props.actions.handleLoadInspections();
    }

    componentWillReceiveProps({ instances, activeInstanceName }) {
        if (!isEmpty(instances) && !activeInstanceName) {
            this.props.actions.handleSetActiveInstance(instances[0].name);
        }
    }

    render() {
        const { instances, activeInstanceName } = this.props;
        if (isEmpty(instances))
            return <FullpageDimmer message='Loading Redis instances' />;

        return (
            <AppWrapper className='redis-navigator-app'>
                <Helmet
                    titleTemplate='%s - Redis Navigator'
                    defaultTitle='Redis Navigator'
                >
                    <meta name='description' content='Redis Navigator application' />
                </Helmet>

                <Navbar
                    instances={ instances }
                    activeInstanceName={ activeInstanceName }
                    actions={ {
                        handleLoadInstancesClick: this.props.actions.handleLoadInstances,
                        handleLoadInfoClick: () => this.props.actions.handleLoadInfo(activeInstanceName),
                        handleSetActiveInstanceClick: this.props.actions.handleSetActiveInstance
                    } }
                />

                <Switch>
                    { /*<Route exact path='/' component={ HomePage } />*/ }
                    <RouteWithActions
                        path='/:instanceName/dashboard'
                        actions={ this.props.actions }
                        component={ Dashboard } />
                    { /*<Route path='' component={ NotFoundPage } />*/ }
                </Switch>

            </AppWrapper>
        );
    }
}

export default DefaultLayout;
