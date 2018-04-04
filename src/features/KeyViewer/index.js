import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { fetchKeysPage, RedisRpc, searchKeys } from 'features/actions';
import {
    hasFetchedSearchKeys,
    routeInstanceName,
    routeInstanceSearchUrl,
    routeKeys,
    shouldFetchSearchKeys,
    urls
} from 'features/selectors';
import { pickBy, trimEnd } from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeAbsoluteUrl, serializeQuery } from 'utils';
import { KeyViewer } from './components';
import {
    locationSearchParamsWithDefaults,
    searchPagesMap,
    searchEndpoints,
    searchFirstPageUrl,
    searchInfo,
    searchNumPages
} from './selectors';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const {
        urls,
        routeInstanceSearchUrl,
        routeInstanceName,
        searchFirstPageUrl,
    } = stateProps;

    const { dispatch } = dispatchProps;

    const rpc = new RedisRpc({
        dispatch,
        instanceName: routeInstanceName,
        endpoint: urls.rpc,
    });

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            searchKeys: ({ pattern, scanCount, sortKeys, ttlSeconds }) => {
                const searchParams = {
                    ...DEFAULT_SEARCH_KEYS_PARAMS,
                    ...pickBy({ pattern, sortKeys, scanCount, ttlSeconds }, (val) => val !== undefined)
                };

                dispatch(push({
                    search: serializeQuery(searchParams, DEFAULT_SEARCH_KEYS_PARAMS)
                }));

                return dispatch(searchKeys({
                    url: makeAbsoluteUrl(urls.base, routeInstanceSearchUrl),
                    ...searchParams
                }));
            },
            fetchKeysPage: (pageNum) => {
                const pageUrlPrefix = trimEnd(searchFirstPageUrl).split('/').slice(0, -1).join('/');
                const pageUrl = `${pageUrlPrefix}/${pageNum}`;

                return dispatch(fetchKeysPage(pageUrl, DEFAULT_SEARCH_KEYS_PARAMS.perPage));
            }
        },

        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        routeInstanceName,
        routeInstanceSearchUrl,
        routeKeys,
        urls,
        searchPagesMap,
        searchEndpoints,
        searchInfo,
        searchNumPages,
        searchFirstPageUrl,
        shouldFetchSearchKeys,
        hasFetchedSearchKeys,
        locationSearchParams: locationSearchParamsWithDefaults,
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
