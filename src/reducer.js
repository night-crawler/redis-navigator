import { combineReducers } from 'redux';
import produce from 'immer';
import {
    SET_ACTIVE_INSTANCE,
    LOAD_INSPECTIONS_START, LOAD_INSPECTIONS_SUCCESS,
    REDIS_RPC_FETCH_INFO_SUCCESS,
    LOAD_INSTANCES_START, LOAD_INSTANCES_SUCCESS,
    RPC_BATCH_START, RPC_BATCH_SUCCESS,
    INIT_STORE_WITH_URLS,
} from './features/actions';
import { isArray, fromPairs, pick, findIndex, isBoolean } from 'lodash';

import {
    APPEND_CALL_EDITOR,
    REMOVE_CALL_EDITOR,
    CHANGE_CALL_EDITOR_METHOD_NAME,
    CHANGE_CALL_EDITOR_METHOD_PARAMS,
    CLEAR_CALL_EDITORS,
    BIND_CALL_EDITOR_TO_ID,
    TOGGLE_IMPORT_DIALOG_VISIBLE,
} from './features/RedisConsole/actions';


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


function registerInfo(requests, rpcResponse) {
    const requestsByIdMap = mapRpcRequestsById(requests);
    const pairs = Object.entries(mapRpcResponsesById(rpcResponse))
        .map(([ id, response ]) => {
            const methodName = requestsByIdMap[id].method.split('.').pop();

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


const instances = (state = [], action) => {
    switch (action.type) {
        case LOAD_INSTANCES_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};


const instancesData = (state = {}, action) => produce(state, draft => {
    const { payload, meta } = action;

    const draftRedis = meta ? draft[meta.path] : null;
    const redis = meta ? state[meta.path] : null;

    // index of call editor's actions
    const cmdIndex = redis && payload && payload.key
        ? findIndex(redis.consoleCommands, { key: payload.key })
        : null;

    switch (action.type) {
        case LOAD_INSTANCES_SUCCESS:
            payload.forEach(({ name }) => {
                if (!state[name])
                    draft[name] = {
                        requests: {},
                        responses: {},
                        info: {},
                        consoleCommands: [],
                        importDialogIsVisible: false,
                    };
            });
            break;

        case RPC_BATCH_START:
            draftRedis.requests = {
                ...state[meta.path].requests,
                ...mapRpcRequestsById(meta.request)
            };
            break;

        case RPC_BATCH_SUCCESS:
            draftRedis.responses = {
                ...redis.responses,
                ...mapRpcResponsesById(payload)
            };
            break;

        case REDIS_RPC_FETCH_INFO_SUCCESS:
            draftRedis.info = registerInfo(meta.request, payload);
            break;

        case APPEND_CALL_EDITOR:
            draftRedis.consoleCommands.push(payload);
            break;

        case REMOVE_CALL_EDITOR:
            draftRedis.consoleCommands.splice(cmdIndex, 1);
            break;

        case CHANGE_CALL_EDITOR_METHOD_NAME:
            draftRedis
                .consoleCommands[cmdIndex]
                .methodName = payload.methodName;
            draftRedis
                .consoleCommands[cmdIndex]
                .dirty = true;
            break;

        case CHANGE_CALL_EDITOR_METHOD_PARAMS:
            draftRedis
                .consoleCommands[cmdIndex]
                .methodParams = payload.methodParams;
            draftRedis.consoleCommands[cmdIndex].dirty = true;
            break;

        case CLEAR_CALL_EDITORS:
            draftRedis
                .consoleCommands = [];
            break;

        case BIND_CALL_EDITOR_TO_ID:
            draftRedis
                .consoleCommands[cmdIndex]
                .response = redis.responses[payload.requestId];
            draftRedis
                .consoleCommands[cmdIndex]
                .dirty = false;
            break;

        case TOGGLE_IMPORT_DIALOG_VISIBLE:
            draftRedis.importDialogIsVisible =
                isBoolean(payload.isVisible)
                    ? payload.isVisible
                    : !redis.importDialogIsVisible;
            break;
    }
});


const activeInstanceName = (state = '', action) => {
    switch (action.type) {
        case SET_ACTIVE_INSTANCE:
            return action.payload.name;

        default:
            return state;
    }
};


const hasLoaded = (state = {}, action) => {
    switch (action.type) {
        case LOAD_INSPECTIONS_START:
            return { ...state, inspections: false };

        case LOAD_INSPECTIONS_SUCCESS:
            return { ...state, inspections: true };

        case LOAD_INSTANCES_START:
            return { ...state, instances: false };

        case LOAD_INSTANCES_SUCCESS:
            return { ...state, instances: true };

        default:
            return state;
    }
};


const inspections = (state = {}, action) => {
    switch (action.type) {
        case LOAD_INSPECTIONS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};


const urls = (state = {}, action) => {
    switch (action.type) {
        case INIT_STORE_WITH_URLS:
            return action.payload;

        default:
            return state;
    }
};


export default combineReducers({
    instances,
    instancesData,
    activeInstanceName,
    hasLoaded,
    inspections,
    urls,
});
