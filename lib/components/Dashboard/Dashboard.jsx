import _ from 'lodash';
import React from 'react';
import { Card, Segment, Icon, Header } from 'semantic-ui-react';
import DefinitionsCard from './DefinitionsCard';
import RedisClientsCard from './RedisClientsCard';
import RedisCommandsStatsCard from './RedisCommandStatsCard';
import RedisKeySpaceCard from './RedisKeySpaceCard';


export default class Dashboard extends React.Component {
    render() {
        const { clients, config, dbsize, name, sections } = this.props;
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
