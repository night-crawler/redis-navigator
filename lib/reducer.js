import { LOAD_REDIS_INSTANCES_SUCCESS } from './actions/loadRedisInstances';

export const redisNavigator = (state = {}, action) => {
    switch (action.type) {
        case LOAD_REDIS_INSTANCES_SUCCESS:
            return {
                ...state,
                instances: action.payload,
            };

        default:
            return state;
    }
};

export default redisNavigator;
