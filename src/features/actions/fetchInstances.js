import { RSAA } from 'redux-api-middleware';

import { getApiMiddlewareOptions } from '~/utils';


export const FETCH_INSTANCES_START = 'redisNavigator/fetch/redis-instances/start';
export const FETCH_INSTANCES_FAIL = 'redisNavigator/fetch/redis-instances/fail';
export const FETCH_INSTANCES_SUCCESS ='redisNavigator/fetch/redis-instances/success';

export const fetchInstances = (url) => ({
  [RSAA]: {
    endpoint: url,
    method: 'GET',
    types: [FETCH_INSTANCES_START, FETCH_INSTANCES_SUCCESS, FETCH_INSTANCES_FAIL],
    ...getApiMiddlewareOptions(),
  }
});
