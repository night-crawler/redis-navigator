import _ from 'lodash';
import React from 'react';
import { Card, Header, Input, Responsive, Table } from 'semantic-ui-react';
import styled from 'styled-components';


function OptionRow(props) {
    const { textAlign, optionName, optionValue } = props;

    return (
        <Table.Row>
            <Table.Cell textAlign={ textAlign } width={ 8 }>
                <Header as='h4'>
                    <Header.Content>
                        { optionName }
                    </Header.Content>
                </Header>
            </Table.Cell>
            <Table.Cell width={ 8 }>
                { optionValue === '' ? '-' : optionValue }
            </Table.Cell>
        </Table.Row>
    );
}

const TableWrapper = styled.div`
  height: 50vh;  
  overflow-y: scroll;
`;

class OptionList extends React.Component {
    state = {};
    handleOnUpdate = (e, { width }) => this.setState({ width });

    render() {
        const { options } = this.props;
        const { width } = this.state;
        const textAlign = width >= Responsive.onlyComputer.minWidth ? 'right' : 'left';

        return (
            <Responsive
                as={ TableWrapper }
                columns={ 1 }
                fireOnMount={ true }
                onUpdate={ this.handleOnUpdate }
            >

                <Table basic='very' celled={ true } compact={ true } definition={ true } size='small'>
                    <Table.Body>
                        {
                            Object.entries(options).map(([optionName, optionValue], i) => {
                                return <OptionRow
                                    { ...{ optionName, optionValue, textAlign } }
                                    key={ i }
                                />;
                            })
                        }
                    </Table.Body>
                </Table>

            </Responsive>

        );
    }
}


class OptionsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: ''
        };
    }

    handleFilterChange = (e, { value }) => {
        this.setState({ filter: value });
    };

    filterOptions = () => {
        const { options } = this.props;
        const { filter } = this.state;

        return _(options)
            .pickBy((optValue, optKey) =>
                _.lowerCase(optKey).indexOf(_.lowerCase(filter)) >= 0)
            .value();
    };

    render() {
        const { header, description, error, options } = this.props;
        return (
            <Card>
                <Card.Content>
                    <Card.Header content={ header } />
                    <Card.Meta content={ description } />
                    {
                        error
                            ? <Card.Description>Error</Card.Description>
                            : (
                                <Card.Description>
                                    <Input fluid={ true } onChange={ this.handleFilterChange } />
                                    <OptionList options={ this.filterOptions() } />
                                </Card.Description>
                            )
                    }
                </Card.Content>
            </Card>
        );
    }

}


export default class Dashboard extends React.Component {
    render() {
        const { clients, config, dbsize, name, sections } = this.props;
        const dumbSections = [
            'server',
            'clients',
            'memory',
            'persistence',
            'stats',
            'replication',
            'cpu',
            'cluster',
        ];

        return (
            <Card.Group itemsPerRow={ 3 } doubling={ true } stackable={ true }>
                <OptionsCard
                    header='Configuration' description='CONFIG GET'
                    options={ config.result } error={ config.error }
                />

                {

                    Object.entries(sections.result).map(([sectionName, sectionOptions], i) => {
                        if (dumbSections.indexOf(sectionName) >= 0) {
                            return <OptionsCard
                                key={ i }
                                header='INFO' description={ _.capitalize(sectionName) }
                                options={ sectionOptions }
                            />;
                        }
                    })
                }

                <OptionsCard
                    header='Miscellaneous' description=''
                    options={ {
                        dbsize: _.has(dbsize, 'error') ? 'error' : dbsize.result,
                        name: _.has(name, 'error') ? 'error' : name.result || '-',
                    } }
                />


            </Card.Group>
        );
    }
}
