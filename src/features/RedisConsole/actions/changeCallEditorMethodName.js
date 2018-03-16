export const CHANGE_CALL_EDITOR_METHOD_NAME = 'redisNavigator/ui/console/changeCallEditorMethodName';


export const changeCallEditorMethodName = (instanceName, methodName, key) => ({
    type: CHANGE_CALL_EDITOR_METHOD_NAME,
    payload: {
        methodName,
        key
    },
    meta: { path: instanceName },
});
