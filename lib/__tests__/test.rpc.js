import { RSAA } from 'redux-api-middleware';
import {
    RpcActionCreator,
    RPC_BATCH_FAIL,
    RPC_BATCH_START,
    RPC_BATCH_SUCCESS,
    RPC_EXECUTE_FAIL,
    RPC_EXECUTE_START,
    RPC_EXECUTE_SUCCESS,
    RpcRequestBuilder,
    RSAARpcActionCreator,
} from '../actions/rpc';

import { RPCBatchArgumentsError, RPCMethodNameError, RPCEndpointError } from '../errors/rpc';
import { jsonRequestHeaders } from '../utils';

describe('RpcRequestBuilder', () => {
    it('has incremental ids for single and batchExecute requests', () => {
        const request = new RpcRequestBuilder();
        expect(request.mkSingle('test', { a1: 1, a2: 'qwe' })).toEqual({
            id: 1,
            jsonrpc: '2.0',
            method: 'test',
            params: { a1: 1, a2: 'qwe' }
        });

        // incremented
        expect(request.mkSingle('test', { a1: 1, a2: 'qwe' })).toEqual({
            id: 2,
            jsonrpc: '2.0',
            method: 'test',
            params: { a1: 1, a2: 'qwe' }
        });

        // batchExecute and increment
        expect(request.mkBatch(
            ['func1', { arg1: 1 }],
            ['func2', { arg1: 42 }],
        )).toEqual([
            { id: 3, jsonrpc: '2.0', method: 'func1', params: { arg1: 1 } },
            { id: 4, jsonrpc: '2.0', method: 'func2', params: { arg1: 42 } }
        ]);
    });

    it('produces empty params list if no arguments were specified', () => {
        const request = new RpcRequestBuilder();
        expect(request.mkSingle('test')).toEqual({
            id: 1, jsonrpc: '2.0', method: 'test', params: []
        });
    });

    it('throws correct errors', () => {
        const request = new RpcRequestBuilder();

        function noMethodSpecified() {
            request.mkSingle();
        }

        expect(noMethodSpecified).toThrow(RPCMethodNameError);


        function noArgumentsSuppliedForBatch() {
            request.mkBatch();
        }

        expect(noArgumentsSuppliedForBatch).toThrowError(RPCBatchArgumentsError);


        function wrongArgumentType() {
            request.mkBatch({ test: 1 });
        }

        expect(wrongArgumentType).toThrowError(RPCBatchArgumentsError);
    });
});



describe('RSAARpcActionCreator', () => {
    const ac = new RSAARpcActionCreator();
    const rb = new RpcRequestBuilder();

    it('can accept single rpc request objects', () => {
        const res = ac.mkExecute(rb.mkSingle('get', {key: 'trash'}));
        expect(res).toBeTruthy();
        expect(res[RSAA]).toBeTruthy();
    });

    it('can accept batch rpc request objects', () => {
        const res = ac.mkBatchExecute(rb.mkBatch(
            ['get', {key: '1'}],
            ['set', {key: '1', value: 2}],
        ));
        expect(res).toBeTruthy();
        expect(res[RSAA]).toBeTruthy();
    });
});


describe('RpcActionCreator', () => {
    it('throws the error on falsy endpoints', () => {
        const emptyEndpoint = () => new RpcActionCreator({endpoint: ''});
        expect(emptyEndpoint).toThrowError(RPCEndpointError);
    });

    it('can perform a single execute', () => {
        const redisRpc = new RpcActionCreator({path: 'redis_0'});
        const expectedBody = {
            id: 1,
            jsonrpc: '2.0',
            method: 'redis_0.get',
            params: { key: 1 }
        };

        expect(redisRpc.execute(
            'get', { key: 1 }
        )).toEqual({
            [RSAA]: {
                endpoint: '/rpc',
                method: 'POST',
                body: JSON.stringify(expectedBody),
                types: [RPC_EXECUTE_START, RPC_EXECUTE_SUCCESS, RPC_EXECUTE_FAIL],
                options: { mode: 'cors' },
                credentials: 'include',
                headers: jsonRequestHeaders,
            }
        });
    });

    it('can perform a batch execute', () => {
        const redisRpc = new RpcActionCreator({path: 'redis_0'});
        const expectedBody = [
            {
                id: 1,
                jsonrpc: '2.0',
                method: 'redis_0.get',
                params: { key: 'first' }
            },
            {
                id: 2,
                jsonrpc: '2.0',
                method: 'redis_0.get',
                params: { key: 'second' }
            }
        ];
        expect(redisRpc.batchExecute(
            ['get', { key: 'first' }],
            ['get', { key: 'second' }],
        )).toEqual({
            [RSAA]: {
                endpoint: '/rpc',
                method: 'POST',
                body: JSON.stringify(expectedBody),
                types: [RPC_BATCH_START, RPC_BATCH_SUCCESS, RPC_BATCH_FAIL],
                options: { mode: 'cors' },
                credentials: 'include',
                headers: jsonRequestHeaders,
            }
        });
    });


    it('can handle context', () => {
        const redisRpc = new RpcActionCreator();
        expect(
            redisRpc.ctx({path: 'redis_0'})
                .execute('get', {'key': 1})[RSAA].body
                .indexOf('redis_0.get')
        ).toBeTruthy();

        expect(
            redisRpc
                .path('new')
                .execute('get', {'key': 1})[RSAA].body
                .indexOf('new.get')
        ).toBeTruthy();

        expect(
            redisRpc
                .action([1, 2, 3])
                .execute('get', {'key': 1})[RSAA].types
        ).toEqual([1, 2, 3]);
    });

    it('can handle context with custom action creators', () => {
        const redisRpc = new RpcActionCreator();
        const newRpc = redisRpc.ctx({
            executeActionTypes: ['1', '2', '3'],
            batchExecuteActionTypes: ['4', '5', '6']
        });

        expect(newRpc.actionCreator.executeActionTypes).toEqual(['1', '2', '3']);
        expect(newRpc.actionCreator.batchExecuteActionTypes).toEqual(['4', '5', '6']);
    });

});



