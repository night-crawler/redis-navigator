import { LOAD_REDIS_INSTANCES_SUCCESS } from './actions/loadRedisInstances';
import { SET_ACTIVE_INSTANCE } from './actions/setActiveInstance';


export const redisNavigator = (state = {}, action) => {
    switch (action.type) {
        case LOAD_REDIS_INSTANCES_SUCCESS:
            return {
                ...state,
                instances: action.payload,
            };

        case SET_ACTIVE_INSTANCE:
            return {
                ...state,
                activeInstance: action.payload.name,
            };

        default:
            return state;
    }
};

export default redisNavigator;
