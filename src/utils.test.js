import { RPCMethodNameError } from './errors/rpc';
import {
    csrfSafeMethod,
    getApiMiddlewareOptions,
    uuid4,
    isJson,
    convertStringToBinary,
    isBase64,
    isValidNumber,
    isYaml,
    splitKey,
    findFirstDelimiter,
    addToSMTree,
    dumpSMTree, makeAbsoluteUrl, extractLanguageCode,
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

    it('isYaml', () => {
        const _yaml = `
        glossary:
            title: example glossary`;

        expect(isYaml('true')).toEqual(false);
        expect(isYaml(true)).toEqual(false);
        expect(isYaml([1, 2, 3])).toEqual(false);
        expect(isYaml({a: 1})).toEqual(false);
        expect(isYaml('trash')).toEqual(false);

        expect(isYaml(_yaml)).toEqual(true);
    });

    it('isBase64', () => {
        expect(isBase64('')).toEqual(false);
        expect(isBase64([1, 2, 3])).toEqual(false);

        expect(isBase64('test')).toEqual(false);
        expect(isBase64('test', 0)).toEqual(true);
    });

    it('isValidNumber', () => {
        expect(isValidNumber('')).toEqual(false);
        expect(isValidNumber([1, 2, 3])).toEqual(false);
        expect(isValidNumber({a: 1})).toEqual(false);
        expect(isValidNumber('test')).toEqual(false);

        expect(isValidNumber(0)).toEqual(true);
        expect(isValidNumber(1)).toEqual(true);
        expect(isValidNumber('0')).toEqual(true);
        expect(isValidNumber('1')).toEqual(true);

        expect(isValidNumber(1.12)).toEqual(true);
        expect(isValidNumber(0.12)).toEqual(true);
    });

    it('convertStringToBinary', () => {
        expect(convertStringToBinary(null)).toEqual(null);
        expect(convertStringToBinary('')).toEqual(null);
        expect(convertStringToBinary('123')).toBeTruthy();
    });

    it('findFirstDelimiter', () => {
        expect(findFirstDelimiter('myLongStringWithoutDelimiters')).toEqual(null);
        expect(findFirstDelimiter('some::trash:1:/2/3::4')).toEqual('::');
        expect(findFirstDelimiter('some/trash:1:/2/3::4')).toEqual('/');
    });

    it('splitKey', () => {
        expect(splitKey('myLongStringWithoutDelimiters')).toEqual(['myLongStringWithoutDelimiters']);
        expect(splitKey('a::b:c/d')).toEqual([ 'a', 'b:c/d' ]);
        expect(splitKey('a:b:c:d')).toEqual([ 'a', 'b', 'c', 'd' ]);
    });

    it('addToSMTree', () => {
        const tree = {};
        addToSMTree(tree, 'a:b:c', 'abc');
        addToSMTree(tree, 'a:b', 'ab');
        addToSMTree(tree, 'a', 'a');

        const expected = {
            keyMap: {
                a: {
                    value: 'a',
                    keyMap: {
                        b: {
                            value: 'ab',
                            keyMap: {
                                c: {
                                    value: 'abc',
                                    keyMap: {}
                                }
                            }
                        }
                    }
                }
            }
        };

        expect(dumpSMTree(tree)).toEqual(expected);
    });


    it('makeAbsoluteUrl', () => {
        expect(
            makeAbsoluteUrl('http://test.test/', '/some-url')
        ).toEqual('http://test.test/some-url');
    });


    it('extractLanguageCode', () => {
        expect(extractLanguageCode('en_US')).toEqual('en');

        const wrongArgs = () => extractLanguageCode(2);
        expect(wrongArgs).toThrow(Error);
    });
});
