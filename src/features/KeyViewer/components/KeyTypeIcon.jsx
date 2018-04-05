import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';


KeyTypeIcon.propTypes = {
    keyType: PropTypes.string.isRequired,
};

export default function KeyTypeIcon(props) {
    const { keyType } = props;
    const iconOpts = {
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
    }[keyType] || { name: 'bug', color: 'red' };

    return <Popup
        position='right center'
        trigger={ <Icon { ...iconOpts } /> }
        content={ keyType }
    />;
}
