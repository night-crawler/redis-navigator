import { RSAA } from 'redux-api-middleware';
import { getApiMiddlewareOptions } from '../utils';


export const LOAD_INSTANCES_START = 'redisNavigator/load/redis-instances/start';
export const LOAD_INSTANCES_FAIL = 'redisNavigator/load/redis-instances/fail';
export const LOAD_INSTANCES_SUCCESS ='redisNavigator/load/redis-instances/success';

export const loadInstances = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [LOAD_INSTANCES_START, LOAD_INSTANCES_SUCCESS, LOAD_INSTANCES_FAIL],
        ...getApiMiddlewareOptions(),
    }
});
