import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RedisRpc } from '../actions';
import {
    inspections,
    routeConsoleCommands,
    routeInstanceName,
    routeInstanceRequests,
    routeInstanceResponses,
    routeConsoleCommandsToExecute,
    urls,
} from '../selectors';
import {
    appendCallEditor,
    changeCallEditorMethodName,
    changeCallEditorMethodParams,
    removeCallEditor,
    clearCallEditors, bindCallEditorToId,
} from './actions';
import { RedisConsole } from './components';


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        actions: {
            appendCallEditor: redisInstance =>
                dispatch(appendCallEditor(redisInstance)),

            removeCallEditor: (redisInstance, id) =>
                dispatch(removeCallEditor(redisInstance, id)),

            changeCallEditorMethodName: (redisInstance, methodName, id) =>
                dispatch(changeCallEditorMethodName(redisInstance, methodName, id)),

            changeCallEditorMethodParams: (redisInstance, methodParams, id) =>
                dispatch(changeCallEditorMethodParams(redisInstance, methodParams, id)),

            clearCallEditors: redisInstance =>
                dispatch(clearCallEditors(redisInstance)),

            bindCallEditorToId: (redisInstance, key, id) =>
                dispatch(bindCallEditorToId(redisInstance, key, id))
        }
    };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls: { rpcEndpointUrl } } = stateProps;
    const { dispatch } = dispatchProps;

    const rpc = new RedisRpc({ endpoint: rpcEndpointUrl, dispatch });

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            ...dispatchProps.actions,
            batchExecute: (name, ...pairs) => rpc.batchExecute(name, ...pairs),
        },
        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        routeInstanceName,
        inspections,
        routeInstanceRequests,
        routeInstanceResponses,
        routeConsoleCommands,
        routeConsoleCommandsToExecute,
        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(RedisConsole);
