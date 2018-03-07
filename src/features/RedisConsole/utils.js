import { compact } from 'lodash';
import React from 'react';


export function reprMethodArgs(parameters) {
    return parameters.map(({ name, kind, default: default_, type }, i) => {
        const color = kind === 'KEYWORD_ONLY' ? 'red' : '';
        const varPositional = kind === 'VAR_POSITIONAL' ? '*' : '';
        const varKeyword = kind === 'VAR_KEYWORD' ? '**' : '';
        const hasDefault = default_ || (typeof default_ === 'number');
        return (
            <span className={ `ui basic ${color} label` } key={ i } title={ kind }>
                { varPositional || varKeyword }{ name }{ type && `:${type}` }
                { hasDefault && `=${default_}` }
            </span>
        );
    });
}


export function cleanMethodDoc(rawDoc, join='\n') {
    if (!rawDoc)
        return '';
    return compact(rawDoc.split('\n').map(part => part.trim())).join(join);
}


export function reprMethodDoc(rawDoc) {
    return cleanMethodDoc(rawDoc).split('\n').map((part, i) => {
        return <div key={ i }>{ part }</div>;
    });
}


export function parametersToJson(parameters) {
    const mappedParams = {};
    parameters.forEach(({ name, kind, default: default_, type }) => {
        const hasDefault = default_ || (typeof default_ === 'number');
        let val = hasDefault ? default_ : undefined;
        if (kind === 'VAR_POSITIONAL')
            val = default_ || [];
        if (kind === 'VAR_KEYWORD')
            val = default_ || {};

        // this values *must* be set in almost all cases
        if (kind === 'POSITIONAL_OR_KEYWORD')
            val = '';
        if (kind === 'POSITIONAL_ONLY')
            val = '';

        mappedParams[name] = val;
    });
    return mappedParams;
}
