import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { locationSearchParams, keySearch } from 'features/selectors';
import { pickBy } from 'lodash';

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
 * state.redisNavigator.keySearch[
 *      state.route.location.search[pattern]
 * ]
 */
export const searchInfo = createSelector(
    [keySearch, locationSearchParamsWithDefaults],
    (keySearch, locationSearchParamsWithDefaults) =>
        keySearch[locationSearchParamsWithDefaults.pattern]
);


/**
 * state.redisNavigator.keySearch[
 *      `keys:${state.route.location.search[pattern]}`
 * ]
 */
export const searchDataSlices = createSelector(
    [keySearch, locationSearchParamsWithDefaults],
    (keySearch, locationSearchParamsWithDefaults) =>
        keySearch[`keys:${locationSearchParamsWithDefaults.pattern}`]
);
