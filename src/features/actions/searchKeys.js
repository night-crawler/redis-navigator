import { RSAA } from 'redux-api-middleware';
import { getApiMiddlewareOptions } from '../../utils';


export const SEARCH_KEYS_START = 'redisNavigator/keys/search/start';
export const SEARCH_KEYS_SUCCESS ='redisNavigator/keys/search/success';
export const SEARCH_KEYS_FAIL = 'redisNavigator/keys/search/fail';


export const searchKeys = ({ url, scanCount = 5000, pattern = '*', sortKeys = true, ttlSeconds = 5 * 60 }) => ({
    [RSAA]: {
        endpoint: url,
        body: JSON.stringify({
            scan_count: scanCount,
            sort_keys: sortKeys,
            ttl_seconds: ttlSeconds,
            pattern,
        }),
        method: 'POST',
        types: [SEARCH_KEYS_START, SEARCH_KEYS_SUCCESS, SEARCH_KEYS_FAIL],
        ...getApiMiddlewareOptions(),
    }
});
