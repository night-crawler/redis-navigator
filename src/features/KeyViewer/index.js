import { connect } from 'react-redux';
import { RedisRpc } from '../actions';
import { KeyViewer } from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeKeys,
    urls,
} from '../selectors';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const {
        urls: { rpcEndpointUrl },
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
        },
        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        routeInstanceName,
        routeKeys,
        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
