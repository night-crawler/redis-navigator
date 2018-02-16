import { connect } from 'react-redux';
import { loadRedisInstances } from '../actions/loadRedisInstances';
import { RpcRequestActionCreator } from '../actions/rpc';


import DefaultLayout from '../components/DefaultLayout';

function mapStateToProps(state) {
    return {
        instances: state.redisNavigator,
    };
}


function mapDispatchToProps(dispatch) {
    const rpc = RpcRequestActionCreator();
    return {
        actions: {
            loadRedisInstances: (url) => dispatch(loadRedisInstances(url)),
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
