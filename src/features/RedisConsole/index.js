import { connect } from 'react-redux';
import { appendMethodCallEditor } from './actions';
import RedisConsole from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    inspections,
    routeInstanceRequests,
    routeInstanceResponses,
} from '../selectors';


function mapDispatchToProps(dispatch, ownProps) {
    const { actions = {} } = ownProps;

    return {
        actions: {
            ...actions,
            appendMethodCallEditor: redisInstance => dispatch(appendMethodCallEditor(redisInstance))
        }
    };
}

export default connect(
    createStructuredSelector({
        routeInstanceName,
        inspections,
        routeInstanceRequests,
        routeInstanceResponses,
    }),
    mapDispatchToProps
)(RedisConsole);
