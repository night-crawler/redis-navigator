import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { locationSearchParams, } from 'features/selectors';
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
