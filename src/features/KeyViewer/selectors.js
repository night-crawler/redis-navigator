import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { locationSearchParams, keySearch, urls } from 'features/selectors';
import { pickBy, toPairs, fromPairs, trimEnd } from 'lodash';
import { makeAbsoluteUrl } from 'utils';
import { createSelector } from 'reselect';


/**
 * state.redisNavigator.keySearch.selectedKey
 */
export const selectedKey = createSelector(keySearch, keySearch => keySearch.selectedKey || '');


/**
 * { pattern, sortKeys, scanCount, ttlSeconds }
 * URLSearchParams(state.route.location.search) + defaults
 */
export const locationSearchParamsWithDefaults = createSelector(
    locationSearchParams,
    locationSearchParams => ( {
        ...DEFAULT_SEARCH_KEYS_PARAMS,
        ...pickBy(locationSearchParams, (val) => val !== undefined)
    } )
);


/**
 * state.redisNavigator.keySearch[ state.route.location.search[pattern] ]
 */
export const searchInfo = createSelector(
    [keySearch, locationSearchParamsWithDefaults],
    (keySearch, searchParams) => keySearch[searchParams.pattern] || {}
);



/**
 * state.redisNavigator.keySearch[ state.route.location.search[pattern] ]
 */
export const searchEndpoints = createSelector(
    [searchInfo, urls],
    (searchInfo, urls) =>
        fromPairs(toPairs(searchInfo.endpoints).map(
            ([ name, relativeUrl ]) => [ name, makeAbsoluteUrl(urls.base, relativeUrl) ]
        ))
);


/**
 * state.redisNavigator.keySearch[ state.route.location.search[pattern] ]
 */
export const searchFirstPageUrl = createSelector(
    searchEndpoints, searchEndpoints => searchEndpoints.get_page
);


export const searchPageUrlPrefix = createSelector(
    searchFirstPageUrl, searchFirstPageUrl =>
        trimEnd(searchFirstPageUrl).split('/').slice(0, -1).join('/')
);


export const searchNumPages = createSelector(
    [searchInfo, locationSearchParamsWithDefaults],
    (searchInfo, searchParams) =>
        Math.ceil(searchInfo.count / searchParams.perPage || 1)
);


/**
 * state.redisNavigator.keySearch[
 *      `keys:${state.route.location.search[pattern]}`
 * ]
 */
export const searchPagesMap = createSelector(
    [keySearch, locationSearchParamsWithDefaults],
    (keySearch, locationSearchParamsWithDefaults) =>
        keySearch[`keys:${locationSearchParamsWithDefaults.pattern}`]
);


/**
 * state.redisNavigator.keySearch.types
 */
export const keyTypes = createSelector(keySearch, keySearch => keySearch.types || {});


/**
 * state.redisNavigator.keySearch.info
 */
export const keyInfo = createSelector(keySearch, keySearch => keySearch.info || {});


/**
 * state.redisNavigator.keySearch.data
 */
export const keyData = createSelector(keySearch, keySearch => keySearch.data || {});
