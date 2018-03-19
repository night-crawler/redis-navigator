import React from 'react';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';


ObjectTreeViewWidget.propTypes = {
    result: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    groupArraysAfterLength: PropTypes.number,
};
export default function ObjectTreeViewWidget(props) {
    const { result, groupArraysAfterLength = 20 } = props;
    return (
        <ReactJson
            src={ result }
            groupArraysAfterLength={ groupArraysAfterLength }
            name={ false }
        />
    );
}
