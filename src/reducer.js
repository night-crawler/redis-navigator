import { combineReducers } from 'redux';
import produce from 'immer';
import {
    SET_ACTIVE_INSTANCE,
    FETCH_ENDPOINTS_START, FETCH_ENDPOINTS_SUCCESS,
    FETCH_INSPECTIONS_START, FETCH_INSPECTIONS_SUCCESS,
    SEARCH_KEYS_START, SEARCH_KEYS_SUCCESS,
    REDIS_RPC_FETCH_INFO_SUCCESS,
    FETCH_INSTANCES_START, FETCH_INSTANCES_SUCCESS,
    RPC_BATCH_START, RPC_BATCH_SUCCESS,
    INIT_STORE_WITH_URLS,
    TOGGLE_PROGRESS_BAR_VISIBLE,
    FETCH_KEYS_PAGE_START, FETCH_KEYS_PAGE_SUCCESS, FETCH_KEYS_PAGE_FAIL
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
import { makeAbsoluteUrl } from './utils';


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
        case FETCH_INSTANCES_SUCCESS:
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
        case FETCH_INSTANCES_SUCCESS:
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


const hasFetched = (state = {}, action) => {
    const updateState = {
        [FETCH_INSPECTIONS_START]: { inspections: false },
        [FETCH_INSPECTIONS_SUCCESS]: { inspections: true },

        [FETCH_INSTANCES_START]: { instances: false },
        [FETCH_INSTANCES_SUCCESS]: { instances: true },

        [FETCH_ENDPOINTS_START]: { endpoints: false },
        [FETCH_ENDPOINTS_SUCCESS]: { endpoints: true },

        [SEARCH_KEYS_START]: { searchKeys: false },
        [SEARCH_KEYS_SUCCESS]: { searchKeys: true },
    }[action.type];

    return updateState !== undefined
        ? { ...state, ...updateState }
        : state;
};


const isFetching = (state = {}, action) => {
    const updateState = {
        [FETCH_INSPECTIONS_START]: { inspections: true },
        [FETCH_INSPECTIONS_SUCCESS]: { inspections: false },

        [FETCH_INSTANCES_START]: { instances: true },
        [FETCH_INSTANCES_SUCCESS]: { instances: false },

        [FETCH_ENDPOINTS_START]: { endpoints: true },
        [FETCH_ENDPOINTS_SUCCESS]: { endpoints: false },

        [SEARCH_KEYS_START]: { searchKeys: true },
        [SEARCH_KEYS_SUCCESS]: { searchKeys: false },
    }[action.type];

    return updateState !== undefined
        ? { ...state, ...updateState }
        : state;
};


const inspections = (state = {}, action) => {
    switch (action.type) {
        case FETCH_INSPECTIONS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};


/**
 * Also makes all urls absolute
 */
const urls = (state = {}, action) => {
    const { payload } = action;

    switch (action.type) {
        case INIT_STORE_WITH_URLS:
            return {
                ...state,
                base: payload.base,
                endpoints: makeAbsoluteUrl(payload.base, payload.endpoints)
            };

        case FETCH_ENDPOINTS_SUCCESS:
            return {
                ...state,
                ...fromPairs(Object.entries(payload).map(
                    ([ name, endpoint ]) => [ name, makeAbsoluteUrl(state.base, endpoint) ]
                )),
            };

        default:
            return state;
    }
};


const progress = (state = {}, action) => {
    const { payload, meta } = action;

    switch (action.type) {
        case RPC_BATCH_START:
            return {
                ...state,
                count: isArray(meta.request) ? meta.request.length : 1,
                percent: 0,
                isVisible: true,
            };

        case BIND_CALL_EDITOR_TO_ID:
            return {
                ...state,
                percent: state.percent + 100 / state.count,
            };

        case TOGGLE_PROGRESS_BAR_VISIBLE:
            return {
                ...state,
                isVisible: isBoolean(payload.isVisible)
                    ? payload.isVisible
                    : !state.isVisible
            };

        default:
            return state;
    }
};


const keySearch = (state = {}, action) => produce(state, draft => {
    const { payload } = action;

    switch (action.type) {
        case SEARCH_KEYS_SUCCESS:
            draft[payload.pattern] = payload;
            draft[`keys:${payload.pattern}`] = {};
            break;

        case FETCH_KEYS_PAGE_SUCCESS:
            draft[payload.pattern].paginationCursor = pick(
                payload,
                [ 'pattern', 'next', 'previous', 'num_pages', 'page_number' ]
            );
            draft[`keys:${payload.pattern}`][payload.page_number] = payload.results;
            break;
    }
});


export default combineReducers({
    instances,
    instancesData,
    activeInstanceName,
    hasFetched,
    isFetching,
    inspections,
    urls,
    progress,
    keySearch,
});
