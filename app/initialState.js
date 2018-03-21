export default {
    redisNavigator: {
        instances: [],
        activeInstanceName: '',
        instancesData: {},
        inspections: {},

        hasLoaded: {
            inspections: false,
            instances: false,
        },

        urls: {
            rpcEndpointUrl: null,
            statusUrl: null,
            inspectionsUrl: null,
        },

        progress: {
            percent: 0,
            isVisible: false,
        }
    },
    notifications: [],
};
