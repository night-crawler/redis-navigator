import { success, warning } from 'react-notification-system-redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RedisRpc } from '../actions';
import {
    inspections,
    routeConsoleCommands,
    routeConsoleCommandsToExecute,
    routeInstanceName,
    routeInstanceRequests,
    routeInstanceResponses,
    routeInstanceImportDialogIsVisible,
    urls,
} from '../selectors';
import {
    appendCallEditor,
    bindCallEditorToId,
    changeCallEditorMethodName,
    changeCallEditorMethodParams,
    clearCallEditors,
    removeCallEditor,
    toggleImportDialogVisible,
} from './actions';
import { RedisConsole } from './components';


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        actions: {
            appendCallEditor: ({ ...kwargs }) =>
                dispatch(appendCallEditor({ ...kwargs })),

            removeCallEditor: (redisInstance, key) =>
                dispatch(removeCallEditor(redisInstance, key)),

            changeCallEditorMethodName: (redisInstance, methodName, key) =>
                dispatch(changeCallEditorMethodName(redisInstance, methodName, key)),

            changeCallEditorMethodParams: (redisInstance, methodParams, key) =>
                dispatch(changeCallEditorMethodParams(redisInstance, methodParams, key)),

            clearCallEditors: redisInstance =>
                dispatch(clearCallEditors(redisInstance)),

            bindCallEditorToId: (redisInstance, key, id) =>
                dispatch(bindCallEditorToId(redisInstance, key, id)),

            toggleImportDialogVisible: (redisInstance, isVisible) =>
                dispatch(toggleImportDialogVisible(redisInstance, isVisible)),
        },
        notifications: {
            nothingToExecute: () => dispatch(warning({
                title: 'Nothing to execute here',
                message: 'Change something and try again',
                position: 'tr',
                autoDismiss: 2,
            })),
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
        routeInstanceImportDialogIsVisible,
        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(RedisConsole);
