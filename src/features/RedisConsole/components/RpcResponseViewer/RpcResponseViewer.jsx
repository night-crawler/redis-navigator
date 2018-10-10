import PropTypes from 'prop-types';
import React from 'react';

import { RpcError } from './RpcError';
import { RpcResult } from './RpcResult';


RpcResponseViewer.propTypes = {
  response: PropTypes.shape({
    error: PropTypes.any,
    result: PropTypes.any,
  })
};
export function RpcResponseViewer(props) {
  const { response: { result, error } } = props;
  if (result !== undefined) {
    return <RpcResult result={ result } />;
  }
  if (error !== undefined) {
    return <RpcError error={ error } />;
  }
  return <div>Command has not been executed yet...</div>;
}
