import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    RedisRpc, RpcActionCreator,
    setActiveInstance,
    loadInspections,
    loadInstances
} from '../actions';
import { createStructuredSelector } from 'reselect';
import { initStoreWithUrls } from './actions';
import DefaultLayout from './components';
import {
    instances,
    activeInstanceName,
    instancesData,
    inspections,
    activeInstance,
    isReady,
} from '../selectors';


function mapDispatchToProps(dispatch, ownProps) {
    const { rpcEndpointUrl, statusUrl, inspectionsUrl } = ownProps;

    const rpcActionCreator = new RpcActionCreator({ endpoint: rpcEndpointUrl });
    const rpc = new RedisRpc({ dispatch, rpcActionCreator });

    return {
        actions: {
            handleInitStoreWithUrls: urls => dispatch(initStoreWithUrls(urls)),

            handleLoadInstances: () => dispatch(loadInstances(statusUrl)),
            handleLoadInfo: name => rpc.loadInfo(name),
            handleSetActiveInstance: name => dispatch(setActiveInstance(name)),
            handleLoadInspections: () => dispatch(loadInspections(inspectionsUrl)),
            handleBatchExecute: (name, ...pairs) => rpc.batchExecute(name, ...pairs),
        }
    };
}


export default withRouter(connect(
    createStructuredSelector({
        instances,
        activeInstanceName,
        instancesData,
        inspections,
        activeInstance,
        isReady,
    }),
    mapDispatchToProps
)(DefaultLayout));
