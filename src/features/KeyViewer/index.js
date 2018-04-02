import { connect } from 'react-redux';
import { makeAbsoluteUrl, serializeQuery } from 'utils';
import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';
import { RedisRpc, searchKeys } from '../actions';
import { push } from 'react-router-redux';
import { pickBy } from 'lodash';
import { KeyViewer } from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeInstanceSearchUrl,
    routeKeys,
    urls,
    locationSearchParams,
} from '../selectors';


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
                    ...pickBy({ pattern, sortKeys, scanCount, ttlSeconds }, (val) => val)
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
        locationSearchParams,
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
