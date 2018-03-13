import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    RedisRpc, RpcActionCreator,
    setActiveInstance,
    loadInspections,
    loadInstances,
    initStoreWithUrls,
} from '../actions';
import { createStructuredSelector } from 'reselect';
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

    const rpc = new RedisRpc({ endpoint: rpcEndpointUrl, dispatch });

    return {
        actions: {
            initStoreWithUrls: urls => dispatch(initStoreWithUrls(urls)),

            loadInstances: () => dispatch(loadInstances(statusUrl)),
            loadInfo: name => rpc.loadInfo(name),
            setActiveInstance: name => dispatch(setActiveInstance(name)),
            loadInspections: () => dispatch(loadInspections(inspectionsUrl)),
            batchExecute: (name, ...pairs) => rpc.batchExecute(name, ...pairs),
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
