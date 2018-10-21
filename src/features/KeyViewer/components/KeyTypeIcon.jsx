import { REDIS_KEY_TYPE_ICON_MAP } from '~/constants';

import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';


KeyTypeIcon.propTypes = {
  keyType: PropTypes.string.isRequired,
};

export function KeyTypeIcon(props) {
  const iconOpts = REDIS_KEY_TYPE_ICON_MAP[ props.keyType || 'loading' ];

  return <Popup
    position='right center'
    trigger={ <Icon { ...iconOpts } /> }
    content={ props.keyType }
  />;
}
