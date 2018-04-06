import {
    deserializeQuery,
    makeAbsoluteUrl,
    serializeQuery
} from './urls';


describe('url utils', function () {
    it('makeAbsoluteUrl', () => {
        expect(
            makeAbsoluteUrl('http://test.test/', '/some-url')
        ).toEqual('http://test.test/some-url');
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
            ttlSeconds: [ 666, 661 ]
        });
    });
});
