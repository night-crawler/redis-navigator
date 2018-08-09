import PropTypes from 'prop-types';
import React from 'react';

import RpcError from './Error';
import Result from './Result';


Response.propTypes = {
    response: PropTypes.shape({
        error: PropTypes.any,
        result: PropTypes.any,
    })
};
export default function Response(props) {
    const { response: { result, error } } = props;
    if (result !== undefined) {
        return <Result result={ result } />;
    }
    if (error !== undefined) {
        return <RpcError error={ error } />;
    }
    return <div>Command has not been executed yet...</div>;
}
