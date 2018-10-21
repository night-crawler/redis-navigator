import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../messages';

import { DefinitionsCard } from './DefinitionsCard';
import { RedisClientsCard } from './RedisClientsCard';
import { RedisCommandsStatsCard } from './RedisCommandStatsCard';
import { RedisKeySpaceCard } from './RedisKeySpaceCard';

const i18nConfiguration = <Tr { ...messages.configuration } />;
const i18nMiscellaneous = <Tr { ...messages.miscellaneous } />;
const i18nInformation = <Tr { ...messages.information } />;

export class Dashboard extends React.Component {
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
      this.state = {};
    }

    componentDidMount() {
      if (isEmpty(this.props.routeInstanceInfo))
        this.props.actions.fetchInfo(this.props.routeInstanceName);
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
      if (isEmpty(this.props.routeInstanceInfo))
        return (
          <Dimmer active={ true }>
            <Loader size='massive'>
              <Tr 
                { ...messages.loadingRedisInstanceInfo } 
                values={ { routeInstanceName: this.props.routeInstanceName } } 
              />
            </Loader>
          </Dimmer>
        );

      const { clients, config, dbsize, name, sections } = this.props.routeInstanceInfo;

      return (
        <Segment.Group className='Dashboard'>
          <Helmet>
            <title>{ `Dashboard: ${this.props.routeInstanceName}` }</title>
          </Helmet>

          <Segment>
            <Header as='h2'>
              <Icon name='settings' />
              <Header.Content>{ i18nConfiguration }</Header.Content>
            </Header>

            <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
              <DefinitionsCard
                header={ i18nConfiguration }
                definitions={ config.result }
              />

              <DefinitionsCard
                header={ i18nMiscellaneous }
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
              <Header.Content>{ i18nInformation }</Header.Content>
            </Header>

            <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
              <DefinitionsCard 
                header={ <Tr { ...messages.server } /> }
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
