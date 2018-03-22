import { connect } from 'react-redux';
import { RedisRpc } from '../actions';
import Dashboard from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeInstanceInfo,
    routeInstanceDataExists,
    urls,
} from '../selectors';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls: { rpcEndpointUrl }, routeInstanceName } = stateProps;
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
            fetchInfo: rpc.fetchInfo,
        },
        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        routeInstanceName,
        routeInstanceInfo,
        routeInstanceDataExists,
        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(Dashboard);
