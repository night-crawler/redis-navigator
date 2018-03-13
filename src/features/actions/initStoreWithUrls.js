export const INIT_STORE_WITH_URLS = 'redisNavigator/initStoreWithUrls';

export const initStoreWithUrls = urls => ({
    type: INIT_STORE_WITH_URLS,
    payload: urls,
});
