import { compact, every, isArray, isPlainObject, fromPairs, isEmpty } from 'lodash';
import React from 'react';


export function cleanMethodDoc(rawDoc, join='\n') {
  if (!rawDoc)
    return '';
  return compact(
    rawDoc.split('\n').map(part => part.trim())
  ).join(join);
}


export function reprMethodDoc(rawDoc) {
  return cleanMethodDoc(rawDoc).split('\n').map((part, i) => {
    return <div key={ i }>{ part }</div>;
  });
}


export function methodParameterToSingleValue(params) {
  // eslint-disable-next-line
    const { name, kind, default: default_ = null, type } = params;
  if (kind === 'VAR_POSITIONAL')
    return default_ || [];
  if (kind === 'VAR_KEYWORD')
    return default_ || {};

  let val;
  if (kind === 'POSITIONAL_OR_KEYWORD' || kind === 'POSITIONAL_ONLY')
    val = '';
  if (default_ !== null)
    val = default_;

  // undefined for the rest
  return val;
}

export function parametersToJson(parameters) {
  return fromPairs(parameters.map(
    ({ name, ...rest }) => [ name, methodParameterToSingleValue(rest) ]
  ));
}


export function checkCommandShapeValid(command) {
  if (!isPlainObject(command))
    return false;

  if (isEmpty(command))
    return true;

  // every command must have a methodName attribute
  if (typeof command.methodName !== 'string')
    return false;

  // if there's methodParams, it should be a mapping
  if (command.methodParams !== undefined)
    if (!isPlainObject(command.methodParams))
      return false;

  return true;
}


export function checkCommandsValid(commands) {
  if (!isArray(commands))
    return false;

  return every(commands.map(
    command => checkCommandShapeValid(command)
  ));
}
