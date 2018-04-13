import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';

import { fromPairs, pickBy, toPairs, trimEnd } from 'lodash';
import { createSelector } from 'reselect';

import { keyViewer, locationSearchParams, urls } from 'features/selectors';
import { makeAbsoluteUrl } from 'utils';


/**
 * state.redisNavigator.keyViewer.selectedKey
 */
export const selectedKey = createSelector(keyViewer, keyViewer => keyViewer.selectedKey || '');


/**
 * { pattern, sortKeys, scanCount, ttlSeconds }
 * URLSearchParams(state.route.location.search) + defaults
 */
export const locationSearchParamsWithDefaults = createSelector(
    locationSearchParams,
    locationSearchParams => ({
        ...DEFAULT_SEARCH_KEYS_PARAMS,
        ...pickBy(locationSearchParams, (val) => val !== undefined)
    })
);


/**
 * state.redisNavigator.keyViewer[ state.route.location.search[pattern] ]
 */
export const searchInfo = createSelector(
    [ keyViewer, locationSearchParamsWithDefaults ],
    (keyViewer, searchParams) => keyViewer[ searchParams.pattern ] || {}
);


/**
 * state.redisNavigator.keyViewer[ state.route.location.search[pattern] ]
 */
export const searchEndpoints = createSelector(
    [ searchInfo, urls ],
    (searchInfo, urls) =>
        fromPairs(toPairs(searchInfo.endpoints).map(
            ([ name, relativeUrl ]) => [ name, makeAbsoluteUrl(urls.base, relativeUrl) ]
        ))
);


/**
 * state.redisNavigator.keyViewer[ state.route.location.search[pattern] ]
 */
export const searchFirstPageUrl = createSelector(
    searchEndpoints, searchEndpoints => searchEndpoints.get_page
);


export const searchPageUrlPrefix = createSelector(
    searchFirstPageUrl, searchFirstPageUrl =>
        trimEnd(searchFirstPageUrl).split('/').slice(0, -1).join('/')
);


export const searchNumPages = createSelector(
    [ searchInfo, locationSearchParamsWithDefaults ],
    (searchInfo, searchParams) =>
        Math.ceil(searchInfo.count / searchParams.perPage || 1)
);


/**
 * state.redisNavigator.keyViewer[
 *      `keys:${state.route.location.search[pattern]}`
 * ]
 */
export const searchPagesMap = createSelector(
    [ keyViewer, locationSearchParamsWithDefaults ],
    (keyViewer, locationSearchParamsWithDefaults) =>
        keyViewer[ `keys:${locationSearchParamsWithDefaults.pattern}` ]
);


/**
 * state.redisNavigator.keyViewer.types
 */
export const keyTypes = createSelector(keyViewer, keyViewer => keyViewer.types || {});


/**
 * state.redisNavigator.keyViewer.info
 */
export const keyInfo = createSelector(keyViewer, keyViewer => keyViewer.info || {});


/**
 * state.redisNavigator.keyViewer.data
 */
export const keyData = createSelector(keyViewer, keyViewer => keyViewer.data || {});


/**
 * state.redisNavigator.keyViewer.updateResultsMap
 */
export const keyUpdateResultsMap = createSelector(keyViewer, keyViewer => keyViewer.updateResultsMap || {});


/**
 * state.redisNavigator.keyViewer.types[selectedKey]
 */
export const selectedKeyType = createSelector(
    [ keyTypes, selectedKey ],
    (keyTypes, selectedKey) => keyTypes[ selectedKey ]
);


/**
 * state.redisNavigator.keyViewer.info[selectedKey]
 */
export const selectedKeyInfo = createSelector(
    [ keyInfo, selectedKey ],
    (keyInfo, selectedKey) => keyInfo[ selectedKey ]
);


/**
 * state.redisNavigator.keyViewer.data[selectedKey]
 */
export const selectedKeyData = createSelector(
    [ keyData, selectedKey ],
    (keyData, selectedKey) => keyData[ selectedKey ]
);


/**
 * state.redisNavigator.keyViewer.updateResultsMap[selectedKey]
 */
export const selectedKeyUpdateResults = createSelector(
    [ keyUpdateResultsMap, selectedKey ],
    (keyUpdateResultsMap, selectedKey) => keyUpdateResultsMap[ selectedKey ]
);
