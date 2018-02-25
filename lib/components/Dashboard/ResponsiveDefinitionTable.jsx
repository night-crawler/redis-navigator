import React from 'react';
import { Responsive, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


OptionRow.propTypes = {
    textAlign: PropTypes.string,
    optionName: PropTypes.string,
    optionValue: PropTypes.any,
};
function OptionRow(props) {
    const { textAlign, optionName, optionValue } = props;

    return (
        <Table.Row>
            <Table.Cell textAlign={ textAlign } width={ 8 }>
                { optionName }
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
    static propTypes = {
        options: PropTypes.object,
        rowComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
        headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    };

    state = {};
    handleOnUpdate = (e, { width }) => this.setState({ width });

    render() {
        const { options, rowComponent = OptionRow, headerComponent } = this.props;
        const [ RowComponent, HeaderComponent ] = [ rowComponent, headerComponent ];
        const { width } = this.state;
        const textAlign = width >= Responsive.onlyComputer.minWidth ? 'right' : 'left';

        return (
            <Responsive
                as={ TableWrapper }
                columns={ 1 }
                fireOnMount={ true }
                onUpdate={ this.handleOnUpdate }
            >
                <Table basic='very' celled={ true } compact='very' definition={ true } size='small'>
                    {
                        HeaderComponent ? <HeaderComponent textAlign={ textAlign } /> : null
                    }

                    <Table.Body>
                        {
                            Object.entries(options).map(([optionName, optionValue], i) =>
                                <RowComponent
                                    { ...{ optionName, optionValue, textAlign } }
                                    key={ i }
                                />
                            )
                        }
                    </Table.Body>
                </Table>

            </Responsive>

        );
    }
}
