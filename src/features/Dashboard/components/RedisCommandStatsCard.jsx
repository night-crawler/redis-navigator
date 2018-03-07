import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import DefinitionsCard from './DefinitionsCard';


function StatsHeader() {
    return (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell textAlign='right' content='Command' />
                <Table.HeaderCell content='Calls' />
                <Table.HeaderCell content='μs' />
                <Table.HeaderCell content='μs / call' />
            </Table.Row>
        </Table.Header>
    );
}


StatsRow.propTypes = {
    defName: PropTypes.string,
    defValue: PropTypes.shape({
        calls: PropTypes.string,
        usec: PropTypes.string,
        usec_per_call: PropTypes.string,
    }),
    textAlign: PropTypes.string,
};
function StatsRow({ defName, defValue, textAlign }) {
    const cmdName = defName.split('cmdstat_').pop();
    const { calls, usec, usec_per_call } = defValue;

    return (
        <Table.Row>
            <Table.Cell textAlign={ textAlign } content={ cmdName } />
            <Table.Cell content={ calls } />
            <Table.Cell content={ usec } />
            <Table.Cell content={ usec_per_call } />
        </Table.Row>
    );
}


RedisCommandsStatsCard.propTypes = {
    stats: PropTypes.object,
};
export default function RedisCommandsStatsCard(props) {
    const { stats } = props;
    return <DefinitionsCard
        header='Command stats'
        headerComponent={ StatsHeader }
        rowComponent={ StatsRow }
        definitions={ stats }
    />;
}