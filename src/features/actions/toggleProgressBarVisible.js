export const TOGGLE_PROGRESS_BAR_VISIBLE = 'redisNavigator/ui/toggleProgressBarVisible';


export const toggleProgressBarVisible = (isVisible) => ({
    type: TOGGLE_PROGRESS_BAR_VISIBLE,
    payload: { isVisible },
});
