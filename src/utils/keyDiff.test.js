import { keyDiff, keyDiffHash, keyDiffList, keyDiffSet, keyDiffString, keyDiffZSet } from './keyDiff';


describe('keyDiff', () => {
    it('should throw errors on invalid args', () => {
        const invalidKey = () => keyDiff(1);
        expect(invalidKey).toThrowError();

        const invalidType = () => keyDiff('a', '');
        expect(invalidType).toThrowError();

        const invalidEqualData = () => keyDiff('a', 'list', [ 1, 2 ], [ 1, 2 ]);
        expect(invalidEqualData).toThrowError();
    });

    it('should handle list', () => {
        expect(keyDiff('a', 'list', [ 1, 2, 3 ], [ 2, 3, 4 ], 1000)).toEqual([
            [ 'multi_exec' ],
            [ 'delete', { key: 'a' } ],
            [ 'rpush', { key: 'a', values: [ 2, 3, 4 ] } ],
            [ 'pexpire', { key: 'a', timeout: 1000 } ]
        ]);
    });
});


describe('keyDiffList', () => {
    it('should remove whole list and replace it with a new one', () => {
        expect(keyDiffList('a', [ 1, 2, 3 ], [ 1, 2, 3, 4 ])).toEqual([
            [ 'delete', { key: 'a' } ],
            [ 'rpush', { key: 'a', values: [ 1, 2, 3, 4 ] } ]
        ]);
    });
});


describe('keyDiffString', () => {
    it('should just replace a key', () => {
        expect(keyDiffString('a', '1', '2')).toEqual([
            [ 'set', { key: 'a', value: '2' } ]
        ]);
    });
});


describe('keyDiffSet', () => {
    it('should generate srem && sadd', () => {
        expect(keyDiffSet('a', [ 1, 2 ], [ '1', 2, 3 ])).toEqual([
            [ 'srem', { key: 'a', members: [ 1 ] } ],
            [ 'sadd', { key: 'a', members: [ '1', 3 ] } ],
        ]);
    });

    it('should not add `srem` if no items deleted', () => {
        expect(keyDiffSet('a', [ 2 ], [ '1', 2, 3 ])).toEqual([
            [ 'sadd', { key: 'a', members: [ '1', 3 ] } ],
        ]);
    });

    it('should not add `sadd` if no items added', () => {
        expect(keyDiffSet('a', [ 2, 3 ], [ 2 ])).toEqual([
            [ 'srem', { key: 'a', members: [ 3 ] } ],
        ]);
    });
});


describe('keyDiffZSet', () => {
    it('should product a proper priority && item order, since aioredis swaps it', () => {
        // original order returned [ 'zrange', { key, start: 0, stop: -1, withscores: true } ]
        const prevData = [
            [ 'zero', 0 ],
            [ 'one', 1 ],
            [ 'two', 2 ],
        ];
        const nextData = [
            [ '000', 0 ],
            [ 'one', 1 ],
            [ 'two', 2 ],
            [ 'Dr. Rockzo', 3 ],
        ];

        expect(keyDiffZSet('a', prevData, nextData)).toEqual([
            [ 'zrem', { key: 'a', members: [ 'zero' ] } ],
            [ 'zadd', { key: 'a', pairs: [ 0, '000', 3, 'Dr. Rockzo' ] } ]
        ]);
    });
});


describe('keyDiffHash', () => {
    it('should perform object diff', () => {
        const prevData = {
            a: 1,
            b: 2,
            c: 3,
        };
        const nextData = {
            c: 4,
            trash: 1,
        };

        expect(keyDiffHash('a', prevData, nextData)).toEqual([
            [ 'hdel', { key: 'a', fields: [ 'a', 'b' ] } ],
            [ 'hmset_dict', { key: 'a', kwargs: { c: 4, trash: 1 } } ]
        ]);
    });
});