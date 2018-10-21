import React from 'react';
import { Responsive, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactComponentType } from '~/utils/react';


OptionRow.propTypes = {
  textAlign: PropTypes.string,
  defName: PropTypes.string,
  defValue: PropTypes.any,
};
function OptionRow(props) {
  return (
    <Table.Row>
      <Table.Cell textAlign={ props.textAlign } width={ 8 }>
        { props.defName }
      </Table.Cell>
      <Table.Cell width={ 8 }>
        { props.defValue === '' ? '-' : props.defValue }
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
    rowComponent: ReactComponentType,
    headerComponent: ReactComponentType,
  };

  static defaultProps = {
    rowComponent: OptionRow,
    definitions: {},
  };

  state = {};
  handleOnUpdate = (e, { width }) => 
    // eslint-disable-next-line
    this.setState({ width });

  render() {
    const { 
      definitions, 
      rowComponent: RowComponent, 
      headerComponent: HeaderComponent 
    } = this.props;
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
