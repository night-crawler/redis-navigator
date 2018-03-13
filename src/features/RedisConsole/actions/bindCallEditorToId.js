export const BIND_CALL_EDITOR_TO_ID = 'redisNavigator/ui/console/bindCallEditorToId';


export const bindCallEditorToId = (instanceName, key, requestId) => ({
    type: BIND_CALL_EDITOR_TO_ID,
    payload: { key, requestId },
    meta: { path: instanceName },
});
