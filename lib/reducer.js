import { LOAD_INSPECTIONS_SUCCESS } from './actions/loadInspections';
import { LOAD_INSTANCES_SUCCESS } from './actions/loadInstances';
import {
    REDIS_RPC_FETCH_INFO_START,
    REDIS_RPC_FETCH_INFO_SUCCESS,
} from './actions/redisRpc';
import { SET_ACTIVE_INSTANCE } from './actions/setActiveInstance';
import produce from 'immer';
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


/*
* instancesData = {
*   redis_0: {
*       requests: {},
*       responses: {},
*       info: {}
*   }
* }
* */


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


export const redisNavigator = (state = {}, action) => produce(state, draft => {
    const { instancesData } = state;
    const { payload, meta } = action;

    switch (action.type) {
        case LOAD_INSTANCES_SUCCESS:
            draft.instances = payload;
            payload.forEach(({ name }) => {
                if (!instancesData[name])
                    draft.instancesData[name] = {requests: {}, responses: {}, info: {}};
            });
            break;

        case SET_ACTIVE_INSTANCE:
            draft.activeInstanceName = payload.name;
            break;

        case REDIS_RPC_FETCH_INFO_START:
            draft.instancesData[meta.path].requests = {
                ...instancesData[meta.path].requests,
                ...mapRpcRequestsById(meta.request)
            };
            break;

        case REDIS_RPC_FETCH_INFO_SUCCESS:
            draft.instancesData[meta.path].responses = {
                ...instancesData[meta.path].responses,
                ...mapRpcResponsesById(payload)
            };
            draft.instancesData[meta.path].info = registerInfo(instancesData[meta.path], payload);
            break;

        case LOAD_INSPECTIONS_SUCCESS:
            draft.inspections = payload;
            break;
    }
});


export default redisNavigator;
