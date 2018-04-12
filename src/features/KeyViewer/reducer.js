import {
    FETCH_KEYS_PAGE_SUCCESS,
    REDIS_RPC_FETCH_KEY_DATA_SUCCESS,
    REDIS_RPC_FETCH_KEY_INFO_SUCCESS,
    REDIS_RPC_FETCH_KEY_TYPES_SUCCESS,
    SEARCH_KEYS_SUCCESS,
} from 'features/actions';
import produce from 'immer';
import { prepareKeyInfo, prepareKeyTypesMap } from 'utils';
import { SET_SELECTED_KEY } from './actions';


export const keyViewer = (state = {}, action) => produce(state, draft => {
    const { payload, meta } = action;

    switch (action.type) {
        case SEARCH_KEYS_SUCCESS:
            draft[ payload.pattern ] = payload;
            draft[ `keys:${payload.pattern}` ] = {};
            draft.types = {};
            draft.info = {};
            draft.data = {};
            break;

        case FETCH_KEYS_PAGE_SUCCESS:
            draft[ `keys:${payload.pattern}` ][ payload.page_number ] = payload.results;
            break;

        case REDIS_RPC_FETCH_KEY_TYPES_SUCCESS:
            draft.types = { ...state.types, ...prepareKeyTypesMap(meta.request, payload) };
            break;

        case SET_SELECTED_KEY:
            draft.selectedKey = payload.key;
            break;

        case REDIS_RPC_FETCH_KEY_INFO_SUCCESS:
            draft.info = {
                ...state.info,
                ...prepareKeyInfo(meta.request, payload)
            };
            break;

        case REDIS_RPC_FETCH_KEY_DATA_SUCCESS:
            draft.data[ meta.request.params.key ] = payload.result;
            break;
    }
});
