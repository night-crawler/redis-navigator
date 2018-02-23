import { LOAD_REDIS_INSTANCES_SUCCESS } from './actions/loadRedisInstances';
import {
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
} from './actions/redisRpc';
import { SET_ACTIVE_INSTANCE } from './actions/setActiveInstance';
import _ from 'lodash';


function mapRpcRequestsById(rpcRequest) {
    return _(_.isArray(rpcRequest) ? rpcRequest : [rpcRequest])
        .map(request => [ request.id, _.pick(request, ['method', 'params']) ])
        .fromPairs()
        .value();
}


function mapRpcResponsesById(rpcResponse) {
    return _(_.isArray(rpcResponse) ? rpcResponse : [rpcResponse])
        .map(response => [ response.id, _.pick(response, ['result', 'error']) ])
        .fromPairs()
        .value();
}


function initializeInstancesData(instancesData, instanceNames) {
    const changed =_(instanceNames).map(name => {
        const oldData = instancesData[name];
        if (!_.isEmpty(oldData))
            return [name, oldData];
        return [name, {
            requests: {},
            responses: {},
            info: {}
        }];
    }).fromPairs().value();

    return { ...instancesData, ...changed };
}

/*
* instancesData = {
*   redis_0: {
*       requests: {},
*       responses: {},
*       info: {}
*   }
* }
* */

function registerRpcRequest(instancesData, instanceName, rpcRequest) {
    const instanceData = instancesData[instanceName];
    return {
        ...instancesData,
        [instanceName]: {
            ...instanceData,
            requests: {
                ...instanceData.requests,
                ...mapRpcRequestsById(rpcRequest)
            }
        }
    };
}


function registerRpcResponse(instancesData, instanceName, rpcResponse) {
    const instanceData = instancesData[instanceName];
    return {
        ...instancesData,
        [instanceName]: {
            ...instanceData,
            responses: {
                ...instanceData.responses,
                ...mapRpcResponsesById(rpcResponse)
            }
        }
    };
}


function registerInfo(instanceData, rpcResponse) {
    return _(mapRpcResponsesById(rpcResponse))
        .entries()
        .map(([ id, response ]) => {
            const
                request = instanceData.requests[id],
                methodName = request.method.split('.').pop();

            switch(methodName) {
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
        })
        .fromPairs()
        .value();
}


export const redisNavigator = (state = {}, action) => {
    const { instancesData } = state;
    const { payload, meta } = action;

    switch (action.type) {
        case LOAD_REDIS_INSTANCES_SUCCESS:
            return {
                ...state,
                instances: payload,
                instancesData: initializeInstancesData(
                    instancesData,
                    _.map(action.payload, 'name')
                )
            };

        case SET_ACTIVE_INSTANCE:
            return {
                ...state,
                activeInstance: payload.name,
            };

        case REDIS_RPC_FETCH_INFO_START:
            return {
                ...state,
                instancesData: registerRpcRequest(instancesData, meta.path, meta.request),
                lastRequest: meta.request,
            };

        case REDIS_RPC_FETCH_INFO_SUCCESS:
            return {
                ...state,
                instancesData: {
                    ...registerRpcResponse(instancesData, meta.path, payload),
                }
            };

        default:
            return state;
    }
};

export default redisNavigator;
