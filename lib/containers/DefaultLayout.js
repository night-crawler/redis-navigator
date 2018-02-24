import { connect } from 'react-redux';
import { loadRedisInstances } from '../actions/loadRedisInstances';
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
    const { rpcEndpoint, statusUrl } = ownProps;
    const rpc = new RedisRpc({dispatch, endpoint: rpcEndpoint});

    return {
        actions: {
            handleLoadRedisInstances: () => dispatch(loadRedisInstances(statusUrl)),
            handleLoadRedisInfo: name => rpc.loadInfo(name),
            handleSetActiveInstance: name => dispatch(setActiveInstance(name)),
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
