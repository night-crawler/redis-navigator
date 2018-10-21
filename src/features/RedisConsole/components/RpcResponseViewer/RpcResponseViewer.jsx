import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../../messages';

import { RpcError } from './RpcError';
import { RpcResult } from './RpcResult';

const i18nCommandHasNotBeenExecutedYet = <Tr { ...messages.commandHasNotBeenExecutedYet } />;


RpcResponseViewer.propTypes = {
  response: PropTypes.shape({
    error: PropTypes.any,
    result: PropTypes.any,
  })
};
RpcResponseViewer.defaultProps = {
  response: {},
};
export function RpcResponseViewer(props) {
  if (props.response.result !== undefined)
    return <RpcResult result={ props.response.result } />;
  if (props.response.error !== undefined)
    return <RpcError error={ props.response.error } />;
  return <div>{ i18nCommandHasNotBeenExecutedYet }</div>;
}
