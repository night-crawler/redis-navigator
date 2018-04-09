export const SET_SELECTED_KEY = 'redisNavigator/ui/setSelectedKey';

export const setSelectedKey = key => ({
    type: SET_SELECTED_KEY,
    payload: { key },
});
