export const CLEAR_CALL_EDITORS = 'redisNavigator/ui/console/clearCallEditors';


export const clearCallEditors = (instanceName) => ({
  type: CLEAR_CALL_EDITORS,
  payload: {},
  meta: { path: instanceName },
});
