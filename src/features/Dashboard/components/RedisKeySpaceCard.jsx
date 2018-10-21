import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../messages';

import { DefinitionsCard } from './DefinitionsCard';

const i18nDb = <Tr { ...messages.db } />;
const i18nKeys = <Tr { ...messages.keys } />;
const i18nExpires = <Tr { ...messages.expires } />;
const i18nAvgTTL = <Tr { ...messages.avgTTL } />;
const i18nKeySpace = <Tr { ...messages.keySpace } />;

RedisKeySpaceHeader.propTypes = {
  textAlign: PropTypes.string,
};
function RedisKeySpaceHeader({ textAlign='right' }) {
  return (
    <Table.Header className='RedisKeySpaceHeader'>
      <Table.Row>
        <Table.HeaderCell textAlign={ textAlign } content={ i18nDb } />
        <Table.HeaderCell content={ i18nKeys } />
        <Table.HeaderCell content={ i18nExpires } />
        <Table.HeaderCell content={ i18nAvgTTL } />
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
  return (
    <Table.Row className='RedisKeySpaceRow'>
      <Table.Cell textAlign={ textAlign } content={ defName } />
      <Table.Cell content={ defValue.keys } />
      <Table.Cell content={ defValue.expires } />
      <Table.Cell content={ defValue.avg_ttl } />
    </Table.Row>
  );
}


RedisKeySpaceCard.propTypes = {
  keyspace: PropTypes.object,
};
export function RedisKeySpaceCard(props) {
  return <DefinitionsCard
    header={ i18nKeySpace }
    headerComponent={ RedisKeySpaceHeader }
    rowComponent={ RedisKeySpaceRow }
    definitions={ props.keyspace }
  />;
}
