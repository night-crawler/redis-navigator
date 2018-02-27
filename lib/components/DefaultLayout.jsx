import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Dashboard from './Dashboard/Dashboard';


const AppWrapper = styled.div`
  margin-top: 4px;
`;


class DefaultLayout extends Component {
    static propTypes = {
        actions: PropTypes.shape({
            handleLoadInstances: PropTypes.func,
            handleSetActiveInstance: PropTypes.func,
            handleLoadInspections: PropTypes.func,
            handleLoadInfo: PropTypes.func,
        }),
        instances: PropTypes.array,
        activeInstance: PropTypes.string,
        instancesData: PropTypes.object,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized');
        this.log(props);
    }

    componentDidMount() {
        this.props.actions.handleLoadInstances();
        this.props.actions.handleLoadInspections();
    }

    componentWillReceiveProps({ instances, activeInstance }) {
        if (!isEmpty(instances) && !activeInstance) {
            this.props.actions.handleSetActiveInstance(instances[0].name);
        }
    }

    render() {
        const
            { instances, activeInstance, instancesData } = this.props,
            instanceData = instancesData[activeInstance];

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
                    activeInstance={ activeInstance }
                    onLoadInstances={ this.props.actions.handleLoadInstances }
                    onLoadInfo={ () => this.props.actions.handleLoadInfo(activeInstance) }
                />
                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Column>
                        <Segment>
                            1
                        </Segment>
                    </Grid.Column>

                    <Grid.Column width={ 16 }>

                        {
                            instanceData && !isEmpty(instanceData.info)
                                ? <Dashboard { ...instanceData.info } />
                                : ''
                        }


                    </Grid.Column>
                </Grid>
            </AppWrapper>
        );
    }
}

export default DefaultLayout;
