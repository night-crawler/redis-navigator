import { RPC_BATCH_START, TOGGLE_PROGRESS_BAR_VISIBLE } from 'features/actions';
import { BIND_CALL_EDITOR_TO_ID } from 'features/RedisConsole/actions';
import { isArray, isBoolean } from 'lodash';


export const progress = (state = {}, action) => {
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
