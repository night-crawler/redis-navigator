import { RSAA } from 'redux-api-middleware';
import { getApiMiddlewareOptions } from '../utils';


export const LOAD_INSPECTIONS_START = 'redisNavigator/load/inspections/start';
export const LOAD_INSPECTIONS_FAIL = 'redisNavigator/load/inspections/fail';
export const LOAD_INSPECTIONS_SUCCESS ='redisNavigator/load/inspections/success';

export const loadInspections = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [LOAD_INSPECTIONS_START, LOAD_INSPECTIONS_SUCCESS, LOAD_INSPECTIONS_FAIL],
        ...getApiMiddlewareOptions(),
    }
});
