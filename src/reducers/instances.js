import { FETCH_INSTANCES_SUCCESS } from '~/features/actions';


export const instances = (state = [], action) => {
    switch (action.type) {
        case FETCH_INSTANCES_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};
