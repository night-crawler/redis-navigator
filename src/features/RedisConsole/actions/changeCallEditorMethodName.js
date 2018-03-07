export const CHANGE_CALL_EDITOR_METHOD_NAME = 'redisNavigator/ui/console/changeCallEditorMethodName';


export const changeCallEditorMethodName = (instanceName, methodName, id) => ({
    type: CHANGE_CALL_EDITOR_METHOD_NAME,
    payload: { methodName, id },
    meta: { path: instanceName },
});
