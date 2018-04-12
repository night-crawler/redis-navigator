import React from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';
import yaml from 'js-yaml';
import messages from '../messages';


KeyUpdateResults.displayName = 'KeyUpdateResults';
KeyUpdateResults.propTypes = {
    results: PropTypes.any,
    hasErrors: PropTypes.bool,
};
function KeyUpdateResults(props) {
    const { hasErrors, results } = props;
    if (results === undefined || hasErrors === undefined)
        return false;

    const iconName = hasErrors ? 'exclamation triangle' : 'thumbs up';
    const data = yaml.dump(results);

    const message = hasErrors
        ? <Tr { ...messages.saveError } />
        : <Tr { ...messages.saveSuccess } />;

    return (
        <Message className='KeyUpdateResults' error={ hasErrors } info={ !hasErrors }>
            <Icon name={ iconName } />
            { message }
            <pre>{ data }</pre>
        </Message>
    );
}

export default KeyUpdateResults;
