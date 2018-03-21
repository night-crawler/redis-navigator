import { connect } from 'react-redux';
import { RedisRpc } from '../actions';
import { KeyViewer } from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeInstanceInfo,
    urls,
} from '../selectors';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls: { rpcEndpointUrl }, routeInstanceName } = stateProps;
    const { dispatch } = dispatchProps;

    const rpc = new RedisRpc({ endpoint: rpcEndpointUrl, dispatch });

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            loadInfo: () => rpc.loadInfo(routeInstanceName),
        },
        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        routeInstanceName,
        routeInstanceInfo,
        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(KeyViewer);
