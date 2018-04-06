import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';


const ICON_MAP = {
    list: {
        name: 'list layout',
        color: 'yellow',
    },
    set: {
        name: 'usb',
        color: 'brown',
    },
    zset: {
        name: 'ordered list',
        color: 'orange',
    },
    hash: {
        name: 'sitemap',
        color: 'violet',
    },
    string: {
        name: 'ellipsis horizontal',
        color: 'blue',
    },
    none: {
        name: 'question',
        color: 'pink'
    },
};


KeyTypeIcon.propTypes = {
    keyType: PropTypes.string.isRequired,
};

export default function KeyTypeIcon(props) {
    const { keyType } = props;
    const iconOpts = ICON_MAP[keyType] || { name: 'spinner' };

    return <Popup
        position='right center'
        trigger={ <Icon { ...iconOpts } /> }
        content={ keyType }
    />;
}
