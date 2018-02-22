import { LOAD_REDIS_INSTANCES_SUCCESS } from './actions/loadRedisInstances';
import {
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
} from './actions/redisRpc';
import { SET_ACTIVE_INSTANCE } from './actions/setActiveInstance';
import _ from 'lodash';


function mapRpcRequestsById(rpcRequest) {
    return _(_.isArray(rpcRequest) ? rpcRequest : [rpcRequest])
        .map(request => [ request.id, {request: _.pick(request, ['method', 'params'])} ])
        .fromPairs()
        .value();
}


function mergeRpcResponses(mapping, rpcResponse) {
    const responsesById = _(_.isArray(rpcResponse) ? rpcResponse : [rpcResponse]).keyBy('id').value();
    return _(mapping)
        .entries()
        .map(([requestId, data]) => {
            const response = responsesById[requestId];
            return {
                ...data,
                response: response.result || response.error,
                success: !_.has(response, 'error'),
            };
        })
        .value();
}


export const redisNavigator = (state = {}, action) => {
    switch (action.type) {
        case LOAD_REDIS_INSTANCES_SUCCESS:
            return {
                ...state,
                instances: action.payload,
                instancesData: {
                    ...state.instancesData,
                }
            };

        case SET_ACTIVE_INSTANCE:
            return {
                ...state,
                activeInstance: action.payload.name,
            };

        case REDIS_RPC_FETCH_INFO_START:
            return {
                ...state,
                requestResponseByIdMap: {
                    ...state.requestResponseByIdMap,
                    ...mapRpcRequestsById(action.meta.request)
                },
                lastRequest: action.meta.request,
            };

        case REDIS_RPC_FETCH_INFO_SUCCESS:
            return {
                ...state,
                requestResponseByIdMap: mergeRpcResponses(
                    state.requestResponseByIdMap,
                    action.payload
                )
            };

        default:
            return state;
    }
};

export default redisNavigator;
