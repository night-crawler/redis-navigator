import { mapRpcRequestsById, mapRpcResponsesById, mergeRpcRequestResponse, prepareKeyInfo } from './rpc';


describe('rpc utils', function () {
    it('mapRpcRequestsById', () => {
        const singleRequest =
            { id: 1, jsonrpc: '2.0', method: 'redis_0.type', params: [ 1, 2, 3 ] };

        expect(mapRpcRequestsById(singleRequest)).toEqual({
            '1': { method: 'redis_0.type', params: [ 1, 2, 3 ] }
        });

        const batchRequest = [
            { id: 1, jsonrpc: '2.0', method: 'redis_0.type', params: { key: 'qwe' } },
            { id: 2, jsonrpc: '2.0', method: 'redis_0.type', params: { key: 'qwe1' } },
        ];

        expect(mapRpcRequestsById(batchRequest)).toEqual({
            '1': { method: 'redis_0.type', params: { key: 'qwe' } },
            '2': { method: 'redis_0.type', params: { key: 'qwe1' } }
        });
    });

    it('mapRpcResponsesById', () => {
        const singlePayload =
            { id: 1, jsonrpc: '2.0', result: 'string' };

        expect(mapRpcResponsesById(singlePayload)).toEqual({
            '1': { result: 'string' }
        });

        const batchPayload = [
            { id: 1, jsonrpc: '2.0', result: 'string' },
            { id: 2, jsonrpc: '2.0', result: 'string'}
        ];

        expect(mapRpcResponsesById(batchPayload)).toEqual({
            '1': { result: 'string' },
            '2': { result: 'string' }
        });
    });


    it('mergeRpcRequestResponse', () => {
        const request = [
            { id: 1, jsonrpc: '2.0', method: 'redis_0.type', params: { key: 'qwe' } },
            { id: 2, jsonrpc: '2.0', method: 'redis_0.type', params: { key: 'qwe1' } },
        ];

        const response = [
            { id: 2, jsonrpc: '2.0', result: 'second' },
            { id: 1, jsonrpc: '2.0', result: 'first' }
        ];

        expect(mergeRpcRequestResponse(request, response)).toEqual([
            {
                id: 1,
                methodName: 'type',
                method: 'redis_0.type',
                params: { key: 'qwe' },
                result: 'first'
            },
            {
                id: 2,
                methodName: 'type',
                method: 'redis_0.type',
                params: { key: 'qwe1' },
                result: 'second'
            } ]
        );
    });

    it('prepareKeyInfo', () => {
        const request = [
            { id: 51, jsonrpc: '2.0', method: 'redis_0.memory_usage', params: { key: 'a' } },
            { id: 52, jsonrpc: '2.0', method: 'redis_0.ttl', params: { key: 'a' } },
            { id: 53, jsonrpc: '2.0', method: 'redis_0.pttl', params: { key: 'a' } },
            { id: 54, jsonrpc: '2.0', method: 'redis_0.object_refcount', params: { key: 'a' } },
            { id: 55, jsonrpc: '2.0', method: 'redis_0.object_encoding', params: { key: 'a' } },
            { id: 56, jsonrpc: '2.0', method: 'redis_0.object_idletime', params: { key: 'a' } }
        ];
        const response = [
            { id: 51, jsonrpc: '2.0', result: 333 },
            { id: 52, jsonrpc: '2.0', result: 278 },
            { id: 53, jsonrpc: '2.0', result: 278269 },
            { id: 54, jsonrpc: '2.0', result: 1 },
            { id: 55, jsonrpc: '2.0', result: 'ziplist' },
            { id: 56, jsonrpc: '2.0', result: 21 }
        ];

        expect(prepareKeyInfo(request, response)).toEqual({
            a:
                {
                    memory_usage: 333,
                    ttl: 278,
                    pttl: 278269,
                    object_refcount: 1,
                    object_encoding: 'ziplist',
                    object_idletime: 21
                }
        });

    });

});