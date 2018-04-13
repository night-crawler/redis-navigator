import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { RedisRpc } from '../actions';
import {
    routeInstanceName,
    routeInstanceInfo,
    routeInstanceDataExists,
    urls,
} from '../selectors';

import { Dashboard } from './components';


function mapDispatchToProps(dispatch) {
    return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls, routeInstanceName } = stateProps;
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
