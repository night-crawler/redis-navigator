import { RpcActionCreator, RpcRequestBuilder } from './rpc';


export const REDIS_RPC_FETCH_INFO_START = 'redisNavigator/rpc/batch/execute/fetch-info/start';
export const REDIS_RPC_FETCH_INFO_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-info/success';
export const REDIS_RPC_FETCH_INFO_FAIL = 'redisNavigator/rpc/batch/execute/fetch-info/fail';

const REDIS_RPC_FETCH_INFO = [
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
    REDIS_RPC_FETCH_INFO_FAIL,
];



export default class RedisRpc {
    constructor({
        dispatch,
        endpoint,
        rpcActionCreator = new RpcActionCreator({ endpoint })
    } = {}) {
        this.rpcActionCreator = rpcActionCreator;
        this.dispatch = dispatch;
    }

    loadInfo = redisInstance => {
        const actionBundle = this.rpcActionCreator
            .path(redisInstance)
            .action(undefined, REDIS_RPC_FETCH_INFO)
            .batchExecute(
                ['config_get'],
                ['info', {section: 'all'}],
                ['dbsize'],
                ['client_list'],
                ['client_getname'],
            );
        return this.dispatch(actionBundle);
    }
}


export function createRedisRpcCreator(dispatch) {
    const requestBuilder = new RpcRequestBuilder();

    return (endpoint) => {
        const rpcActionCreator = new RpcActionCreator({ endpoint, requestBuilder });
        return new RedisRpc({ dispatch, rpcActionCreator });
    };
}
