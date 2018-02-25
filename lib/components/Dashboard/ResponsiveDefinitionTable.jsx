import React from 'react';
import { Header, Responsive, Table } from 'semantic-ui-react';
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
  max-height: 50vh;  
  overflow-y: auto;
`;


export default class ResponsiveDefinitionTable extends React.Component {
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
