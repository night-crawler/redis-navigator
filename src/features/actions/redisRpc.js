import { RpcActionCreator, RpcRequestBuilder } from './rpc';


export const REDIS_RPC_FETCH_INFO_START = 'redisNavigator/rpc/batch/execute/fetch-info/start';
export const REDIS_RPC_FETCH_INFO_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-info/success';
export const REDIS_RPC_FETCH_INFO_FAIL = 'redisNavigator/rpc/batch/execute/fetch-info/fail';

const REDIS_RPC_FETCH_INFO = [
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
    REDIS_RPC_FETCH_INFO_FAIL,
];


export const REDIS_RPC_FETCH_MATCH_COUNT_START = 'redisNavigator/rpc/execute/fetch-match-count/start';
export const REDIS_RPC_FETCH_MATCH_COUNT_SUCCESS = 'redisNavigator/rpc/execute/fetch-match-count/success';
export const REDIS_RPC_FETCH_MATCH_COUNT_FAIL = 'redisNavigator/rpc/execute/fetch-match-count/fail';


const REDIS_RPC_FETCH_MATCH_COUNT = [
    REDIS_RPC_FETCH_MATCH_COUNT_START,
    REDIS_RPC_FETCH_MATCH_COUNT_SUCCESS,
    REDIS_RPC_FETCH_MATCH_COUNT_FAIL
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

    fetchMatchCount = (pattern, count=50000) => {
        const actionBundle = this.rpcActionCreator
            .action(REDIS_RPC_FETCH_MATCH_COUNT)
            .execute('eval', { script: this._formatMatchCountScript(pattern, count) });
        return this.dispatch(actionBundle);
    };

    _formatMatchCountScript = (pattern, count=50000) => {
        if (typeof count !== 'number')
            throw new Error(`Count must be a number, but it is ${count}, ${typeof count}`);

        if (typeof pattern !== 'string')
            throw new Error(`Count must be a string, but it is ${pattern}, ${typeof pattern}`);

        return `
            local cursor = "0"
            local count = 0
            
            repeat
                local r = redis.call(
                    "SCAN", cursor, 
                    "MATCH", "${ pattern.replace('"', '\\"') }",
                    "COUNT", ${ count }
                )
                cursor = r[1]
                count = count + #r[2]
            until cursor == "0"
            
            return count
        `;
    }
}


export function createRedisRpcCreator(dispatch) {
    const requestBuilder = new RpcRequestBuilder();

    return (endpoint) => {
        const rpcActionCreator = new RpcActionCreator({ endpoint, requestBuilder });
        return new RedisRpc({ dispatch, rpcActionCreator });
    };
}
