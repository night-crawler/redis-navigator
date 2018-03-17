import {
    csrfSafeMethod,
    getApiMiddlewareOptions,
    uuid4,
    isJson,
    convertStringToBinary,
} from './utils';


describe('utils', () => {
    it('understands which methods are safe!11', () => {
        expect(csrfSafeMethod('get')).toEqual(true);
    });

    it('getApiMiddlewareOptions', () => {
        const opts = getApiMiddlewareOptions();
        expect(opts).toBeTruthy();
    });

    it('uuid4', () => {
        expect(uuid4()).toHaveLength(36);
    });

    it('isJson', () => {
        expect(isJson('{"a": 1}')).toEqual(true);
        expect(isJson(1)).toEqual(false);
        expect(isJson('1')).toEqual(false);
        expect(isJson('{"a": \'1}')).toEqual(false);
    });

    it('convertStringToBinary', () => {
        expect(convertStringToBinary(null)).toEqual(null);
        expect(convertStringToBinary('')).toEqual(null);
        expect(convertStringToBinary('123')).toBeTruthy();
    });
});
