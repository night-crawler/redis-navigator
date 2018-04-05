export const SET_ACTIVE_KEY = 'redisNavigator/ui/setActiveKey';

export const setActiveKey = key => ({
    type: SET_ACTIVE_KEY,
    payload: { key },
});
