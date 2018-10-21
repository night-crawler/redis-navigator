import PropTypes from 'prop-types';
import React from 'react';

import './KeyRow.css';
import { KeyTypeIcon } from './KeyTypeIcon';


KeyRow.propTypes = {
  style: PropTypes.object.isRequired,
  keyType: PropTypes.string,
  item: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};
export function KeyRow(props) {
  return (
    <div
      className={ `redis-navigator key-row ${props.isActive ? 'active' : ''}` }
      style={ props.style }
      onClick={ () => props.onClick(props.item) }
    >
      <KeyTypeIcon keyType={ props.keyType } />
      <span>{ props.item }</span>
    </div>
  );
}
