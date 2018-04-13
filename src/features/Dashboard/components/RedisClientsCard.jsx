import _ from 'lodash';
import React from 'react';
import { Card, Table, Popup, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../messages';


const FIELD_NAMES = [
    'id',
    'addr',
    'fd',
    'age',
    'idle',
    'flags',
    'db',
    'sub',
    'psub',
    'multi',
    'qbuf',
    'qbuf-free',
    'obl',
    'oll',
    'omem',
    'events',
    'cmd',
];


const FIELD_DESCRIPTIONS = [
    'an unique 64-bit client ID (introduced in Redis 2.8.12).',
    'address/port of the client',
    'file descriptor corresponding to the socket',
    'total duration of the connection in seconds',
    'idle time of the connection in seconds',
    'client flags',
    'current database ID',
    'number of channel subscriptions',
    'number of pattern matching subscriptions',
    'number of commands in a MULTI/EXEC context',
    'query buffer length (0 means no query pending)',
    'free space of the query buffer (0 means the buffer is full)',
    'output buffer length',
    'output list length (replies are queued in this list when the buffer is full)',
    'output buffer memory usage',
    'file descriptor events',
    'last command played',
];


const FIELD_NAME_TO_DESCRIPTION_MAPPING = _.zipObject(FIELD_NAMES, FIELD_DESCRIPTIONS);


const CLIENT_FLAGS_MAPPING = {
    O: 'the client is a slave in MONITOR mode',
    S: 'the client is a normal slave server',
    M: 'the client is a master',
    x: 'the client is in a MULTI/EXEC context',
    b: 'the client is waiting in a blocking operation',
    i: 'the client is waiting for a VM I/O (deprecated)',
    d: 'a watched keys has been modified - EXEC will fail',
    c: 'connection to be closed after writing entire reply',
    u: 'the client is unblocked',
    U: 'the client is connected via a Unix domain socket',
    r: 'the client is in readonly mode against a cluster node',
    A: 'connection to be closed ASAP',
    N: 'no specific flag set',
};


const CLIENT_EVENTS_MAPPING = {
    r: 'the client socket is readable (event loop)',
    w: 'the client socket is writable (event loop)',
};


function getFlagsRepr(flags, flagMapping) {
    if (typeof flags !== 'string')
        throw new Error('Flags must be a string');

    return (
        <div>
            {
                [...flags].map((flag, i) =>
                    <Popup
                        key={ i }
                        wide={ true }
                        trigger={ <Label>{ flag }</Label> }
                        content={ flagMapping[flag] }
                    />
                )
            }
        </div>
    );

}

/*
'115', '127.0.0.1:4638', '7','', '165141', '0', 'N', '0', '0', '0', '-1', '29', '32739', '0', '1', '6393', 'r', 'client'
*/
ClientRow.propTypes = {
    clientArray: PropTypes.arrayOf(PropTypes.string),
};
function ClientRow(props) {
    // removes extra empty value at pos 3
    let clientArray = _.compact(props.clientArray);

    if (_.isEmpty(clientArray))
        return <Table.Row><Table.Cell>Bad</Table.Cell></Table.Row>;

    const flagsPos = FIELD_NAMES.indexOf('flags');
    clientArray[flagsPos] = getFlagsRepr(clientArray[flagsPos], CLIENT_FLAGS_MAPPING);

    const eventsPos = FIELD_NAMES.indexOf('events');
    clientArray[eventsPos] = getFlagsRepr(clientArray[eventsPos], CLIENT_EVENTS_MAPPING);

    return (
        <Table.Row>
            {
                clientArray.map((clientOption, i) =>
                    <Table.Cell key={ i }>{ clientOption }</Table.Cell>
                )
            }
        </Table.Row>
    );
}


function ClientHeader() {
    return (
        <Table.Header className='ClientHeader'>
            <Table.Row>
                {
                    FIELD_NAMES.map((fieldName, i) =>
                        <Table.HeaderCell key={ i }>
                            <Popup
                                wide={ true }
                                trigger={ <span>{ fieldName }</span> }
                                content={ FIELD_NAME_TO_DESCRIPTION_MAPPING[fieldName] }
                            />

                        </Table.HeaderCell>
                    )
                }
            </Table.Row>
        </Table.Header>
    );
}


export default class RedisClientsCard extends React.Component {
    static propTypes = {
        clients: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    };

    render() {
        const { clients } = this.props;

        return (
            <Card fluid={ true } className='RedisClientsCard'>
                <Card.Content>
                    <Card.Header content={ <Tr { ...messages.clients } /> } />

                    <Table celled={ true } compact='very' unstackable={ true } size='small' textAlign='center'>
                        <ClientHeader />
                        <Table.Body>
                            {
                                clients.map((clientArray, i) =>
                                    <ClientRow key={ i } clientArray={ clientArray } />
                                )
                            }
                        </Table.Body>
                    </Table>

                </Card.Content>
            </Card>
        );
    }
}
