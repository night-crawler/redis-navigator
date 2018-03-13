import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isString, isPlainObject, isArray } from 'lodash';
import { Header, Segment } from 'semantic-ui-react';
import ReactJson from 'react-json-view';
import { isBase64 } from '../../../utils';

RpcResult.propTypes = {
    result: PropTypes.any,
};
function RpcResult(props) {
    const { result } = props;

    if (isArray(result) || isPlainObject(result)) {
        return <ReactJson
            src={ result }
            groupArraysAfterLength={ 20 }
            name={ false }
        />;
    }

    if (isString(result)) {
        return <div>{ isBase64(result) ? atob(result) : result }</div>;
    }

    return <div>{ result }</div>;
}

RpcError.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string,
        data: PropTypes.any,
    }),
};
function RpcError(props) {
    const { error } = props;

    return (
        <div>
            <Header as='h4'>
                <Header.Content>{ error.message }</Header.Content>
                <Header.Subheader>Code: { error.code }</Header.Subheader>
            </Header>
            { error.data && <ReactJson src={ error.data } name={ false } /> }
        </div>
    );
}


RpcResponse.propTypes = {
    response: PropTypes.shape({
        error: PropTypes.any,
        result: PropTypes.any,
    })
};
export default function RpcResponse(props) {
    const { response: { result, error } } = props;
    if (result !== undefined) {
        return <RpcResult result={ result } />;
    }
    if (error !== undefined) {
        return <RpcError error={ error } />;
    }
    return <div>Command is not executed yet...</div>;
}