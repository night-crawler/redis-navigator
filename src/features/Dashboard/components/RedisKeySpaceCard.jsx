import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import DefinitionsCard from './DefinitionsCard';

import { FormattedMessage as Tr } from 'react-intl';
import messages from '../messages';


Header.propTypes = {
    textAlign: PropTypes.string,
};
function Header({ textAlign='right' }) {
    return (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell textAlign={ textAlign } content={ <Tr { ...messages.db } /> } />
                <Table.HeaderCell content={ <Tr { ...messages.keys } /> } />
                <Table.HeaderCell content={ <Tr { ...messages.expires } /> } />
                <Table.HeaderCell content={ <Tr { ...messages.avgTTL } /> } />
            </Table.Row>
        </Table.Header>
    );
}


StatsRow.propTypes = {
    defName: PropTypes.string,
    defValue: PropTypes.shape({
        keys: PropTypes.string,
        expires: PropTypes.string,
        avg_ttl: PropTypes.string,
    }),
    textAlign: PropTypes.string,
};
function StatsRow({ defName, defValue, textAlign }) {
    const { keys, expires, avg_ttl } = defValue;

    return (
        <Table.Row>
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
export default function RedisKeySpaceCard(props) {
    const { keyspace } = props;
    return <DefinitionsCard
        header={ <Tr { ...messages.keySpace } /> }
        headerComponent={ Header }
        rowComponent={ StatsRow }
        definitions={ keyspace }
    />;
}
