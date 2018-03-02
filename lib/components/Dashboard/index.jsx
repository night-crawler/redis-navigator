import debug from 'debug';
import _, { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import DefinitionsCard from './DefinitionsCard';
import RedisClientsCard from './RedisClientsCard';
import RedisCommandsStatsCard from './RedisCommandStatsCard';
import RedisKeySpaceCard from './RedisKeySpaceCard';


export default class Dashboard extends React.Component {
    static propTypes = {
        actions: PropTypes.shape({
            handleLoadInfo: PropTypes.func,
        }),
        routeInstanceName: PropTypes.string,
        routeInstanceInfo: PropTypes.object,
        routeInstanceDataExists: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('Dashboard');
        this.log('initialized');
        this.log(props);
    }

    componentDidMount() {
        const { routeInstanceName, routeInstanceInfo, routeInstanceDataExists } = this.props;
        if (isEmpty(routeInstanceInfo))
            this.props.actions.handleLoadInfo(routeInstanceName);
    }

    componentWillReceiveProps(newProps) {
        this.log('componentWillReceiveProps', newProps);
        const { routeInstanceName: oldRouteInstanceName } = this.props;
        // new
        const { routeInstanceInfo, routeInstanceName } = newProps;

        if (isEmpty(routeInstanceInfo) && routeInstanceName !== oldRouteInstanceName)
            this.props.actions.handleLoadInfo(routeInstanceName);

    }

    render() {
        const { routeInstanceInfo, routeInstanceName } = this.props;
        if (isEmpty(routeInstanceInfo))
            return <Dimmer active={ true }><Loader size='massive'>Loading { routeInstanceName } info</Loader></Dimmer>;

        const { clients, config, dbsize, name, sections } = routeInstanceInfo;
        const dumbSections = [
            'server',
            'clients',
            'memory',
            'persistence',
            'stats',
            'replication',
            'cpu',
            'cluster',
        ];

        return (
            <Segment.Group>
                <Segment>
                    <Header as='h2'>
                        <Icon name='settings' />
                        <Header.Content>Configuration</Header.Content>
                    </Header>

                    <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                        <DefinitionsCard
                            header='Configuration' description='CONFIG GET'
                            definitions={ config.result }
                        />

                        <DefinitionsCard
                            header='Miscellaneous' description='db, connection'
                            definitions={ {
                                dbsize: _.has(dbsize, 'error') ? 'error' : dbsize.result,
                                name: _.has(name, 'error') ? 'error' : name.result || '-',
                            } }
                        />
                    </Card.Group>
                </Segment>

                <Segment>
                    <Header as='h2'>
                        <Icon name='info' />
                        <Header.Content>Information</Header.Content>
                    </Header>

                    <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                        {

                            Object.entries(sections.result).map(([sectionName, sectionOptions], i) => {
                                if (dumbSections.indexOf(sectionName) >= 0) {
                                    return <DefinitionsCard
                                        key={ i }
                                        header={ _.capitalize(sectionName) }
                                        definitions={ sectionOptions }
                                    />;
                                }
                            })
                        }

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
