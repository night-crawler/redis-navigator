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
        },

        isFetching: {
            inspections: false,
            instances: false,
            endpoints: false,
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

        keys: {},
    },
    notifications: [],
};
