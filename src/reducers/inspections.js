import { FETCH_INSPECTIONS_SUCCESS } from 'features/actions';


export const inspections = (state = {}, action) => {
    switch (action.type) {
        case FETCH_INSPECTIONS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};
