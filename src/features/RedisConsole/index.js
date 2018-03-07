import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    inspections,
    routeConsoleCommands,
    routeInstanceName,
    routeInstanceRequests,
    routeInstanceResponses,
} from '../selectors';
import {
    appendCallEditor,
    changeCallEditorMethodName,
    changeCallEditorMethodParams,
    removeCallEditor,
    clearCallEditors,
} from './actions';
import RedisConsole from './components';


function mapDispatchToProps(dispatch, ownProps) {
    const { actions = {} } = ownProps;

    return {
        actions: {
            ...actions,
            appendCallEditor: redisInstance => dispatch(appendCallEditor(redisInstance)),
            removeCallEditor: (redisInstance, id) => dispatch(removeCallEditor(redisInstance, id)),
            changeCallEditorMethodName: (redisInstance, methodName, id) =>
                dispatch(changeCallEditorMethodName(redisInstance, methodName, id)),
            changeCallEditorMethodParams: (redisInstance, methodParams, id) =>
                dispatch(changeCallEditorMethodParams(redisInstance, methodParams, id)),
            clearCallEditors: redisInstance => dispatch(clearCallEditors(redisInstance)),
        }
    };
}

export default connect(
    createStructuredSelector({
        routeInstanceName,
        inspections,
        routeInstanceRequests,
        routeInstanceResponses,
        routeConsoleCommands,
    }),
    mapDispatchToProps
)(RedisConsole);
