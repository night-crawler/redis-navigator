import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../messages';

import { DefinitionsCard } from './DefinitionsCard';


RedisKeySpaceHeader.propTypes = {
  textAlign: PropTypes.string,
};
function RedisKeySpaceHeader({ textAlign='right' }) {
  return (
    <Table.Header className='RedisKeySpaceHeader'>
      <Table.Row>
        <Table.HeaderCell textAlign={ textAlign } content={ <Tr { ...messages.db } /> } />
        <Table.HeaderCell content={ <Tr { ...messages.keys } /> } />
        <Table.HeaderCell content={ <Tr { ...messages.expires } /> } />
        <Table.HeaderCell content={ <Tr { ...messages.avgTTL } /> } />
      </Table.Row>
    </Table.Header>
  );
}


RedisKeySpaceRow.propTypes = {
  defName: PropTypes.string,
  defValue: PropTypes.shape({
    keys: PropTypes.string,
    expires: PropTypes.string,
    avg_ttl: PropTypes.string,
  }),
  textAlign: PropTypes.string,
};
function RedisKeySpaceRow({ defName, defValue, textAlign }) {
  const { keys, expires, avg_ttl } = defValue;

  return (
    <Table.Row className='RedisKeySpaceRow'>
      <Table.Cell textAlign={ textAlign } content={ defName } />
      <Table.Cell content={ keys } />
      <Table.Cell content={ expires } />
      <Table.Cell content={ avg_ttl } />
    </Table.Row>
  );
}


RedisKeySpaceCard.propTypes = {
  keyspace: PropTypes.object,
};
export function RedisKeySpaceCard(props) {
  const { keyspace } = props;
  return <DefinitionsCard
    header={ <Tr { ...messages.keySpace } /> }
    headerComponent={ RedisKeySpaceHeader }
    rowComponent={ RedisKeySpaceRow }
    definitions={ keyspace }
  />;
}
