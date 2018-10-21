import PropTypes from 'prop-types';
import React from 'react';


const parameterType = {
  name: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  default: PropTypes.any,
  type: PropTypes.string,
};


MethodParameter.propTypes = parameterType;

export function MethodParameter(props) {
  const color = props.kind === 'KEYWORD_ONLY' ? 'red' : '';
  const varPositional = props.kind === 'VAR_POSITIONAL' ? '*' : '';
  const varKeyword = props.kind === 'VAR_KEYWORD' ? '**' : '';
  const hasDefault = props.default || (typeof props.default === 'number');
  return (
    <span className={ `ui basic ${color} label MethodParameter` } title={ props.kind }>
      { varPositional || varKeyword }{ props.name }{ props.type && `:${props.type}` }
      { hasDefault && `=${props.default}` }
    </span>
  );
}


MethodParametersList.propTypes = {
  parameters: PropTypes.arrayOf(PropTypes.shape(parameterType)),
};
export function MethodParametersList(props) {
  return props.parameters.map(
    (params, i) => <MethodParameter key={ i } { ...params } />
  );
}
