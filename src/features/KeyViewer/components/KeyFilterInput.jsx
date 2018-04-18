import PropTypes from 'prop-types';
import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { injectIntl, intlShape } from 'react-intl';

import messages from 'features/KeyViewer/messages';


KeyFilterInput.defaultProps = {};
KeyFilterInput.propTypes = {
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

function KeyFilterInput(props) {
    const {
        intl,
        locationSearchParams,
        onToggleSort,
        onClear,
        onChange,
    } = props;

    const filterActionButtonGroup =
        <Button.Group>
            <Button
                color={ locationSearchParams.sortKeys ? 'green' : undefined }
                icon='sort alphabet ascending'
                onClick={ onToggleSort }
            />
            <Button
                icon='remove'
                onClick={ onClear }
            />;
        </Button.Group>;

    return <Input
        defaultValue={ locationSearchParams.pattern }
        icon='search'
        iconPosition='left'
        fluid={ true }
        onChange={ onChange }
        action={ filterActionButtonGroup }
        placeholder={ intl.formatMessage({ ...messages.filterKeys }) }
    />;

}

export default injectIntl(KeyFilterInput);
