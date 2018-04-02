import { RSAA } from 'redux-api-middleware';
import { getApiMiddlewareOptions } from 'utils';


export const FETCH_ENDPOINTS_START = 'redisNavigator/fetch/endpoints/start';
export const FETCH_ENDPOINTS_SUCCESS ='redisNavigator/fetch/endpoints/success';
export const FETCH_ENDPOINTS_FAIL = 'redisNavigator/fetch/endpoints/fail';


export const fetchEndpoints = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [
            FETCH_ENDPOINTS_START,
            FETCH_ENDPOINTS_SUCCESS,
            FETCH_ENDPOINTS_FAIL,
        ],
        ...getApiMiddlewareOptions(),
    }
});
