import { isArray, isPlainObject } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ReactJson from 'react-json-view';
import { Header } from 'semantic-ui-react';

RpcError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    data: PropTypes.any,
    code: PropTypes.any,
  }),
};
RpcError.defaultProps = {
  error: {},
};
export function RpcError(props) {
  const errorRepr = isArray(props.error.data) || isPlainObject(props.error.data)
    ? <ReactJson src={ props.error.data } name={ false } />
    : <div className='plain-error'>{ props.error.data }</div>;

  return (
    <div className='RpcError'>
      <Header as='h4'>
        <Header.Content>{ props.error.message }</Header.Content>
        <Header.Subheader>Code: { props.error.code }</Header.Subheader>
      </Header>
      { errorRepr }
    </div>
  );
}
