import { RSAA } from 'redux-api-middleware';

import { getApiMiddlewareOptions } from 'utils';


export const FETCH_KEYS_PAGE_START = 'redisNavigator/fetch/keys-page/start';
export const FETCH_KEYS_PAGE_FAIL = 'redisNavigator/fetch/keys-page/fail';
export const FETCH_KEYS_PAGE_SUCCESS ='redisNavigator/fetch/keys-page/success';

export const fetchKeysPage = (baseUrl, page, perPage) => ({
    [RSAA]: {
        endpoint: `${baseUrl}/${page}?per_page=${perPage}`,
        method: 'GET',
        types: [
            FETCH_KEYS_PAGE_START,
            FETCH_KEYS_PAGE_SUCCESS,
            FETCH_KEYS_PAGE_FAIL
        ],
        ...getApiMiddlewareOptions(),
    }
});
