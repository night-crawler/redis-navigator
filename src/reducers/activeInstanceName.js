import { SET_ACTIVE_INSTANCE } from '~/features/actions';


export const activeInstanceName = (state = '', action) => {
    switch (action.type) {
        case SET_ACTIVE_INSTANCE:
            return action.payload.name;

        default:
            return state;
    }
};
