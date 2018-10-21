import React from 'react';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';


ObjectTreeViewWidget.propTypes = {
  result: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  groupArraysAfterLength: PropTypes.number,
};
ObjectTreeViewWidget.defaultProps = {
  groupArraysAfterLength: 20,
};
export function ObjectTreeViewWidget(props) {
  return (
    <ReactJson
      src={ props.result }
      groupArraysAfterLength={ props.groupArraysAfterLength }
      name={ false }
    />
  );
}
