import { connect } from 'react-redux';
import { makeAbsoluteUrl } from 'utils';
import { RedisRpc, searchKeys } from '../actions';
import { push } from 'react-router-redux';
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
            searchKeys: ({ scanCount = 5000, pattern = '*', sortKeys = true, ttlSeconds = 5 * 60 }) => {
                dispatch(push({
                    search: new URLSearchParams({ pattern, sortKeys, scanCount, ttlSeconds }).toString()
                }));

                return dispatch(searchKeys({
                    url: makeAbsoluteUrl(urls.base, routeInstanceSearchUrl),
                    scanCount, pattern, sortKeys, ttlSeconds
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
