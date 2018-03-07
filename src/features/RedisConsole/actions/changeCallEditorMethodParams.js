export const CHANGE_CALL_EDITOR_METHOD_PARAMS = 'redisNavigator/ui/console/changeCallEditorMethodParams';


export const changeCallEditorMethodParams = (instanceName, methodParams, id) => ({
    type: CHANGE_CALL_EDITOR_METHOD_PARAMS,
    payload: { methodParams, id },
    meta: { path: instanceName },
});
