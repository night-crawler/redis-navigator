import produce from 'immer';
import {
    SET_ACTIVE_INSTANCE,
    LOAD_INSPECTIONS_START, LOAD_INSPECTIONS_SUCCESS,
    REDIS_RPC_FETCH_INFO_START, REDIS_RPC_FETCH_INFO_SUCCESS,
    LOAD_INSTANCES_START, LOAD_INSTANCES_SUCCESS,
    RPC_BATCH_START, RPC_BATCH_SUCCESS,
    INIT_STORE_WITH_URLS,
} from './features/actions';
import { isArray, fromPairs, pick, findIndex } from 'lodash';

import {
    APPEND_CALL_EDITOR,
    REMOVE_CALL_EDITOR,
    CHANGE_CALL_EDITOR_METHOD_NAME,
    CHANGE_CALL_EDITOR_METHOD_PARAMS,
    CLEAR_CALL_EDITORS,
    BIND_CALL_EDITOR_TO_ID,
} from './features/RedisConsole/actions';
import { parametersToJson } from './features/RedisConsole/components/utils';


function mapRpcRequestsById(rpcRequest) {
    const requests = isArray(rpcRequest) ? rpcRequest : [rpcRequest];
    return fromPairs(
        requests.map(request => [request.id, pick(request, ['method', 'params'])])
    );
}


function mapRpcResponsesById(rpcResponse) {
    const responses = isArray(rpcResponse) ? rpcResponse : [rpcResponse];
    return fromPairs(
        responses.map(response => [response.id, pick(response, ['result', 'error'])])
    );
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
    const pairs = Object.entries(mapRpcResponsesById(rpcResponse))
        .map(([ id, response ]) => {
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
        });
    return fromPairs(pairs);
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
                        consoleCommands: []
                    };
            });
            break;

        case RPC_BATCH_START:
        case REDIS_RPC_FETCH_INFO_START:
            draft.instancesData[meta.path].requests = {
                ...instancesData[meta.path].requests,
                ...mapRpcRequestsById(meta.request)
            };
            break;

        case RPC_BATCH_SUCCESS:
        case REDIS_RPC_FETCH_INFO_SUCCESS:
            draft.instancesData[meta.path].responses = {
                ...instancesData[meta.path].responses,
                ...mapRpcResponsesById(payload)
            };
            action.type === REDIS_RPC_FETCH_INFO_SUCCESS
                ? draft.instancesData[meta.path].info = registerInfo(instancesData[meta.path], payload)
                : null;
            break;

        case LOAD_INSPECTIONS_START:
            draft.hasLoaded.inspections = false;
            break;

        case LOAD_INSPECTIONS_SUCCESS:
            draft.hasLoaded.inspections = true;
            draft.inspections = payload;
            break;

        case APPEND_CALL_EDITOR:
            draft
                .instancesData[meta.path]
                .consoleCommands.push(payload);
            break;

        case REMOVE_CALL_EDITOR:
            draft
                .instancesData[meta.path]
                .consoleCommands.splice(payload.id, 1);
            break;

        case CHANGE_CALL_EDITOR_METHOD_NAME:
            draft
                .instancesData[meta.path]
                .consoleCommands[payload.id]
                .methodName = payload.methodName;

            draft
                .instancesData[meta.path]
                .consoleCommands[payload.id]
                .methodParams = parametersToJson(
                    state.inspections[payload.methodName].parameters);
            break;

        case CHANGE_CALL_EDITOR_METHOD_PARAMS:
            draft
                .instancesData[meta.path]
                .consoleCommands[payload.id]
                .methodParams = payload.methodParams;
            break;

        case CLEAR_CALL_EDITORS:
            draft
                .instancesData[meta.path]
                .consoleCommands = [];
            break;

        case INIT_STORE_WITH_URLS:
            draft.urls = payload;
            break;

        case BIND_CALL_EDITOR_TO_ID:
            draft
                .instancesData[meta.path]
                .consoleCommands[
                    findIndex(
                        instancesData[meta.path].consoleCommands,
                        { key: payload.key }
                    )
                ]
                .response = instancesData[meta.path].responses[payload.requestId];
            break;
    }
});

export default redisNavigator;
