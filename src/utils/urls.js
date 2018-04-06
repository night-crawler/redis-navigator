import { isArray, isPlainObject, isString, pickBy, trimEnd, trimStart } from 'lodash';
import 'url-search-params-polyfill';
import { castStringToPrimitive } from './strings';


export function serializeQuery(queryObject, defaults = {}) {
    if (!isPlainObject(queryObject))
        throw new Error(`'queryObject must be an object, but got ${typeof queryObject}: ${queryObject}`);

    if (!isPlainObject(defaults))
        throw new Error(`defaults must be an object, but got ${typeof defaults}: ${defaults}`);

    const nonDefaults = pickBy(queryObject, (val, key) => defaults[ key ] !== val);
    return new URLSearchParams(nonDefaults).toString();
}


export function deserializeQuery(queryString, defaults = {}) {
    if (!isString(queryString))
        throw new Error(`'queryString must be a string, but got ${typeof queryString}: ${queryString}`);

    if (!isPlainObject(defaults))
        throw new Error(`defaults must be an object, but got ${typeof defaults}: ${defaults}`);

    const queryObject = {};
    const parsed = new URLSearchParams(queryString);

    for (let [ param, value ] of parsed) {
        value = castStringToPrimitive(value);
        const existingValue = queryObject[ param ];

        if (existingValue === undefined) {
            queryObject[ param ] = value;
        } else {
            isArray(existingValue)
                ? queryObject[ param ].push(value)
                : queryObject[ param ] = [ queryObject[ param ], value ];
        }
    }

    return { ...defaults, ...queryObject };
}


export function makeAbsoluteUrl(baseUrl, endpointUrl) {
    return `${trimEnd(baseUrl, '/')}/${trimStart(endpointUrl, '/')}`;
}