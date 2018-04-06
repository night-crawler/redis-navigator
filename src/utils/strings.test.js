import {
    castStringToPrimitive,
    convertStringToBinary,
    extractLanguageCode,
    findFirstDelimiter,
    splitKey,
    uuid4
} from './strings';


describe('strings', function () {
    it('castStringToPrimitive', () => {
        const wrongArgs = () => castStringToPrimitive({});
        expect(wrongArgs).toThrow(Error);

        expect(castStringToPrimitive('1')).toEqual(1);
        expect(castStringToPrimitive('faLSe')).toEqual(false);
        expect(castStringToPrimitive('TRUE')).toEqual(true);
        expect(castStringToPrimitive('1.1')).toEqual(1.1);
    });

    it('findFirstDelimiter', () => {
        expect(findFirstDelimiter('myLongStringWithoutDelimiters')).toEqual(null);
        expect(findFirstDelimiter('some::trash:1:/2/3::4')).toEqual('::');
        expect(findFirstDelimiter('some/trash:1:/2/3::4')).toEqual('/');
    });

    it('splitKey', () => {
        expect(splitKey('myLongStringWithoutDelimiters')).toEqual([ 'myLongStringWithoutDelimiters' ]);
        expect(splitKey('a::b:c/d')).toEqual([ 'a', 'b:c/d' ]);
        expect(splitKey('a:b:c:d')).toEqual([ 'a', 'b', 'c', 'd' ]);
    });

    it('extractLanguageCode', () => {
        expect(extractLanguageCode('en_US')).toEqual('en');

        const wrongArgs = () => extractLanguageCode(2);
        expect(wrongArgs).toThrow(Error);
    });

    it('uuid4', () => {
        expect(uuid4()).toHaveLength(36);
    });

    it('convertStringToBinary', () => {
        expect(convertStringToBinary(null)).toEqual(null);
        expect(convertStringToBinary('')).toEqual(null);
        expect(convertStringToBinary('123')).toBeTruthy();
    });
});
