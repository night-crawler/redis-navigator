import { RSAA } from 'redux-api-middleware';
import { isString } from 'lodash';
import { RpcActionCreator } from './rpc';
import { keyDiff } from 'utils/keyDiff';


export const REDIS_RPC_FETCH_INFO_START = 'redisNavigator/rpc/batch/execute/fetch-info/start';
export const REDIS_RPC_FETCH_INFO_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-info/success';
export const REDIS_RPC_FETCH_INFO_FAIL = 'redisNavigator/rpc/batch/execute/fetch-info/fail';

const REDIS_RPC_FETCH_INFO = [
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
    REDIS_RPC_FETCH_INFO_FAIL,
];


export const REDIS_RPC_FETCH_KEY_TYPES_START = 'redisNavigator/rpc/batch/execute/fetch-key-types/start';
export const REDIS_RPC_FETCH_KEY_TYPES_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-key-types/success';
export const REDIS_RPC_FETCH_KEY_TYPES_FAIL = 'redisNavigator/rpc/batch/execute/fetch-key-types/fail';


const REDIS_RPC_FETCH_KEY_TYPES = [
    REDIS_RPC_FETCH_KEY_TYPES_START,
    REDIS_RPC_FETCH_KEY_TYPES_SUCCESS,
    REDIS_RPC_FETCH_KEY_TYPES_FAIL,
];


export const REDIS_RPC_FETCH_KEY_INFO_START = 'redisNavigator/rpc/batch/execute/fetch-key-info/start';
export const REDIS_RPC_FETCH_KEY_INFO_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-key-info/success';
export const REDIS_RPC_FETCH_KEY_INFO_FAIL = 'redisNavigator/rpc/batch/execute/fetch-key-info/fail';


const REDIS_RPC_FETCH_KEY_INFO = [
    REDIS_RPC_FETCH_KEY_INFO_START,
    REDIS_RPC_FETCH_KEY_INFO_SUCCESS,
    REDIS_RPC_FETCH_KEY_INFO_FAIL,
];


export const REDIS_RPC_FETCH_KEY_DATA_START = 'redisNavigator/rpc/batch/execute/fetch-key-data/start';
export const REDIS_RPC_FETCH_KEY_DATA_SUCCESS = 'redisNavigator/rpc/batch/execute/fetch-key-data/success';
export const REDIS_RPC_FETCH_KEY_DATA_FAIL = 'redisNavigator/rpc/batch/execute/fetch-key-data/fail';


const REDIS_RPC_FETCH_KEY_DATA = [
    REDIS_RPC_FETCH_KEY_DATA_START,
    REDIS_RPC_FETCH_KEY_DATA_SUCCESS,
    REDIS_RPC_FETCH_KEY_DATA_FAIL,
];


export const REDIS_RPC_UPDATE_KEY_DATA_START = 'redisNavigator/rpc/batch/execute/update-key-data/start';
export const REDIS_RPC_UPDATE_KEY_DATA_SUCCESS = 'redisNavigator/rpc/batch/execute/update-key-data/success';
export const REDIS_RPC_UPDATE_KEY_DATA_FAIL = 'redisNavigator/rpc/batch/execute/update-key-data/fail';


const REDIS_RPC_UPDATE_KEY_DATA = [
    REDIS_RPC_UPDATE_KEY_DATA_START,
    REDIS_RPC_UPDATE_KEY_DATA_SUCCESS,
    REDIS_RPC_UPDATE_KEY_DATA_FAIL,
];


function patchTypes(actionBundle, patchWith) {
    actionBundle[RSAA].types.forEach(
        type => type.meta = { ...type.meta, ...patchWith }
    );
    return actionBundle;
}


export class RedisRpc {
    constructor({
        dispatch,
        instanceName,
        endpoint,
        rpcActionCreator = new RpcActionCreator({ endpoint })
    } = {}) {
        this.instanceName = instanceName;
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

    fetchKeyTypes = (keys) => {
        const actionBundle = this.rpcActionCreator
            .action(undefined, REDIS_RPC_FETCH_KEY_TYPES)
            .batchExecute(...keys.map(key => [ 'type', { key } ]));
        return this.dispatch(actionBundle);
    };

    batchExecute = (...pairs) => {
        const actionBundle = this.rpcActionCreator
            .batchExecute(...pairs);

        return this.dispatch(actionBundle);
    };

    fetchKeyInfo = (key) => {
        const actionBundle = this.rpcActionCreator
            .action(undefined, REDIS_RPC_FETCH_KEY_INFO)
            .batchExecute(
                [ 'memory_usage', { key } ],
                [ 'ttl', { key } ],
                [ 'pttl', { key } ],
                [ 'object_refcount', { key } ],
                [ 'object_encoding', { key } ],
                [ 'object_idletime', { key } ],
            );
        patchTypes(actionBundle, { key });
        return this.dispatch(actionBundle);
    };

    fetchKeyData = (key, type) => {
        const actionBundle = this.rpcActionCreator
            .action(REDIS_RPC_FETCH_KEY_DATA)
            .execute(...this._produceGetAllCommand(key, type));
        patchTypes(actionBundle, { key });
        return this.dispatch(actionBundle);
    };
    
    updateKeyData = (key, type, prevData, nextData, pexpire) => {
        const actionBundle = this.rpcActionCreator
            .action(undefined, REDIS_RPC_UPDATE_KEY_DATA)
            .batchExecute(...keyDiff(
                key, type, prevData, nextData, pexpire
            ));
        patchTypes(actionBundle, { key });
        return this.dispatch(actionBundle);
    };

    _produceGetAllCommand = (key, type) => {
        if (!isString(key))
            throw new Error(`Key ${key} must be a string but got ${typeof key}`);
        if (!isString(type))
            throw new Error(`Type ${type} must be a string but got ${typeof type}`);

        switch(type.toLowerCase()) {
            case 'list':
                return [ 'lrange', { key, start: 0, stop: -1 } ];
            case 'hash':
                return [ 'hgetall', { key } ];
            case 'set':
                return [ 'smembers', { key } ];
            case 'zset':
                return [ 'zrange', { key, start: 0, stop: -1, withscores: true } ];
            case 'string':
                return [ 'get', { key } ];

            default:
                throw new Error(`Unknown type ${type} specified for key ${key}`);
        }
    }
}
