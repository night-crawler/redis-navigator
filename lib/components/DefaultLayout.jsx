import debug from 'debug';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Segment } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import Navbar from '../components/Navbar';


const AppWrapper = styled.div`
  margin-top: 3px;
`;


class DefaultLayout extends Component {
    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('DefaultLayout');
        this.log('initialized');
        this.log(props);
    }

    componentDidMount() {
        this.props.actions.handleLoadRedisInstances();
    }

    componentWillReceiveProps({ instances, activeInstance }) {
        this.log('wtf?', instances, activeInstance);
        if (!isEmpty(instances) && !activeInstance) {
            this.log('loading!', Object.keys(instances)[0]);
            this.props.actions.handleSetActiveInstance(Object.keys(instances)[0]);
        }
    }

    render() {
        const { instances, activeInstance } = this.props;
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
                    handleLoadRedisInstances={ this.props.actions.handleLoadRedisInstances }
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
