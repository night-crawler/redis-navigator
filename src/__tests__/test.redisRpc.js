import { RedisRpc } from '../features/actions/redisRpc';


describe('RedisRpc', () => {
    it('can load info', () => {
        const dispatch = jest.fn(action => action);
        const rpc = new RedisRpc({endpoint: '/test', dispatch});

        rpc.loadInfo();
        expect(dispatch).toHaveBeenCalled();
    });
});
