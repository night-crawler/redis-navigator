import { SortedMap } from 'collections/sorted-map';
import fileType from 'file-type';
import checkIsBase64 from 'is-base64';
import Cookies from 'js-cookie';
import yaml from 'js-yaml';
import {
    fromPairs,
    isArray,
    isEmpty,
    isPlainObject,
    isString,
    minBy,
    pick,
    pickBy,
    range,
    some,
    startsWith,
    toPairs,
    trimEnd,
    trimStart,
    zip,
} from 'lodash';
import 'url-search-params-polyfill';


export function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return ( /^(GET|HEAD|OPTIONS|TRACE)$/i.test(method) );
}


export const getApiMiddlewareOptions = ({ headers = {}, options = {}, csrfToken = '', method = 'GET' } = {}) => {
    const _csrfToken = csrfToken || Cookies.get('csrftoken');
    const _csrfHeader = _csrfToken && !csrfSafeMethod(method) ? { 'X-CSRFToken': _csrfToken } : {};
    const _headers = { ...headers, ..._csrfHeader };

    if (process.env.NODE_ENV !== 'production') {
        return {
            options: { ...options, mode: 'cors' },
            credentials: 'include',
            headers: _headers,
        };
    }
    return { headers: _headers, options };
};


export const jsonRequestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};


export function uuid4() {
    var uuid = '', ii;
    for (ii = 0; ii < 32; ii += 1) {
        switch (ii) {
            case 8:
            case 20:
                uuid += '-';
                uuid += ( Math.random() * 16 | 0 ).toString(16);
                break;
            case 12:
                uuid += '-';
                uuid += '4';
                break;
            case 16:
                uuid += '-';
                uuid += ( Math.random() * 4 | 8 ).toString(16);
                break;
            default:
                uuid += ( Math.random() * 16 | 0 ).toString(16);
        }
    }
    return uuid;
}


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


export class MimeDetector {
    constructor(rawStr) {
        const
            binary = convertStringToBinary(rawStr),
            ft = fileType(binary);
        const { mime = null, ext = null } = isEmpty(ft) ? {} : ft;
        this.mime = mime;
        this.ext = ext;
        this.rawStr = rawStr;
    }

    get imageDataURI() {
        const b64 = btoa(this.rawStr);
        return `data:${this.mime};charset=utf-8;base64,${b64}`;
    }

    get isImage() {
        return startsWith(this.mime, 'image');
    }
}


export function convertStringToBinary(rawStr) {
    if (!rawStr)
        return null;

    if (!isString(rawStr))
        return null;

    const arr = new Uint8Array(new ArrayBuffer(rawStr.length));
    for (let i = 0; i < rawStr.length; i++) {
        arr[ i ] = rawStr.charCodeAt(i);
    }
    return arr;
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


export function saveFile(filename, data, content_type = 'application/json') {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([ data ], { type: content_type }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


export function findFirstDelimiter(rawStrKey, delimiters = [ '::', ':', '/' ]) {
    const delimiterIndexMap = zip(
        delimiters,
        delimiters.map(d => rawStrKey.indexOf(d))
    ).filter(([ , index ]) => index >= 0);

    if (!delimiterIndexMap.length)
        return null;

    return minBy(
        delimiterIndexMap,
        ([ , index ]) => index
    )[ 0 ];
}


export function splitKey(rawStrKey, delimiters = [ '::', ':', '/' ]) {
    if (!rawStrKey)
        return [];
    if (!isString(rawStrKey))
        throw new Error(`rawStrKey must be a string but got ${typeof rawStrKey}: ${rawStrKey}`);

    const delimiter = findFirstDelimiter(rawStrKey, delimiters);
    if (delimiter === null)
        return [ rawStrKey ];

    return rawStrKey.split(delimiter);
}


/**
 myns:1:trash:2:value:16 = 16
 myns:1:trash:2:bla:13 = 16
 myns:1 = 32

 keyMap = {
        keys: {
            myns: {
                value: undefined
                keys: {
                    1: {
                        value: 32,
                        keys: {
                            trash:
                        }
                    }
                }
            }
        }
    }
 */
export function addToSMTree(rootObject, path, value, delimiters = [ '::', ':', '/' ]) {
    const
        pathParts = splitKey(path, delimiters),
        delimiter = findFirstDelimiter(path, delimiters);

    if (rootObject.keyMap === undefined)
        rootObject.keyMap = SortedMap();

    let obj = rootObject;
    for (let pathItem of pathParts) {
        if (!obj.keyMap.has(pathItem))
            obj.keyMap.set(pathItem, {
                keyMap: SortedMap(),
                value: undefined,
            });

        obj = obj.keyMap.get(pathItem);
    }
    obj.value = value;
    return obj;
}


export function dumpSMTree(tree) {
    const newObject = { value: tree.value };
    // newObject.keyMap = newObject.keyMap.keys().map(key => dumpSMTree())
    newObject.keyMap = fromPairs(
        tree.keyMap.entries().map(
            ([ keyName, inner ]) => [ keyName, dumpSMTree(inner) ]
        )
    );
    return newObject;
}


export function makeAbsoluteUrl(baseUrl, endpointUrl) {
    return `${trimEnd(baseUrl, '/')}/${trimStart(endpointUrl, '/')}`;
}


export function extractLanguageCode(languageTag) {
    if (!isString(languageTag) || !languageTag)
        throw new Error(`Wrong IETF-like language tag: ${languageTag}`);

    return languageTag.toLowerCase().replace('_', '-').split('-')[ 0 ];
}


export function castStringToPrimitive(rawStr) {
    if (!isString(rawStr))
        throw new Error(`'queryString must be a string, but got ${typeof rawStr}: ${rawStr}`);

    if (rawStr.length >= 'true'.length && rawStr.length <= 'false'.length) {
        const lc = rawStr.toLowerCase();
        if (lc === 'true')
            return true;
        if (lc === 'false')
            return false;
    }

    const _int = parseInt(rawStr, 10);
    if (!isNaN(_int) && `${_int}` === rawStr) {
        return _int;
    }

    const _float = parseFloat(rawStr);
    if (!isNaN(_float)) {
        return _float;
    }

    return rawStr;
}


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


export class PageHelper {
    constructor(slices = [], pageSize) {
        if (+pageSize !== pageSize)
            throw new Error(`pageSize must me a number but got ${typeof pageSize}: ${pageSize}`);

        if (isArray(slices)) {
            this.slicesType = 'array';
        } else if (isPlainObject(slices)) {
            this.slicesType = 'object';
        } else {
            this.slicesType = null;
        }

        if (this.slicesType === null)
            throw new Error(`Slices expected an array || object but got ${typeof slices}: ${slices}`);

        this.pageSize = pageSize;
        this.slices = slices;
    }

    getPageNumber(index) {
        if (+index !== index)
            throw new Error(`Index must me a number but got ${typeof index}: ${index}`);
        return Math.ceil(( index + 1 ) / this.pageSize) || 1;
    }

    /**
     * [ ..., [1, 2, 3], [1, 2, 3], ... ]
     * { 1: [1, 2, 3], ... }
     */
    getSubItem(index) {
        const
            pageNumber = this.getPageNumber(index) - ( this.slicesType === 'array' ? 1 : 0 ),
            offset = index % this.pageSize,
            page = this.getPage(pageNumber);

        if (page.length < offset)
            throw new Error(`Page ${pageNumber} has only ${pageNumber.length} elements, but ${offset} requested`);

        return page[ offset ];
    }

    isRowLoaded(index) {
        try {
            this.getSubItem(index);
            return true;
        } catch (e) {
            return false;
        }
    }

    getPage(pageNumber) {
        const page = this.slices[ pageNumber ];

        if (!isArray(page))
            throw new Error(`Expected an array at ${pageNumber} but got ${typeof page}: ${page}`);
        if (page.length > this.pageSize)
            throw new Error(`Page ${pageNumber} has length ${page.length} but it must be less then ${this.pageSize}`);

        return page;
    }

    getPageRange(startIndex, stopIndex) {
        return range(
            this.getPageNumber(startIndex),
            this.getPageNumber(stopIndex) + 1
        );
    }

    getSubSlice(startIndex, stopIndex) {
        const
            startPageNumber = this.getPageNumber(startIndex) - ( this.slicesType === 'array' ? 1 : 0 ),
            stopPageNumber = this.getPageNumber(stopIndex) - ( this.slicesType === 'array' ? 1 : 0 ),
            startOffset = startIndex % this.pageSize,
            stopOffset = stopIndex % this.pageSize;

        if (startPageNumber === stopPageNumber) {
            return this.slices[ startPageNumber ].slice(startOffset, stopOffset + 1);
        }

        const
            firstPage = this.getPage(startPageNumber),
            lastPage = this.getPage(stopPageNumber);

        const items = [];
        items.push(...firstPage.slice(startOffset));

        for (let pageNumber = startPageNumber + 1; pageNumber <= stopPageNumber - 1; pageNumber++) {
            const page = this.getPage(pageNumber);
            items.push(...page);
        }

        items.push(...lastPage.slice(0, stopOffset + 1));

        return items;
    }
}


export function mapRpcRequestsById(rpcRequest) {
    const requests = isArray(rpcRequest) ? rpcRequest : [ rpcRequest ];
    return fromPairs(
        requests.map(
            request => [
                request.id,
                pick(request, [ 'method', 'params' ])
            ]
        )
    );
}


export function mapRpcResponsesById(rpcResponse) {
    const responses = isArray(rpcResponse) ? rpcResponse : [ rpcResponse ];
    return fromPairs(
        responses.map(
            response => [
                response.id,
                pick(response, [ 'result', 'error' ])
            ]
        )
    );
}


export function prepareServerInfo(rpcRequest, rpcResponse) {
    const requestsByIdMap = mapRpcRequestsById(rpcRequest);
    const pairs = toPairs(mapRpcResponsesById(rpcResponse))
        .map(([ id, response ]) => {
            const methodName = requestsByIdMap[ id ].method.split('.').pop();

            switch (methodName) {
                case 'config_get':
                    return [ 'config', response ];
                case 'info':
                    return [ 'sections', response ];
                case 'client_list':
                    return [ 'clients', response ];
                case 'dbsize':
                    return [ 'dbsize', response ];
                case 'client_getname':
                    return [ 'name', response ];
            }
        });
    return fromPairs(pairs);
}


export function prepareKeyTypesMap(rpcRequest, rpcResponse) {
    const requestMap = mapRpcRequestsById(rpcRequest);
    const responseMap = mapRpcResponsesById(rpcResponse);

    const pairs = toPairs(requestMap).map(([ id, request ]) =>
        [ request.params.key, responseMap[ id ].result ]
    );
    return fromPairs(pairs);
}
