import { connect } from 'react-redux';
import { loadInspections } from '../actions/loadInspections';
import { loadInstances } from '../actions/loadInstances';
import RedisRpc from '../actions/redisRpc';
import { setActiveInstance } from '../actions/setActiveInstance';
import { createStructuredSelector } from 'reselect';
import DefaultLayout from '../components/DefaultLayout';
import {
    instances,
    activeInstanceName,
    instancesData,
    inspections,
    activeInstance,
} from '../selectors';


function mapDispatchToProps(dispatch, ownProps) {
    const { rpcEndpointUrl, statusUrl, inspectionsUrl } = ownProps;
    const rpc = new RedisRpc({ dispatch, endpoint: rpcEndpointUrl });

    return {
        actions: {
            handleLoadInstances: () => dispatch(loadInstances(statusUrl)),
            handleLoadInfo: name => rpc.loadInfo(name),
            handleSetActiveInstance: name => dispatch(setActiveInstance(name)),
            handleLoadInspections: () => dispatch(loadInspections(inspectionsUrl)),
        }
    };
}


export default connect(
    createStructuredSelector({
        instances,
        activeInstanceName,
        instancesData,
        inspections,
        activeInstance,
    }),
    mapDispatchToProps
)(DefaultLayout);
