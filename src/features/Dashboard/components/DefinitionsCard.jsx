import { lowerCase, pickBy } from 'lodash';
import React from 'react';
import { Button, Card, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import messages from '../messages';

import { ResponsiveDefinitionTable } from './ResponsiveDefinitionTable';

class _DefinitionsCard extends React.Component {
    static propTypes = {
      intl: intlShape.isRequired,
      definitions: PropTypes.object,
      header: PropTypes.oneOfType([
        PropTypes.string, 
        PropTypes.element, 
        PropTypes.func
      ]),
      description: PropTypes.string,
      rowComponent: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
      headerComponent: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
    };

    constructor(props) {
      super(props);
      this.state = {
        filter: ''
      };
    }

    handleFilterChange = (e, { value }) => 
      // eslint-disable-next-line
      this.setState({ filter: value });

    handleClearFilter = () =>
      // eslint-disable-next-line
      this.setState({ filter: '' });

    filterDefinitions = () => pickBy(
      this.props.definitions,
      (optValue, optKey) =>
        lowerCase(optKey).indexOf(lowerCase(this.state.filter)) >= 0
    );

    render() {
      return (
        <Card className='DefinitionsCard'>
          <Card.Content>
            <Card.Header content={ this.props.header } />
            <Card.Meta content={ this.props.description } />

            <Card.Description>
              <Input
                value={ this.state.filter }
                icon='search'
                iconPosition='left'
                fluid={ true }
                onChange={ this.handleFilterChange }
                action={ <Button basic={ true } icon='remove' onClick={ this.handleClearFilter } /> }
                placeholder={ this.props.intl.formatMessage({ ...messages.filterOptions }) }
              />

              <ResponsiveDefinitionTable
                definitions={ this.filterDefinitions() }
                rowComponent={ this.props.rowComponent }
                headerComponent={ this.props.headerComponent }
              />
            </Card.Description>

          </Card.Content>
        </Card>
      );
    }
}

export const DefinitionsCard = injectIntl(_DefinitionsCard);
