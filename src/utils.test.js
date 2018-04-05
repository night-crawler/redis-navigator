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
    serializeQuery, deserializeQuery, castStringToPrimitive,
    PageHelper,
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

    it('serializeQuery', () => {
        const queryObject = { pattern: '*', sortKeys: true, scanCount: 123, ttlSeconds: 666 };

        const wrongQueryObject = () => serializeQuery(2);
        expect(wrongQueryObject).toThrow(Error);

        const wrongDefaults = () => serializeQuery({}, 2);
        expect(wrongDefaults).toThrow(Error);

        expect(serializeQuery(queryObject, {})).toEqual('pattern=*&sortKeys=true&scanCount=123&ttlSeconds=666');
        expect(serializeQuery(queryObject, queryObject)).toEqual('');
    });

    it('deserializeQuery', () => {
        const query = 'pattern=*&sortKeys=true&scanCount=123&ttlSeconds=666&ttlSeconds=661';
        expect(deserializeQuery(query)).toEqual({
            pattern: '*',
            sortKeys: true,
            scanCount: 123,
            ttlSeconds: [666, 661]
        });
    });

    it('castStringToPrimitive', () => {
        const wrongArgs = () => castStringToPrimitive({});
        expect(wrongArgs).toThrow(Error);

        expect(castStringToPrimitive('1')).toEqual(1);
        expect(castStringToPrimitive('faLSe')).toEqual(false);
        expect(castStringToPrimitive('TRUE')).toEqual(true);
        expect(castStringToPrimitive('1.1')).toEqual(1.1);
    });
});


describe('PageHelper', () => {
    it('getPageNumber', () => {
        const ph = new PageHelper([], 4);
        expect(ph.getPageNumber(0)).toEqual(1);
        expect(ph.getPageNumber(1)).toEqual(1);
        expect(ph.getPageNumber(2)).toEqual(1);
        expect(ph.getPageNumber(3)).toEqual(1);
        expect(ph.getPageNumber(4)).toEqual(2);
        expect(ph.getPageNumber(5)).toEqual(2);
        
        const wrongArgs = () => ph.getPageNumber();
        expect(wrongArgs).toThrow(Error);
    });

    it('can getSubItem with array slices', () => {
        const arrayOfArrays = [
            [ 0, 1, 2, 3 ],
            [ 4, 5, 6, 7 ],
            'wrong',
            ['w', 'r', 'o', 'n', 'g']
        ];

        const ph = new PageHelper(arrayOfArrays, 4);

        expect(ph.getSubItem(3)).toEqual(3);
        expect(ph.getSubItem(7)).toEqual(7);

        expect(() => ph.getSubItem(8)).toThrow(Error);
        expect(() => ph.getSubItem(12)).toThrow(Error);
    });

    it('getSubItem with object page mapping', () => {
        const pageMap = {
            1: [ 0, 1, 2, 3 ],
            2: [ 4, 5, 6, 7 ],
            3: 'wrong',
            4: ['w', 'r', 'o', 'n', 'g'],
        };

        const ph = new PageHelper(pageMap, 4);

        expect(ph.getSubItem(3)).toEqual(3);
        expect(ph.getSubItem(7)).toEqual(7);

        expect(() => ph.getSubItem(8)).toThrow(Error);
        expect(() => ph.getSubItem(12)).toThrow(Error);
    });

    it('getSubSlice', () => {
        const arrayOfArrays = [
            [ 10, 11, 12, 13 ],
            [ 14, 15, 16, 17 ],
            [ 18, 19, 20, 21 ],
        ];
        const mapOfArrays = {
            1: [ 10, 11, 12, 13 ],
            2: [ 14, 15, 16, 17 ],
            3: [ 18, 19, 20, 21 ],
        };

        const phArray = new PageHelper(arrayOfArrays, 4);
        const phObject = new PageHelper(mapOfArrays, 4);

        expect( phArray.getSubSlice(0, 0)).toEqual([ 10 ]);
        expect(phObject.getSubSlice(0, 0)).toEqual([ 10 ]);

        expect( phArray.getSubSlice(0, 3)).toEqual([ 10, 11, 12, 13 ]);
        expect(phObject.getSubSlice(0, 3)).toEqual([ 10, 11, 12, 13 ]);

        expect( phArray.getSubSlice(3, 4)).toEqual([ 13, 14]);
        expect(phObject.getSubSlice(3, 4)).toEqual([ 13, 14]);

        expect( phArray.getSubSlice(3, 8)).toEqual([ 13, 14, 15, 16, 17, 18 ]);
        expect(phObject.getSubSlice(3, 8)).toEqual([ 13, 14, 15, 16, 17, 18 ]);
    });

    it('includes the rightmost value for page range', () => {
        const ph = new PageHelper(undefined, 4);
        expect(ph.getPageRange(1, 6)).toEqual([ 1, 2 ]);
        expect(ph.getPageRange(0, 3)).toEqual([ 1 ]);
    });
});
