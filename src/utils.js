import Cookies from 'js-cookie';
import fileType from 'file-type';
import { isEmpty, startsWith } from 'lodash';


export function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return ( /^(GET|HEAD|OPTIONS|TRACE)$/.test(method) );
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


export function isBase64(rawStr) {
    try {
        return btoa(atob(rawStr)) === rawStr;
    } catch (err) {
        return false;
    }
}


export function isJson(rawStr) {
    try {
        return !!JSON.parse(rawStr);
    } catch (err) {
        return false;
    }
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
    const arr = new Uint8Array(new ArrayBuffer(rawStr.length));
    for (let i=0; i<rawStr.length; i++) {
        arr[i] = rawStr.charCodeAt(i);
    }
    return arr;
}
