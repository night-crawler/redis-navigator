import _ from 'lodash';
import React from 'react';
import { Card, Header, Input, Responsive, Table } from 'semantic-ui-react';
import styled from 'styled-components';

const CLIENT_FIELDS_KEYS = [
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
    'qbuf-f',
    'obl',
    'oll',
    'omem',
    'events',
    'cmd',
];


const REDIS_CLIENT_FIELDS_VALUES = [
    'an unique 64-bit client ID (introduced in Redis 2.8.12).',
    'address/port of the client',
    'file descriptor corresponding to the socket',
    'total duration of the connection in seconds',
    'idle time of the connection in seconds',
    'client flags (see below)',
    'current database ID',
    'number of channel subscriptions',
    'number of pattern matching subscriptions',
    'number of commands in a MULTI/EXEC context',
    'query buffer length (0 means no query pending)',
    'ree: free space of the query buffer (0 means the buffer is full)',
    'output buffer length',
    'output list length (replies are queued in this list when the buffer is full)',
    'output buffer memory usage',
    'file descriptor events',
    'last command played',
];


const REDIS_CLIENT_FLAGS_TO_NAME_MAPPING = {
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


const REDIS_FILE_DESCRIPTOR_EVENTS_TO_NAME_MAPPING = {
    r: 'the client socket is readable (event loop)',
    w: 'the client socket is writable (event loop)',
};


