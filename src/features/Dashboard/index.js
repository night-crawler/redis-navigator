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
    const { urls: { rpcEndpointUrl } } = stateProps;
    const { dispatch } = dispatchProps;

    const rpc = new RedisRpc({ endpoint: rpcEndpointUrl, dispatch });

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            fetchInfo: name => rpc.fetchInfo(name),
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
