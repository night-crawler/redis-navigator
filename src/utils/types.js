import checkIsBase64 from 'is-base64';
import yaml from 'js-yaml';
import { isArray, isEmpty, isPlainObject, isString, some } from 'lodash';


export function isValidJson(rawStr) {
  if (!isString(rawStr) || !rawStr)
    return false;

  try {
    return !!JSON.parse(rawStr);
  } catch (err) {
    return false;
  }
}


export function isValidYaml(rawStr) {
  if (!isString(rawStr) || !rawStr)
    return false;

  try {
    return !!yaml.safeLoad(rawStr);
  } catch (e) {
    return false;
  }
}


export function isJson(rawStr, checks = [ isPlainObject, isArray ]) {
  const isValid = isValidJson(rawStr);
  if (!isValid)
    return false;

  if (isEmpty(checks))
    return true;

  const data = JSON.parse(rawStr);
  // believe it's json only if it is an object/array
  return some(checks.map(check => check(data)));
}


export function isYaml(rawStr, checks = [ isPlainObject ]) {
  if (!isValidYaml(rawStr))
    return false;

  // it should not be json and yaml simultaneously
  if (isValidJson(rawStr))
    return false;

  if (isEmpty(checks))
    return true;

  const data = yaml.safeLoad(rawStr);
  return some(checks.map(check => check(data)));
}



export function isBase64(rawStr, minLength = 4) {
  if (!rawStr)
    return false;

  if (!isString(rawStr))
    return false;

  if (rawStr.length <= minLength)
    return false;

  return checkIsBase64(rawStr, { paddingRequired: true });
}


export function isValidNumber(value) {
  if (isString(value) && !value)
    return false;
    // _.isNumber(NaN) === true, lol
    // typeof NaN === 'number' <-- true
  return !isNaN(+value);
}
