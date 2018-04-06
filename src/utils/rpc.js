import { fromPairs, isArray, pick, toPairs } from 'lodash';

export function mapRpcRequestsById(rpcRequest) {
    const requests = isArray(rpcRequest) ? rpcRequest : [ rpcRequest ];
    return fromPairs(
        requests.map(
            request => [
                request.id,
                pick(request, [ 'method', 'params' ])
            ]
        )
    );
}


export function mapRpcResponsesById(rpcResponse) {
    const responses = isArray(rpcResponse) ? rpcResponse : [ rpcResponse ];
    return fromPairs(
        responses.map(
            response => [
                response.id,
                pick(response, [ 'result', 'error' ])
            ]
        )
    );
}




export function prepareServerInfo(rpcRequest, rpcResponse) {
    const requestsByIdMap = mapRpcRequestsById(rpcRequest);
    const pairs = toPairs(mapRpcResponsesById(rpcResponse))
        .map(([ id, response ]) => {
            const methodName = requestsByIdMap[ id ].method.split('.').pop();

            switch (methodName) {
                case 'config_get':
                    return [ 'config', response ];
                case 'info':
                    return [ 'sections', response ];
                case 'client_list':
                    return [ 'clients', response ];
                case 'dbsize':
                    return [ 'dbsize', response ];
                case 'client_getname':
                    return [ 'name', response ];
            }
        });
    return fromPairs(pairs);
}


export function prepareKeyTypesMap(rpcRequest, rpcResponse) {
    const requestMap = mapRpcRequestsById(rpcRequest);
    const responseMap = mapRpcResponsesById(rpcResponse);

    const pairs = toPairs(requestMap).map(([ id, request ]) =>
        [ request.params.key, responseMap[ id ].result ]
    );
    return fromPairs(pairs);
}

