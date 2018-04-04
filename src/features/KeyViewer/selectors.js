import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { locationSearchParams, keySearch, urls } from 'features/selectors';
import { pickBy, toPairs, fromPairs } from 'lodash';
import { makeAbsoluteUrl } from 'utils';
import { createSelector } from 'reselect';

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
