import PropTypes from 'prop-types';
import React from 'react';

import './KeyRow.css';
import KeyTypeIcon from './KeyTypeIcon';


KeyRow.propTypes = {
  style: PropTypes.object.isRequired,
  keyType: PropTypes.string,
  item: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};
export default function KeyRow(props) {
  const { style, keyType, item, onClick, isActive } = props;
  const activeClass = isActive ? 'active' : '';

  return (
    <div
      className={ `redis-navigator key-row ${activeClass}` }
      style={ style }
      onClick={ () => onClick(item) }
    >
      <KeyTypeIcon keyType={ keyType } />
      <span>{ item }</span>
    </div>
  );
}
