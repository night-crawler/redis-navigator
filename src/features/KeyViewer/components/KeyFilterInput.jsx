import PropTypes from 'prop-types';
import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { injectIntl, intlShape } from 'react-intl';

import messages from '~/features/KeyViewer/messages';

import { uuid4 } from '~/utils';

export class _KeyFilterInput extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    locationSearchParams: PropTypes.shape({
      pattern: PropTypes.string,
      sortKeys: PropTypes.bool,
      scanCount: PropTypes.number,
      ttlSeconds: PropTypes.number,
      perPage: PropTypes.number,
    }),
    onToggleSort: PropTypes.func,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.inputUUID = uuid4();
  }

  render() {
    return <Input
      key={ this.inputUUID }
      defaultValue={ this.props.locationSearchParams.pattern }
      icon='search'
      iconPosition='left'
      fluid={ true }
      onChange={ this.props.onChange }
      action={ this.renderFilterActionButtonGroup() }
      placeholder={ this.props.intl.formatMessage({ ...messages.filterKeys }) }
    />;
  }
  renderFilterActionButtonGroup = () =>
    <Button.Group>
      <Button
        color={ this.props.locationSearchParams.sortKeys ? 'green' : undefined }
        icon='sort alphabet ascending'
        onClick={ this.props.onToggleSort }
      />
      <Button
        icon='remove'
        onClick={ this.handleClearInputButtonClicked }
      />;
    </Button.Group>;
  
  handleClearInputButtonClicked = () => {
    // ! this stupid magic forces input to get rendered again
    this.inputUUID = uuid4();
    this.props.onClear();
  };
}

export const KeyFilterInput = injectIntl(_KeyFilterInput);
