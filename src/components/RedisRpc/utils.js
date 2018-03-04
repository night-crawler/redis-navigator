import { compact } from 'lodash';
import React from 'react';


export function reprMethodArgs(parameters) {
    return parameters.map(({ name, kind, default: default_, type }, i) => {
        const color = kind === 'KEYWORD_ONLY' ? 'red' : '';
        const varPositional = kind === 'VAR_POSITIONAL' ? '*' : '';
        const varKeyword = kind === 'VAR_KEYWORD' ? '**' : '';
        return (
            <span className={ `ui basic ${color} label` } key={ i }>
                { varPositional || varKeyword }{ name }{ type && `:${type}` }
                { default_ && `=${default_}` }
            </span>
        );
    });
}


export function cleanMethodDoc(rawDoc, join='\n') {
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
        let val = default_ || '';
        if (kind === 'VAR_POSITIONAL')
            val = default_ || [];
        if (kind === 'VAR_KEYWORD')
            val = default_ || {};

        mappedParams[name] = val;
    });
    return mappedParams;
}
