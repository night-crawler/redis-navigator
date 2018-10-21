import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';
import yaml from 'js-yaml';

import messages from '../messages';

const i18nSaveError = <Tr { ...messages.saveError } />;
const i18nSaveSuccess = <Tr { ...messages.saveSuccess } />;

KeyUpdateResults.displayName = 'KeyUpdateResults';
KeyUpdateResults.propTypes = {
  results: PropTypes.any,
  hasErrors: PropTypes.bool,
};
export function KeyUpdateResults(props) {
  if (props.results === undefined || props.hasErrors === undefined)
    return false;
  
  return (
    <div className='KeyUpdateResults'>
      <Icon name={ props.hasErrors ? 'exclamation triangle' : 'thumbs up' } />

      { props.hasErrors 
        ? i18nSaveError 
        : i18nSaveSuccess }

      <pre>{ yaml.dump(props.results) }</pre>
    </div>
  );
}
