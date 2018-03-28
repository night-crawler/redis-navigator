import { connect } from 'react-redux';
import { RedisRpc, searchKeys } from '../actions';
import { KeyViewer } from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeInstanceSearchUrl,
    routeKeys,
    urls,
} from '../selectors';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const {
        urls: { rpcEndpointUrl },
        routeInstanceSearchUrl,
        routeInstanceName
    } = stateProps;

    const { dispatch } = dispatchProps;

    const rpc = new RedisRpc({
        dispatch,
        instanceName: routeInstanceName,
        endpoint: rpcEndpointUrl,
    });

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            searchKeys: ({ scanCount = 5000, pattern = '*', sortKeys = true, ttlSeconds = 5 * 60 }) =>
                dispatch(searchKeys({
                    url: routeInstanceSearchUrl, scanCount, pattern, sortKeys, ttlSeconds
                }))
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
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
