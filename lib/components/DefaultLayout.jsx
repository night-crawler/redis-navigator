import debug from 'debug';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';


const AppWrapper = styled.div`
  margin-top: 3px;
`;


class DefaultLayout extends Component {
    constructor(props) {
        super(props);

        this.urls = {
            rpcEndpoint: props.redisRpcServer,
            status: `${props.redisRpcServer}/rpc/status`,
            rpc: `${props.redisRpcServer}/rpc`,
        };
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized');
    }

    componentDidMount() {
        this.handleLoadRedisInstances();
    }

    handleLoadRedisInstances = () => {
        return this.props.actions.loadRedisInstances(this.urls.status);
    };

    render() {
        const { instances } = this.props.instances;

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
                    handleLoadRedisInstances={ this.handleLoadRedisInstances }
                />
                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Column>
                        <Segment className='formogen'>
                            lol

                        </Segment>
                    </Grid.Column>
                </Grid>
            </AppWrapper>
        );
    }
}

export default DefaultLayout;
