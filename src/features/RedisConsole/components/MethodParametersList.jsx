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
    const { name, kind, default: default_, type } = props;
    const color = kind === 'KEYWORD_ONLY' ? 'red' : '';
    const varPositional = kind === 'VAR_POSITIONAL' ? '*' : '';
    const varKeyword = kind === 'VAR_KEYWORD' ? '**' : '';
    const hasDefault = default_ || ( typeof default_ === 'number' );
    return (
        <span className={ `ui basic ${color} label` } title={ kind }>
            { varPositional || varKeyword }{ name }{ type && `:${type}` }
            { hasDefault && `=${default_}` }
        </span>
    );
}


MethodParametersList.propTypes = {
    parameters: PropTypes.arrayOf(PropTypes.shape(parameterType)),
};
export default function MethodParametersList(props) {
    const { parameters } = props;
    return parameters.map(
        (params, i) => <MethodParameter key={ i } { ...params } />
    );
}
