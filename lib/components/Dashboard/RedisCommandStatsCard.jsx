import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Card, Input, Table } from 'semantic-ui-react';
import ResponsiveDefinitionTable from './ResponsiveDefinitionTable';


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


export default class RedisCommandsStatsCard extends React.Component {
    static propTypes = {
        stats: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            filter: ''
        };
    }

    handleFilterChange = (e, { value }) => {
        this.setState({ filter: value });
    };

    handleClearFilter = () => {
        this.setState({ filter: '' });
    };

    filterOptions = () => {
        const { stats } = this.props;
        const { filter } = this.state;

        return _(stats)
            .pickBy((optValue, optKey) =>
                _.lowerCase(optKey).indexOf(_.lowerCase(filter)) >= 0)
            .value();
    };

    render() {
        const { stats } = this.props;

        return (
            <Card>
                <Card.Content>
                    <Card.Header content='Command Stats' />
                    <Card.Description>
                        <Input
                            value={ this.state.filter }
                            icon='search'
                            iconPosition='left'
                            fluid={ true }
                            onChange={ this.handleFilterChange }
                            label={ <Button basic={ true } icon='remove' onClick={ this.handleClearFilter } /> }
                            labelPosition='right'
                            placeholder='Filter options...'
                        />

                        <ResponsiveDefinitionTable
                            definitions={ this.filterOptions(stats) }
                            headerComponent={ StatsHeader }
                            rowComponent={ StatsRow }
                        />
                    </Card.Description>

                </Card.Content>
            </Card>
        );
    }

}
