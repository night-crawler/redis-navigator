export default {
    redisNavigator: {
        instances: [],
        activeInstanceName: '',
        instancesData: {},
        inspections: {},

        hasFetched: {
            inspections: false,
            instances: false,
            endpoints: false,
            searchKeys: false,
        },

        isFetching: {
            inspections: false,
            instances: false,
            endpoints: false,
            searchKeys: false,
        },

        urls: {
            base: '',
            endpoints: null,
            rpc: null,
            status: null,
            inspections: null,
        },

        progress: {
            percent: 0,
            isVisible: false,
            count: 1,
        },

        keySearch: {
            activeKey: '',
        },
    },
    notifications: [],
    internationalization: {
        activeLocale: 'en',
        data: {},
    },
};
