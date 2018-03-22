import { RedisRpc } from '.';


describe('RedisRpc', () => {
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

    it('can generate correct LUA _formatMatchCountScript script', () => {
        const rpc = new RedisRpc();

        const script = rpc._formatMatchCountScript('my:key:*');
        expect(script).toBeTruthy();

        const doubleQuoteEscapedScript = rpc._formatMatchCountScript('key:has:double:quote:"');
        expect(doubleQuoteEscapedScript).toContain('\\"');
    });

    it('can fetchMatchCount', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({ endpoint: '/test', dispatch, instanceName: 'instance' });

        const action = rpc.fetchMatchCount('my:key:*');
        expect(action).toBeTruthy();
        expect(dispatch).toHaveBeenCalled();
    });
});
