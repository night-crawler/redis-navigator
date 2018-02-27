import { connect } from 'react-redux';
import { loadInspections } from '../actions/loadInspections';
import { loadInstances } from '../actions/loadInstances';
import RedisRpc from '../actions/redisRpc';
import { setActiveInstance } from '../actions/setActiveInstance';

import DefaultLayout from '../components/DefaultLayout';


function mapStateToProps(state) {
    const { redisNavigator } = state;
    return {
        instances: redisNavigator.instances,
        activeInstance: redisNavigator.activeInstance,
        instancesData: redisNavigator.instancesData,
    };
}


function mapDispatchToProps(dispatch, ownProps) {
    const { rpcEndpointUrl, statusUrl, inspectionsUrl } = ownProps;
    const rpc = new RedisRpc({dispatch, endpoint: rpcEndpointUrl});

    return {
        actions: {
            handleLoadInstances: () => dispatch(loadInstances(statusUrl)),
            handleLoadInfo: name => rpc.loadInfo(name),
            handleSetActiveInstance: name => dispatch(setActiveInstance(name)),
            handleLoadInspections: () => dispatch(loadInspections(inspectionsUrl)),
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
