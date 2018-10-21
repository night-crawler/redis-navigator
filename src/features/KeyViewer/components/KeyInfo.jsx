import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import { Table } from 'semantic-ui-react';

import messages from '../messages';


const i18nMemoryUsage = <Tr { ...messages.memoryUsage } />;
const i18nTtl = <Tr { ...messages.ttl } />;
const i18nPttl = <Tr { ...messages.pttl } />;
const i18nRefcount = <Tr { ...messages.refcount } />;
const i18nIdletime = <Tr { ...messages.idletime } />;
const i18nEncoding = <Tr { ...messages.encoding } />;



KeyInfo.propTypes = {
  memory_usage: PropTypes.number,
  ttl: PropTypes.number,
  pttl: PropTypes.number,
  object_refcount: PropTypes.number,
  object_encoding: PropTypes.string,
  object_idletime: PropTypes.number,
};

export function KeyInfo(props) {
  return (
    <Table color='blue' basic='very'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{ i18nMemoryUsage }</Table.HeaderCell>
          <Table.HeaderCell>{ i18nTtl }</Table.HeaderCell>
          <Table.HeaderCell>{ i18nPttl }</Table.HeaderCell>
          <Table.HeaderCell>{ i18nRefcount }</Table.HeaderCell>
          <Table.HeaderCell>{ i18nIdletime }</Table.HeaderCell>
          <Table.HeaderCell>{ i18nEncoding }</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>{ props.memory_usage }</Table.Cell>
          <Table.Cell>{ props.ttl }</Table.Cell>
          <Table.Cell>{ props.pttl }</Table.Cell>
          <Table.Cell>{ props.object_refcount }</Table.Cell>
          <Table.Cell>{ props.object_idletime }</Table.Cell>
          <Table.Cell>{ props.object_encoding }</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
