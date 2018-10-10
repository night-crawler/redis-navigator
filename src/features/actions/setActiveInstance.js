export const SET_ACTIVE_INSTANCE = 'redisNavigator/ui/setActiveInstance';

export const setActiveInstance = name => ({
  type: SET_ACTIVE_INSTANCE,
  payload: { name },
});
