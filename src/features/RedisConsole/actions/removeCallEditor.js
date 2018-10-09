export const REMOVE_CALL_EDITOR = 'redisNavigator/ui/console/removeCallEditor';


export const removeCallEditor = (instanceName, key) => ({
  type: REMOVE_CALL_EDITOR,
  payload: { key },
  meta: { path: instanceName },
});
