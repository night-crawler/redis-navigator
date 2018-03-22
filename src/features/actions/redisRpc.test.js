import { RedisRpc } from '.';


describe('RedisRpc', () => {
    it('can load info', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({endpoint: '/test', dispatch});

        rpc.fetchInfo();
        expect(dispatch).toHaveBeenCalled();
    });

    it('can batch execute', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({endpoint: '/test', dispatch, instanceName: 'instance'});

        const action = rpc.batchExecute(['method', {a: 1}]);
        expect(action).toBeTruthy();
        expect(dispatch).toHaveBeenCalled();
    });
});
