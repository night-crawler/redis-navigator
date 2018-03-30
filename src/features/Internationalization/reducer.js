import { SWITCH_INTL_LOCALE, UPDATE_INTL_DATA } from './actions';


export function internationalizationReducer(state = {}, action) {
    const { payload } = action;

    switch (action.type) {
        case UPDATE_INTL_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    [payload.locale]: payload
                }
            };

        case SWITCH_INTL_LOCALE:
            return {
                ...state,
                locale: payload,
            };

        default:
            return state;
    }
}
