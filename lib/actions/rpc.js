import { isArray, isEmpty, compact } from 'lodash';
import { RSAA } from 'redux-api-middleware';
import { RPCBatchArgumentsError, RPCMethodNameError, RPCEndpointError, RPCBadActionTypesError } from '../errors/rpc';
import { getApiMiddlewareOptions, jsonRequestHeaders } from '../utils';


export const RPC_EXECUTE_START = 'redisNavigator/rpc/execute/start';
export const RPC_EXECUTE_SUCCESS = 'redisNavigator/rpc/execute/success';
export const RPC_EXECUTE_FAIL = 'redisNavigator/rpc/execute/fail';

export const RPC_BATCH_START = 'redisNavigator/rpc/batchExecute/start';
export const RPC_BATCH_SUCCESS = 'redisNavigator/rpc/batchExecute/success';
export const RPC_BATCH_FAIL = 'redisNavigator/rpc/batchExecute/fail';


function validateRpcBatchCallArguments(pairs) {
    if (!pairs || isEmpty(pairs))
        throw new RPCBatchArgumentsError();

    pairs.map((pair) => {
        if (!isArray(pair))
            throw new RPCBatchArgumentsError('Argument `pair` must be an array with length==2');

        // if (pair.length !== 2)
        //     throw new RPCBatchArgumentsError('Argument `pair` must be an array with length==2');

        validateRpcSingleCallArguments(...pair);
    });
}


function validateRpcSingleCallArguments(method, params) {
    if (typeof method !== 'string' || !method)
        throw new RPCMethodNameError();
}


export class RpcRequestBuilder {
    constructor() {
        this.id = 1;
    }

    mkSingle(method, params) {
        validateRpcSingleCallArguments(method, params);
        return {
            id: this.id++,
            jsonrpc: '2.0',
            method: method,
            params: params || []
        };
    }

    mkBatch(...pairs) {
        validateRpcBatchCallArguments(pairs);
        return pairs.map(([ method, params ]) => this.mkSingle(method, params));
    }
}

export class RSAARpcActionCreator {
    constructor(
        endpoint = '/rpc',
        executeActionTypes = [RPC_EXECUTE_START, RPC_EXECUTE_SUCCESS, RPC_EXECUTE_FAIL],
        batchExecuteActionTypes = [RPC_BATCH_START, RPC_BATCH_SUCCESS, RPC_BATCH_FAIL],
    ) {
        if (executeActionTypes.length !== 3)
            throw new RPCBadActionTypesError();
        if (batchExecuteActionTypes.length !== 3)
            throw new RPCBadActionTypesError();

        this.endpoint = endpoint;
        this.executeActionTypes = executeActionTypes;
        this.batchExecuteActionTypes = batchExecuteActionTypes;
    }

    mkExecute(path, rpcSingleRequest) {
        const types = this.executeActionTypes.map(action => ({
            type: action,
            meta: {
                path: path,
                request: rpcSingleRequest,
            },
        }));
        return {
            [RSAA]: {
                endpoint: this.endpoint,
                method: 'POST',
                body: JSON.stringify(rpcSingleRequest),
                types: types,
                ...getApiMiddlewareOptions({ headers: jsonRequestHeaders }),
            }
        };
    }

    mkBatchExecute(path, rpcBatchRequest) {
        const types = this.batchExecuteActionTypes.map(action => ({
            type: action,
            meta: {
                path: path,
                request: rpcBatchRequest,
            },
        }));
        return {
            [RSAA]: {
                endpoint: this.endpoint,
                method: 'POST',
                body: JSON.stringify(rpcBatchRequest),
                types: types,
                ...getApiMiddlewareOptions({ headers: jsonRequestHeaders }),
            }
        };
    }
}


export class RpcActionCreator {
    constructor({
        endpoint = '/rpc',
        path = '',
        requestBuilder = new RpcRequestBuilder(),
        actionCreator: rsaaActionCreator = new RSAARpcActionCreator(endpoint),
    } = {}) {
        if (!endpoint || typeof endpoint !== 'string')
            throw new RPCEndpointError();

        this.endpoint = endpoint;
        this.methodPathParts = compact(path.split('.'));
        this.requestBuilder = requestBuilder;
        this.rsaaActionCreator = rsaaActionCreator;
    }

    ctx({
        path = '',
        actionCreator = undefined,
        executeActionTypes = undefined,
        batchExecuteActionTypes = undefined,
    }) {
        const newPath = [
            ...this.methodPathParts,
            ...compact(path.split('.'))
        ].join('.');

        if (actionCreator && (!isEmpty(executeActionTypes) || !isEmpty(batchExecuteActionTypes)))
            throw new Error('You must specify either actionCreator, either action types');

        if (!isEmpty(executeActionTypes) || !isEmpty(batchExecuteActionTypes)) {
            actionCreator = new RSAARpcActionCreator(
                this.endpoint, executeActionTypes, batchExecuteActionTypes
            );
        }

        return new RpcActionCreator({
            endpoint: this.endpoint,
            path: newPath,
            requestBuilder: this.requestBuilder,
            actionCreator: actionCreator,
        });
    }

    path = (rawPath) => this.ctx({path: rawPath});
    action = (executeActionTypes, batchExecuteActionTypes) =>
        this.ctx({executeActionTypes, batchExecuteActionTypes});

    execute(method, params) {
        const methodFullPath = [...this.methodPathParts, method].join('.');
        const rpcCallData = this.requestBuilder.mkSingle(methodFullPath, params);
        return this.rsaaActionCreator.mkExecute(
            this.methodPathParts.join('.'),
            rpcCallData
        );
    }

    batchExecute(...pairs) {
        validateRpcBatchCallArguments(pairs);
        const _pairs = pairs.map(([ method, params ]) => {
            const methodFullPath = [...this.methodPathParts, method].join('.');
            return [methodFullPath, params];
        });
        const rpcRequest = this.requestBuilder.mkBatch(..._pairs);
        return this.rsaaActionCreator.mkBatchExecute(
            this.methodPathParts.join('.'),
            rpcRequest
        );
    }
}
