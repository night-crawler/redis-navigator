import { RpcActionCreator, RpcRequestBuilder } from './rpc';


export const REDIS_RPC_FETCH_INFO_START = 'redisNavigator/rpc/batch/execute/fetch-info/start';
export const REDIS_RPC_FETCH_INFO_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-info/success';
export const REDIS_RPC_FETCH_INFO_FAIL = 'redisNavigator/rpc/batch/execute/fetch-info/fail';

const REDIS_RPC_FETCH_INFO = [
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
    REDIS_RPC_FETCH_INFO_FAIL,
];


export class RedisRpc {
    constructor({
        dispatch,
        instanceName,
        endpoint,
        rpcActionCreator = new RpcActionCreator({ endpoint })
    } = {}) {
        this.rpcActionCreator = rpcActionCreator.path(instanceName);
        this.dispatch = dispatch;
    }

    fetchInfo = () => {
        const actionBundle = this.rpcActionCreator
            .action(undefined, REDIS_RPC_FETCH_INFO)
            .batchExecute(
                ['config_get'],
                ['info', { section: 'all' }],
                ['dbsize'],
                ['client_list'],
                ['client_getname'],
            );
        return this.dispatch(actionBundle);
    };

    batchExecute = (...pairs) => {
        const actionBundle = this.rpcActionCreator
            .batchExecute(...pairs);

        return this.dispatch(actionBundle);
    };
}


export function createRedisRpcCreator(dispatch) {
    const requestBuilder = new RpcRequestBuilder();

    return (endpoint) => {
        const rpcActionCreator = new RpcActionCreator({ endpoint, requestBuilder });
        return new RedisRpc({ dispatch, rpcActionCreator });
    };
}
