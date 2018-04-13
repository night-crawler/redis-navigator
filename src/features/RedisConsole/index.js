import { warning } from 'react-notification-system-redux';
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
            warning: ({ title, message, position='tr', autoDismiss=2 }) =>
                dispatch(warning({ title, message, position, autoDismiss })),
        }
    };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls, routeInstanceName } = stateProps;
    const { dispatch } = dispatchProps;

    const rpc = new RedisRpc({
        dispatch,
        instanceName: routeInstanceName,
        endpoint: urls.rpc
    });

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            ...dispatchProps.actions,
            batchExecute: rpc.batchExecute,
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
