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

export function RpcError(props) {
  const { error } = props;
  const errorRepr = isArray(error.data) || isPlainObject(error.data)
    ? <ReactJson src={ error.data } name={ false } />
    : <div className='plain-error'>{ error.data }</div>;

  return (
    <div className='RpcError'>
      <Header as='h4'>
        <Header.Content>{ error.message }</Header.Content>
        <Header.Subheader>Code: { error.code }</Header.Subheader>
      </Header>
      { errorRepr }
    </div>
  );
}
