import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr, FormattedPlural } from 'react-intl';

import messages from '../messages';


PluralFoundKeys.displayName = 'PluralFoundKeys';
PluralFoundKeys.propTypes = {
  keyCount: PropTypes.number,
};
export function PluralFoundKeys(props) {
  if (props.keyCount === undefined)
    return false;

  return (
    <div className='PluralFoundKeys'>
      <FormattedPlural
        value={ props.keyCount }
        zero={ <Tr { ...messages.zeroKeysFound } values={ { keyCount: props.keyCount } } /> }
        one={ <Tr { ...messages.oneKeyFound } values={ { keyCount: props.keyCount } } /> }
        few={ <Tr { ...messages.fewKeysFound } values={ { keyCount: props.keyCount } } /> }
        other={ <Tr { ...messages.otherKeysFound } values={ { keyCount: props.keyCount } } /> }
      />
    </div>
  );
}