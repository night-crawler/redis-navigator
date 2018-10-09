import { RSAA } from 'redux-api-middleware';

import { getApiMiddlewareOptions } from 'utils';


export const FETCH_INSPECTIONS_START = 'redisNavigator/fetch/inspections/start';
export const FETCH_INSPECTIONS_FAIL = 'redisNavigator/fetch/inspections/fail';
export const FETCH_INSPECTIONS_SUCCESS ='redisNavigator/fetch/inspections/success';

export const fetchInspections = (url) => ({
  [RSAA]: {
    endpoint: url,
    method: 'GET',
    types: [FETCH_INSPECTIONS_START, FETCH_INSPECTIONS_SUCCESS, FETCH_INSPECTIONS_FAIL],
    ...getApiMiddlewareOptions(),
  }
});
