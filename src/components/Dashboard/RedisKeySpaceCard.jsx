import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import DefinitionsCard from './DefinitionsCard';

Header.propTypes = {
    textAlign: PropTypes.string,
};
function Header({ textAlign='right' }) {
    return (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell textAlign={ textAlign } content='DB' />
                <Table.HeaderCell content='Keys' />
                <Table.HeaderCell content='Expires' />
                <Table.HeaderCell content='Avg TTL' />
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
        header='Keyspace'
        headerComponent={ Header }
        rowComponent={ StatsRow }
        definitions={ keyspace }
    />;
}
