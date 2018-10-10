import React from 'react';
import { Responsive, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


OptionRow.propTypes = {
  textAlign: PropTypes.string,
  defName: PropTypes.string,
  defValue: PropTypes.any,
};
function OptionRow(props) {
  const { textAlign, defName, defValue } = props;

  return (
    <Table.Row>
      <Table.Cell textAlign={ textAlign } width={ 8 }>
        { defName }
      </Table.Cell>
      <Table.Cell width={ 8 }>
        { defValue === '' ? '-' : defValue }
      </Table.Cell>
    </Table.Row>
  );
}

const TableWrapper = styled.div`
  max-height: 50vh;  
  overflow-y: auto;
`;


export class ResponsiveDefinitionTable extends React.Component {
    static propTypes = {
      definitions: PropTypes.object,
      rowComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    };

    state = {};
    handleOnUpdate = (e, { width }) => this.setState({ width });

    render() {
      const { definitions, rowComponent = OptionRow, headerComponent } = this.props;
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
            { HeaderComponent && <HeaderComponent textAlign={ textAlign } /> }

            <Table.Body>
              { Object.entries(definitions).map(([defName, defValue], i) =>
                <RowComponent { ...{ defName, defValue, textAlign } } key={ i } />
              ) }
            </Table.Body>
          </Table>

        </Responsive>

      );
    }
}
