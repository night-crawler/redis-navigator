import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../messages';

import DefinitionsCard from './DefinitionsCard';
import RedisClientsCard from './RedisClientsCard';
import RedisCommandsStatsCard from './RedisCommandStatsCard';
import RedisKeySpaceCard from './RedisKeySpaceCard';



export default class Dashboard extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            fetchInfo: PropTypes.func.isRequired,
        }),
        routeInstanceName: PropTypes.string.isRequired,
        routeInstanceInfo: PropTypes.object,
        routeInstanceDataExists: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('Dashboard');
        this.log('initialized', props);
        this.state = {};
    }

    componentDidMount() {
        const { routeInstanceName, routeInstanceInfo } = this.props;
        if (isEmpty(routeInstanceInfo))
            this.props.actions.fetchInfo(routeInstanceName);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { actions } = nextProps;

        const { routeInstanceName } = nextProps;
        const { routeInstanceName: prevRouteInstanceName } = prevState;

        // routeInstanceName changed from one non empty to another one
        if (prevRouteInstanceName && prevRouteInstanceName && routeInstanceName !== prevRouteInstanceName)
            actions.fetchInfo(routeInstanceName);

        return { routeInstanceName };
    }

    render() {
        const { routeInstanceInfo, routeInstanceName } = this.props;
        if (isEmpty(routeInstanceInfo))
            return (
                <Dimmer active={ true }>
                    <Loader size='massive'>
                        <Tr { ...messages.loadingRedisInstanceInfo } values={ { routeInstanceName } } />
                    </Loader>
                </Dimmer>
            );

        const { clients, config, dbsize, name, sections } = routeInstanceInfo;

        return (
            <Segment.Group className='Dashboard'>
                <Helmet>
                    <title>{ `Dashboard: ${routeInstanceName}` }</title>
                </Helmet>

                <Segment>
                    <Header as='h2'>
                        <Icon name='settings' />
                        <Header.Content><Tr { ...messages.configuration } /></Header.Content>
                    </Header>

                    <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                        <DefinitionsCard
                            header={ <Tr { ...messages.configuration } /> }
                            definitions={ config.result }
                        />

                        <DefinitionsCard
                            header={ <Tr { ...messages.miscellaneous } /> }
                            definitions={ {
                                dbsize: dbsize.result,
                                name: name.result || '-',
                            } }
                        />
                    </Card.Group>
                </Segment>

                <Segment>
                    <Header as='h2'>
                        <Icon name='info' />
                        <Header.Content><Tr { ...messages.information } /></Header.Content>
                    </Header>

                    <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                        <DefinitionsCard header={ <Tr { ...messages.server } /> }
                            definitions={ sections.result.server }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.clients } /> }
                            definitions={ sections.result.clients }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.memory } /> }
                            definitions={ sections.result.memory }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.persistence } /> }
                            definitions={ sections.result.persistence }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.stats } /> }
                            definitions={ sections.result.stats }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.replication } /> }
                            definitions={ sections.result.replication }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.cpu } /> }
                            definitions={ sections.result.cpu }
                        />
                        <DefinitionsCard
                            header={ <Tr { ...messages.cluster } /> }
                            definitions={ sections.result.cluster }
                        />

                        <RedisCommandsStatsCard stats={ sections.result.commandstats } />
                        <RedisKeySpaceCard keyspace={ sections.result.keyspace } />
                    </Card.Group>

                    <RedisClientsCard
                        clients={ clients.result }
                    />


                </Segment>


            </Segment.Group>
        );
    }
}
