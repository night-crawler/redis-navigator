import { RedisRpc } from '.';


describe('RedisRpc actions', () => {
    it('can load info', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch });

        rpc.fetchInfo();
        expect(dispatch).toHaveBeenCalled();
    });

    it('can batch execute', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });

        const action = rpc.batchExecute(['method', { a: 1 }]);
        expect(action).toBeTruthy();
        expect(dispatch).toHaveBeenCalled();
    });

    it('fetchKeyInfo', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });
        rpc.fetchKeyInfo();

        expect(dispatch).toHaveBeenCalled();
    });

    it('fetchKeyData', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });
        rpc.fetchKeyData('a', 'list');

        expect(dispatch).toHaveBeenCalled();
    });

    it('_produceGetAllCommand', () => {
        const rpc = new RedisRpc();

        const wrongKey = () => rpc._produceGetAllCommand(1);
        expect(wrongKey).toThrow(Error);

        const wrongType = () => rpc._produceGetAllCommand('a', 1);
        expect(wrongType).toThrow(Error);

        expect(rpc._produceGetAllCommand('a', 'LIST')).toEqual(
            [ 'lrange', { key: 'a', start: 0, stop: -1 } ]
        );

        expect(rpc._produceGetAllCommand('a', 'string')).toEqual(
            [ 'get', { key: 'a' } ]
        );

        expect(rpc._produceGetAllCommand('a', 'hash')).toEqual(
            [ 'hgetall', { key: 'a' } ]
        );

        expect(rpc._produceGetAllCommand('a', 'zset')).toEqual(
            [ 'zrange', { key: 'a', start: 0, stop: -1, withscores: true } ]
        );

        expect(rpc._produceGetAllCommand('a', 'set')).toEqual(
            [ 'smembers', { key: 'a' } ]
        );

    });
});
