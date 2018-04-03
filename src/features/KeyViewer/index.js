import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { RedisRpc, searchKeys } from 'features/actions';
import { locationSearchParamsWithDefaults } from 'features/KeyViewer/selectors';
import { routeInstanceName, routeInstanceSearchUrl, routeKeys, urls, } from 'features/selectors';
import { pickBy } from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { makeAbsoluteUrl, serializeQuery } from 'utils';
import { KeyViewer } from './components';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const {
        urls,
        routeInstanceSearchUrl,
        routeInstanceName
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
        locationSearchParams: locationSearchParamsWithDefaults,
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
