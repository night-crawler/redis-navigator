import PropTypes from 'prop-types';
import React from 'react';
import './KeyRow.css';
import KeyTypeIcon from './KeyTypeIcon';


KeyRow.propTypes = {
    style: PropTypes.object.isRequired,
    keyType: PropTypes.string,
    item: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};
export default function KeyRow(props) {
    const { style, keyType, item, onClick } = props;

    return (
        <div className='redis-navigator key-row' style={ style }>
            <KeyTypeIcon keyType={ keyType } />
            <span onClick={ () => onClick(item) }>{ item }</span>
        </div>
    );
}
