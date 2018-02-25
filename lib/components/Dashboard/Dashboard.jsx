import _ from 'lodash';
import React from 'react';
import { Card, Segment } from 'semantic-ui-react';
import DefinitionsCard from './DefinitionsCard';
import RedisClientsCard from './RedisClientsCard';
import PropTypes from 'prop-types';


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
                    <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                        <DefinitionsCard
                            header='Configuration' description='CONFIG GET'
                            options={ config.result }
                        />

                        <DefinitionsCard
                            header='Miscellaneous' description='db, connection'
                            options={ {
                                dbsize: _.has(dbsize, 'error') ? 'error' : dbsize.result,
                                name: _.has(name, 'error') ? 'error' : name.result || '-',
                            } }
                        />

                    </Card.Group>
                </Segment>

                <Segment>

                    <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                        {

                            Object.entries(sections.result).map(([sectionName, sectionOptions], i) => {
                                if (dumbSections.indexOf(sectionName) >= 0) {
                                    return <DefinitionsCard
                                        key={ i }
                                        header='INFO' description={ _.capitalize(sectionName) }
                                        options={ sectionOptions }
                                    />;
                                }
                            })
                        }
                    </Card.Group>
                    <Card.Group itemsPerRow={ 1 }>
                        <RedisClientsCard
                            clients={ clients.result }
                        />
                    </Card.Group>

                </Segment>


            </Segment.Group>
        );
    }
}
