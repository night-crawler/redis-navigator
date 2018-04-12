import { RedisRpc } from '.';


describe('RedisRpc actions', () => {
    it('should load info', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch });

        rpc.fetchInfo();
        expect(dispatch).toHaveBeenCalled();
    });

    it('should batch execute', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });

        const action = rpc.batchExecute(['method', { a: 1 }]);
        expect(action).toBeTruthy();
        expect(dispatch).toHaveBeenCalled();
    });

    it('should fetchKeyInfo', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });
        rpc.fetchKeyInfo();

        expect(dispatch).toHaveBeenCalled();
    });

    it('should fetchKeyData', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });
        rpc.fetchKeyData('a', 'list');

        expect(dispatch).toHaveBeenCalled();
    });

    it('should updateKeyData', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });
        rpc.updateKeyData('a', 'list', [1, 2], [2, 3], 1000);

        expect(dispatch).toHaveBeenCalled();
    });

    it('should fetchKeyTypes', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });
        rpc.fetchKeyTypes(['a', 'b']);

        expect(dispatch).toHaveBeenCalled();
    });

    it('should _produceGetAllCommand', () => {
        const rpc = new RedisRpc();

        const wrongKey = () => rpc._produceGetAllCommand(1);
        expect(wrongKey).toThrow(Error);

        const wrongTypeType = () => rpc._produceGetAllCommand('a', 1);
        expect(wrongTypeType).toThrow(Error);

        const wrongType = () => rpc._produceGetAllCommand('a', 'qwe');
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
