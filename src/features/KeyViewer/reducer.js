import { FETCH_KEYS_PAGE_SUCCESS, REDIS_RPC_FETCH_KEY_TYPES_SUCCESS, SEARCH_KEYS_SUCCESS } from 'features/actions';
import produce from 'immer';
import { prepareKeyTypesMap } from 'utils';
import { SET_ACTIVE_KEY } from './actions';


export const keySearch = (state = {}, action) => produce(state, draft => {
    const { payload, meta } = action;

    switch (action.type) {
        case SEARCH_KEYS_SUCCESS:
            draft[ payload.pattern ] = payload;
            draft[ `keys:${payload.pattern}` ] = {};
            draft.types = {};
            break;

        case FETCH_KEYS_PAGE_SUCCESS:
            draft[ `keys:${payload.pattern}` ][ payload.page_number ] = payload.results;
            break;

        case REDIS_RPC_FETCH_KEY_TYPES_SUCCESS:
            draft.types = { ...state.types, ...prepareKeyTypesMap(meta.request, payload) };
            break;

        case SET_ACTIVE_KEY:
            draft.activeKey = payload.key;
            break;
    }
});
