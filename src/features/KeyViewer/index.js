import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { fetchKeysPage, RedisRpc, searchKeys } from 'features/actions';
import { setActiveKey } from './actions';
import {
    hasFetchedSearchKeys,
    isFetchingSearchKeys,
    routeInstanceName,
    routeInstanceSearchUrl,
    routeKeys,
    shouldFetchSearchKeys,
    urls,
} from 'features/selectors';
import { flatten, map, pickBy } from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeAbsoluteUrl, PageHelper, serializeQuery } from 'utils';
import { KeyViewer } from './components';
import {
    keyTypes,
    locationSearchParamsWithDefaults,
    searchEndpoints,
    searchPageUrlPrefix,
    searchInfo,
    searchPagesMap,
    activeKey,
} from './selectors';



function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const {
        urls,
        routeInstanceSearchUrl,
        routeInstanceName,
        searchPageUrlPrefix,
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

            setActiveKey: (key) => dispatch(setActiveKey(key)),

            fetchKeyRangeWithTypes: ({ startIndex, stopIndex, perPage }) => {
                const pageHelper = new PageHelper(undefined, perPage);

                return Promise
                    .all(
                        pageHelper
                            .getPageRange(startIndex, stopIndex)
                            .map(pageNum => dispatch(fetchKeysPage(searchPageUrlPrefix, pageNum, perPage)))
                    )
                    .then(data =>
                        rpc.fetchKeyTypes(flatten(map(data, 'payload.results')))
                    );
            }
        },

        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        activeKey,
        routeInstanceName,
        routeInstanceSearchUrl,
        routeKeys,
        urls,
        searchPagesMap,
        searchEndpoints,
        searchInfo,
        searchPageUrlPrefix,
        shouldFetchSearchKeys,
        hasFetchedSearchKeys,
        isFetchingSearchKeys,
        locationSearchParams: locationSearchParamsWithDefaults,
        keyTypes,
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
