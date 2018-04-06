import { mapRpcRequestsById, mapRpcResponsesById } from './rpc';


describe('rpc utils', function () {
    it('mapRpcRequestsById', () => {
        const singleRequest = {
            id: 1, jsonrpc: '2.0',
            method: 'redis_0.type',
            params: [ 1, 2, 3 ],
        };

        const batchRequest = [
            {
                id: 1, jsonrpc: '2.0',
                method: 'redis_0.type', params: { key: 'qwe' }
            },
            {
                id: 2, jsonrpc: '2.0',
                method: 'redis_0.type', params: { key: 'qwe1' }
            },
        ];

        expect(mapRpcRequestsById(singleRequest)).toEqual({
            '1': {
                method: 'redis_0.type', params: [ 1, 2, 3 ]
            }
        });

        expect(mapRpcRequestsById(batchRequest)).toEqual({
            '1': { method: 'redis_0.type', params: { key: 'qwe' } },
            '2': { method: 'redis_0.type', params: { key: 'qwe1' } }
        });
    });

    it('mapRpcResponsesById', () => {
        const singlePayload = {
            id: 1,
            jsonrpc: '2.0',
            result: 'string'
        };

        const batchPayload = [
            {
                id: 1, jsonrpc: '2.0',
                result: 'string'
            },
            {
                id: 2, jsonrpc: '2.0',
                result: 'string',
            }
        ];

        expect(mapRpcResponsesById(singlePayload)).toEqual({
            '1': { result: 'string' }
        });

        expect(mapRpcResponsesById(batchPayload)).toEqual({
            '1': { result: 'string' },
            '2': { result: 'string' }
        });
    });
});