import produce from 'immer';
import _ from 'lodash';
import { LOAD_INSPECTIONS_START, LOAD_INSPECTIONS_SUCCESS } from './features/actions/loadInspections';
import { LOAD_INSTANCES_START, LOAD_INSTANCES_SUCCESS } from './features/actions/loadInstances';
import { REDIS_RPC_FETCH_INFO_START, REDIS_RPC_FETCH_INFO_SUCCESS, } from './features/actions/redisRpc';
import { SET_ACTIVE_INSTANCE } from './features/actions/setActiveInstance';
import { APPEND_METHOD_CALL_EDITOR } from './features/RedisConsole/actions';


function mapRpcRequestsById(rpcRequest) {
    return _(_.isArray(rpcRequest) ? rpcRequest : [rpcRequest])
        .map(request => [request.id, _.pick(request, ['method', 'params'])])
        .fromPairs()
        .value();
}


function mapRpcResponsesById(rpcResponse) {
    return _(_.isArray(rpcResponse) ? rpcResponse : [rpcResponse])
        .map(response => [response.id, _.pick(response, ['result', 'error'])])
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
        .map(([id, response]) => {
            const
                request = instanceData.requests[id],
                methodName = request.method.split('.').pop();

            switch (methodName) {
                case 'config_get':
                    return ['config', response];
                case 'info':
                    return ['sections', response];
                case 'client_list':
                    return ['clients', response];
                case 'dbsize':
                    return ['dbsize', response];
                case 'client_getname':
                    return ['name', response];
            }
        })
        .fromPairs()
        .value();
}


export const redisNavigator = (state = {}, action) => produce(state, draft => {
    const { instancesData } = state;
    const { payload, meta } = action;

    switch (action.type) {
        case SET_ACTIVE_INSTANCE:
            draft.activeInstanceName = payload.name;
            break;

        case LOAD_INSTANCES_START:
            draft.hasLoaded.instances = false;
            break;

        case LOAD_INSTANCES_SUCCESS:
            draft.instances = payload;
            draft.hasLoaded.instances = true;
            payload.forEach(({ name }) => {
                if (!instancesData[name])
                    draft.instancesData[name] = {
                        requests: {},
                        responses: {},
                        info: {},
                        console: []
                    };
            });
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

        case LOAD_INSPECTIONS_START:
            draft.hasLoaded.inspections = false;
            break;

        case LOAD_INSPECTIONS_SUCCESS:
            draft.hasLoaded.inspections = true;
            draft.inspections = payload;
            break;

        case APPEND_METHOD_CALL_EDITOR:
            draft.instancesData[meta.path].console.push(payload);
            break;
    }
});


export default redisNavigator;
