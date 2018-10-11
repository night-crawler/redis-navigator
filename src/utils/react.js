import React from 'react';
import PropTypes from 'prop-types';


export const ReactComponentType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
  PropTypes.instanceOf(React.Component)
]);
