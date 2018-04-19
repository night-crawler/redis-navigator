import { isString, minBy, zip } from 'lodash';


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

    const possibleInteger = parseInt(rawStr, 10);
    if (!isNaN(possibleInteger) && rawStr === `${possibleInteger}`) {
        return possibleInteger;
    }

    const possibleFloat = parseFloat(rawStr);
    if (!isNaN(possibleFloat)) {
        return possibleFloat;
    }

    return rawStr;
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


export function extractLanguageCode(languageTag) {
    if (!isString(languageTag) || !languageTag)
        throw new Error(`Wrong IETF-like language tag: ${languageTag}`);

    return languageTag.toLowerCase().replace('_', '-').split('-')[ 0 ];
}



export function uuid4() {
    let uuid = '', ii;
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
