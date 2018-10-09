import { compact, isArray, isEmpty } from 'lodash';
import { RSAA } from 'redux-api-middleware';

import { getApiMiddlewareOptions, jsonRequestHeaders } from '~/utils';

import {
  RPCBadActionTypesError,
  RPCBatchArgumentsError,
  RPCEmptyRequestError,
  RPCEndpointError,
  RPCMethodNameError
} from '~/errors/rpc';


export const RPC_EXECUTE_START = 'redisNavigator/rpc/execute/start';
export const RPC_EXECUTE_SUCCESS = 'redisNavigator/rpc/execute/success';
export const RPC_EXECUTE_FAIL = 'redisNavigator/rpc/execute/fail';
export const RPC_EXECUTE_TRIPLE = [
  RPC_EXECUTE_START,
  RPC_EXECUTE_SUCCESS,
  RPC_EXECUTE_FAIL,
];


export const RPC_BATCH_START = 'redisNavigator/rpc/batchExecute/start';
export const RPC_BATCH_SUCCESS = 'redisNavigator/rpc/batchExecute/success';
export const RPC_BATCH_FAIL = 'redisNavigator/rpc/batchExecute/fail';
export const RPC_BATCH_TRIPLE = [
  RPC_BATCH_START,
  RPC_BATCH_SUCCESS,
  RPC_BATCH_FAIL,
];


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


// eslint-disable-next-line
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


const defaultRpcRequestBuilder = new RpcRequestBuilder();


export class RSAARpcActionCreator {
  constructor(
    endpoint = '/rpc',
    executeActionTypes = RPC_EXECUTE_TRIPLE,
    batchExecuteActionTypes = RPC_BATCH_TRIPLE,
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
    if (isEmpty(rpcSingleRequest))
      throw new RPCEmptyRequestError();

    const types = this.executeActionTypes.map(action => ({
      type: action,
      meta: {
        path: path,
        request: rpcSingleRequest,
      },
    }));
    return {
      [ RSAA ]: {
        endpoint: this.endpoint,
        method: 'POST',
        body: JSON.stringify(rpcSingleRequest),
        types: types,
        ...getApiMiddlewareOptions({ headers: jsonRequestHeaders }),
      }
    };
  }

  mkBatchExecute(path, rpcBatchRequest) {
    if (isEmpty(rpcBatchRequest))
      throw new RPCEmptyRequestError();

    const types = this.batchExecuteActionTypes.map(action => ({
      type: action,
      meta: {
        path: path,
        request: rpcBatchRequest,
      },
    }));
    return {
      [ RSAA ]: {
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
    requestBuilder = defaultRpcRequestBuilder,
    rsaaActionCreator = new RSAARpcActionCreator(endpoint),
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
    rsaaActionCreator = undefined,
    executeActionTypes = undefined,
    batchExecuteActionTypes = undefined,
  }) {
    const newPath = [
      ...this.methodPathParts,
      ...compact(path.split('.'))
    ].join('.');

    if (rsaaActionCreator && (!isEmpty(executeActionTypes) || !isEmpty(batchExecuteActionTypes)))
      throw new Error('You must specify either actionCreator, either action types');

    if (!isEmpty(executeActionTypes) || !isEmpty(batchExecuteActionTypes)) {
      rsaaActionCreator = new RSAARpcActionCreator(
        this.endpoint, executeActionTypes, batchExecuteActionTypes
      );
    }

    return new RpcActionCreator({
      endpoint: this.endpoint,
      path: newPath,
      requestBuilder: this.requestBuilder,
      rsaaActionCreator: rsaaActionCreator,
    });
  }

    path = (rawPath) => this.ctx({ path: rawPath });
    action = (executeActionTypes, batchExecuteActionTypes) =>
      this.ctx({ executeActionTypes, batchExecuteActionTypes });

    execute(method, params) {
      const methodFullPath = [ ...this.methodPathParts, method ].join('.');
      const rpcCallData = this.requestBuilder.mkSingle(methodFullPath, params);
      return this.rsaaActionCreator.mkExecute(
        this.methodPathParts.join('.'),
        rpcCallData
      );
    }

    batchExecute(...pairs) {
      validateRpcBatchCallArguments(pairs);
      const _pairs = pairs.map(([ method, params ]) => {
        const methodFullPath = [ ...this.methodPathParts, method ].join('.');
        return [ methodFullPath, params ];
      });
      const rpcRequest = this.requestBuilder.mkBatch(..._pairs);
      return this.rsaaActionCreator.mkBatchExecute(
        this.methodPathParts.join('.'),
        rpcRequest
      );
    }
}
