import { connect } from 'react-redux';
import { loadRedisInstances } from '../actions/loadRedisInstances';
import RedisRpc from '../actions/redisRpc';

import DefaultLayout from '../components/DefaultLayout';


function mapStateToProps(state) {
    return {
        instances: state.redisNavigator,
    };
}


function mapDispatchToProps(dispatch, ownProps) {
    const { rpcEndpoint, statusUrl } = ownProps;
    const rpc = new RedisRpc({dispatch, endpoint: rpcEndpoint});

    return {
        actions: {
            handleLoadRedisInstances: () => dispatch(loadRedisInstances(statusUrl)),
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
