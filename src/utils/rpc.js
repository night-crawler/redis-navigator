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


export function mergeRpcRequestResponse(rpcRequest, rpcResponse) {
    const requestMap = mapRpcRequestsById(rpcRequest);
    const responseMap = mapRpcResponsesById(rpcResponse);

    return toPairs(requestMap).map(
        ([ id, request ]) => ({
            id: +id,
            methodName: request.method.split('.').pop(),
            ...request,
            ...responseMap[id],
        })
    );
}


export function prepareServerInfo(rpcRequest, rpcResponse) {
    return fromPairs(mergeRpcRequestResponse(rpcRequest, rpcResponse).map(
        ({ methodName, result, error }) => {
            switch (methodName) {
                case 'config_get':
                    return [ 'config', { result, error } ];
                case 'info':
                    return [ 'sections', { result, error } ];
                case 'client_list':
                    return [ 'clients', { result, error } ];
                case 'dbsize':
                    return [ 'dbsize', { result, error } ];
                case 'client_getname':
                    return [ 'name', { result, error } ];
            }
        }
    ));
}


export function prepareKeyTypesMap(rpcRequest, rpcResponse) {
    return fromPairs(
        mergeRpcRequestResponse(rpcRequest, rpcResponse).map(
            ({ params: { key }, result }) =>
                [ key, result ]
        )
    );
}


export function prepareKeyInfo(rpcRequest, rpcResponse) {
    return fromPairs(
        mergeRpcRequestResponse(rpcRequest, rpcResponse).map(
            ({ methodName, result }) =>
                [ methodName, result ]
        )
    );
}


export function prepareUpdateKeyData(rpcRequest, rpcResponse) {
    const results = mergeRpcRequestResponse(rpcRequest, rpcResponse)
        .filter(bundle => bundle.methodName !== 'multi_exec')
        .map(// eslint-disable-next-line
            ({ id, method, params, ...rest }) => rest
        );
    const hasErrors = !!results.filter(bundle => bundle.error !== undefined).length;
    return { results, hasErrors};
}
