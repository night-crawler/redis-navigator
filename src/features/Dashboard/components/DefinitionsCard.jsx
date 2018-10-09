import { lowerCase, pickBy } from 'lodash';
import React from 'react';
import { Button, Card, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import messages from '../messages';

import ResponsiveDefinitionTable from './ResponsiveDefinitionTable';


class DefinitionsCard extends React.Component {
    static propTypes = {
      intl: intlShape.isRequired,
      definitions: PropTypes.object,
      header: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
      description: PropTypes.string,
      rowComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
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

    filterDefinitions = () => {
      const { definitions } = this.props;
      const { filter } = this.state;

      return pickBy(
        definitions,
        (optValue, optKey) =>
          lowerCase(optKey).indexOf(lowerCase(filter)) >= 0
      );
    };

    render() {
      const { header, description, intl, rowComponent, headerComponent } = this.props;
      return (
        <Card className='DefinitionsCard'>
          <Card.Content>
            <Card.Header content={ header } />
            <Card.Meta content={ description } />

            <Card.Description>
              <Input
                value={ this.state.filter }
                icon='search'
                iconPosition='left'
                fluid={ true }
                onChange={ this.handleFilterChange }
                action={ <Button basic={ true } icon='remove' onClick={ this.handleClearFilter } /> }
                placeholder={ intl.formatMessage({ ...messages.filterOptions }) }
              />

              <ResponsiveDefinitionTable
                definitions={ this.filterDefinitions() }
                rowComponent={ rowComponent }
                headerComponent={ headerComponent }
              />
            </Card.Description>

          </Card.Content>
        </Card>
      );
    }

}

export default injectIntl(DefinitionsCard);
