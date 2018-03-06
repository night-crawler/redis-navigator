import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadInspections } from '../actions/loadInspections';
import { loadInstances } from '../actions/loadInstances';
import RedisRpc from '../actions/redisRpc';
import { RpcActionCreator } from '../actions/rpc';
import { setActiveInstance } from '../actions/setActiveInstance';
import { createStructuredSelector } from 'reselect';
import DefaultLayout from '../components/DefaultLayout';
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
