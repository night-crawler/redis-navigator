import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { REDIS_TYPE_ICON_MAP } from 'constants';


KeyTypeIcon.propTypes = {
    keyType: PropTypes.string.isRequired,
};

export default function KeyTypeIcon(props) {
    const { keyType } = props;
    const iconOpts = REDIS_TYPE_ICON_MAP[keyType] || { name: 'spinner' };

    return <Popup
        position='right center'
        trigger={ <Icon { ...iconOpts } /> }
        content={ keyType }
    />;
}
