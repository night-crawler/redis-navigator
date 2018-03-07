export const REMOVE_CALL_EDITOR = 'redisNavigator/ui/console/removeCallEditor';


export const removeCallEditor = (instanceName, id) => ({
    type: REMOVE_CALL_EDITOR,
    payload: { id },
    meta: { path: instanceName },
});
