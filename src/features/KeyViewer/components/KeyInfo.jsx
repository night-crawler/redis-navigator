import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import { Table } from 'semantic-ui-react';
import messages from '../messages';


KeyInfo.propTypes = {
    memory_usage: PropTypes.number,
    ttl: PropTypes.number,
    pttl: PropTypes.number,
    object_refcount: PropTypes.number,
    object_encoding: PropTypes.string,
    object_idletime: PropTypes.number,
};

export default function KeyInfo(props) {
    const {
        memory_usage,
        ttl,
        pttl,
        object_refcount,
        object_encoding,
        object_idletime,
    } = props;

    return (
        <Table color='blue' basic='very'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Tr { ...messages.memoryUsage } /></Table.HeaderCell>
                    <Table.HeaderCell><Tr { ...messages.ttl } /></Table.HeaderCell>
                    <Table.HeaderCell><Tr { ...messages.pttl } /></Table.HeaderCell>
                    <Table.HeaderCell><Tr { ...messages.refcount } /></Table.HeaderCell>
                    <Table.HeaderCell><Tr { ...messages.idletime } /></Table.HeaderCell>
                    <Table.HeaderCell><Tr { ...messages.encoding } /></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>{ memory_usage }</Table.Cell>
                    <Table.Cell>{ ttl }</Table.Cell>
                    <Table.Cell>{ pttl }</Table.Cell>
                    <Table.Cell>{ object_refcount }</Table.Cell>
                    <Table.Cell>{ object_idletime }</Table.Cell>
                    <Table.Cell>{ object_encoding }</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
}
