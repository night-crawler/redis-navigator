import { RpcActionCreator } from './rpc';
import { RSAA } from 'redux-api-middleware';


export const REDIS_RPC_FETCH_INFO_START = 'redisNavigator/rpc/batch/execute/fetch-info/start';
export const REDIS_RPC_FETCH_INFO_FAIL = 'redisNavigator/rpc/batch/execute/fetch-info/fail';
export const REDIS_RPC_FETCH_INFO_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-info/success';
const REDIS_RPC_FETCH_INFO = [
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_FAIL,
    REDIS_RPC_FETCH_INFO_SUCCESS,
];



export default class RedisRpc {
    constructor({
        dispatch,
        endpoint
    } = {}) {
        this.actionCreator = new RpcActionCreator({endpoint: endpoint});
        this.dispatch = dispatch;
    }

    loadInfo = redisInstance => {
        const actionBundle = this.actionCreator
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
