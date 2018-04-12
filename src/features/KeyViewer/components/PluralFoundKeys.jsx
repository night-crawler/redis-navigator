import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr, FormattedPlural } from 'react-intl';
import messages from '../messages';


PluralFoundKeys.displayName = 'PluralFoundKeys';
PluralFoundKeys.propTypes = {
    keyCount: PropTypes.number,
};

export function PluralFoundKeys(props) {
    const { keyCount } = props;

    if (keyCount === undefined)
        return false;

    return (
        <div className='PluralFoundKeys'>
            <FormattedPlural
                value={ keyCount }
                zero={ <Tr { ...messages.zeroKeysFound } values={ { keyCount } } /> }
                one={ <Tr { ...messages.oneKeyFound } values={ { keyCount } } /> }
                few={ <Tr { ...messages.fewKeysFound } values={ { keyCount } } /> }
                other={ <Tr { ...messages.otherKeysFound } values={ { keyCount } } /> }
            />
        </div>
    );
}

export default PluralFoundKeys;
