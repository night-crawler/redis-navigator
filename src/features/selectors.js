import { every, filter, find } from 'lodash';
import { createSelector } from 'reselect';
import { deserializeQuery } from 'utils';


export const redisNavigator = state => state.redisNavigator;
export const route = state => state.route;
export const props = (state, props) => props;


/**
 * state.route.location
 */
export const location = createSelector(route, route => route.location || {});


/**
 * state.route.location.search
 */
export const locationSearch = createSelector(location, location => location.search || '');


/**
 * URLSearchParams(state.route.location.search)
 */
export const locationSearchParams = createSelector(
    locationSearch,
    locationSearch => deserializeQuery(locationSearch)
);


/**
 * state.redisNavigator.urls
 */
export const urls = createSelector(redisNavigator, redisNavigator => redisNavigator.urls || {});


/**
 * state.redisNavigator.instancesData
 */
export const instancesData = createSelector(redisNavigator, redisNavigator => redisNavigator.instancesData || {});


/**
 * state.redisNavigator.activeInstanceName
 */
export const activeInstanceName = createSelector(
    redisNavigator, redisNavigator => redisNavigator.activeInstanceName || null);

/**
 * state.redisNavigator.instances
 */
export const instances = createSelector(redisNavigator, redisNavigator => redisNavigator.instances || []);


/**
 * state.redisNavigator.inspections
 */
export const inspections = createSelector(redisNavigator, redisNavigator => redisNavigator.inspections || {});


/**
 * state.redisNavigator.keys
 */
export const keys = createSelector(redisNavigator, redisNavigator => redisNavigator.keys || {});


/**
 * state.redisNavigator.keyViewer
 */
export const keyViewer = createSelector(redisNavigator, redisNavigator => redisNavigator.keyViewer || {});



/**
 * state.redisNavigator.progress
 */
export const progress = createSelector(redisNavigator, redisNavigator => redisNavigator.progress || {});


/**
 * state.redisNavigator.progress.percent
 */
export const progressPercent = createSelector(progress, progress => progress.percent || 0);


/**
 * state.redisNavigator.progress.isVisible
 */
export const progressIsVisible = createSelector(progress, progress => progress.isVisible || false);


/**
 * state.redisNavigator.hasFetched
 */
export const hasFetched = createSelector(redisNavigator, redisNavigator => redisNavigator.hasFetched);


/**
 * state.redisNavigator.isFetching
 */
export const isFetching = createSelector(redisNavigator, redisNavigator => redisNavigator.isFetching);


/**
 * state.redisNavigator.hasFetched.inspections
 */
export const hasFetchedSearchKeys = createSelector(hasFetched, hasFetched => hasFetched.searchKeys);


/**
 * state.redisNavigator.isFetching.inspections
 */
export const isFetchingSearchKeys = createSelector(isFetching, isFetching => isFetching.searchKeys);


/**
 * state.redisNavigator.hasFetched.inspections
 */
export const hasFetchedInspections = createSelector(hasFetched, hasFetched => hasFetched.inspections);


/**
 * state.redisNavigator.isFetching.inspections
 */
export const isFetchingInspections = createSelector(isFetching, isFetching => isFetching.inspections);


/**
 * state.redisNavigator.hasFetched.instances
 */
export const hasFetchedInstances = createSelector(hasFetched, hasFetched => hasFetched.instances);


/**
 * state.redisNavigator.isFetching.instances
 */
export const isFetchingInstances = createSelector(isFetching, isFetching => isFetching.instances);



/**
 * state.redisNavigator.hasFetched.endpoints
 */
export const hasFetchedEndpoints = createSelector(hasFetched, hasFetched => hasFetched.endpoints);


/**
 * state.redisNavigator.isFetching.endpoints
 */
export const isFetchingEndpoints = createSelector(isFetching, isFetching => isFetching.endpoints);



export const isReady = createSelector(
    [hasFetchedInspections, hasFetchedInstances, hasFetchedEndpoints],
    (...flags) => every(flags)
);

// ============

/**
 * props.match
 */
export const routeMatch = createSelector(props, props => props.match || {});


/**
 * props.match.params
 */
export const routeMatchParams = createSelector(routeMatch, match => match.params || {});


/**
 * props.match.params.instanceName
 */
export const routeInstanceName = createSelector(routeMatchParams, params => params.instanceName);


/**
 * ``instanceData`` should be initialized after everything got loaded.
 * If it isn't so, we're got wrong `routeInstanceName`
 */
export const routeInstanceDataExists = createSelector(
    [instancesData, routeInstanceName],
    (instancesData, routeInstanceName) => instancesData[routeInstanceName] !== undefined
);


/**
 * state.redisNavigator.instancesData[:instanceName]
 */
export const routeInstanceData = createSelector(
    [instancesData, routeInstanceName],
    (instancesData, routeInstanceName) => instancesData[routeInstanceName] || {}
);


/**
 * state.redisNavigator.instancesData[:instanceName].info
 */
export const routeInstanceInfo = createSelector(routeInstanceData, routeInstanceData => routeInstanceData.info || {});


/**
 * state.redisNavigator.instancesData[:instanceName].requests
 */
export const routeInstanceRequests = createSelector(
    routeInstanceData,
    routeInstanceData => routeInstanceData.requests
);


/**
 * state.redisNavigator.instancesData[:instanceName].responses
 */
export const routeInstanceResponses = createSelector(
    routeInstanceData,
    routeInstanceData => routeInstanceData.responses
);


/**
 * state.redisNavigator.instancesData[:instanceName].consoleCommands
 */
export const routeConsoleCommands = createSelector(
    routeInstanceData,
    routeInstanceData => routeInstanceData.consoleCommands
);


/**
 * state.redisNavigator.instancesData[:instanceName].importDialogIsVisible
 */
export const routeInstanceImportDialogIsVisible = createSelector(
    routeInstanceData,
    routeInstanceData => routeInstanceData.importDialogIsVisible
);


/**
 * state.redisNavigator.instancesData[:instanceName].consoleCommands
 * WHERE dirty === true AND cmd.methodName is not falsy
 */
export const routeConsoleCommandsToExecute = createSelector(
    routeConsoleCommands,
    routeConsoleCommands => filter(
        routeConsoleCommands,
        cmd => cmd.dirty === true && cmd.methodName
    )
);


export const activeInstance = createSelector(
    [instances, activeInstanceName],
    (instances, activeInstanceName) =>
        find(instances, { name: activeInstanceName })
);


/**
 * state.redisNavigator.instances[:instanceName]
 */
export const routeInstance = createSelector(
    [instances, routeInstanceName],
    (instances, routeInstanceName) =>
        find(instances, { name: routeInstanceName })
);


/**
 * state.redisNavigator.instances[:instanceName].search_url
 */
export const routeInstanceSearchUrl = createSelector(
    routeInstance,
    routeInstance => routeInstance.search_url
);


/**
 * state.redisNavigator.keys[:instanceName]
 */
export const routeKeys = createSelector(
    [keys, routeInstanceName],
    (keys, routeInstanceName) => keys[routeInstanceName] || {}
);


export const shouldFetchEndpoints = createSelector(
    [hasFetchedEndpoints, isFetchingEndpoints, urls],
    (hasFetchedEndpoints, isFetchingEndpoints, urls) =>
        urls.endpoints && !hasFetchedEndpoints && !isFetchingEndpoints
);


export const shouldFetchInstances = createSelector(
    [hasFetchedInstances, isFetchingInstances, hasFetchedEndpoints],
    (hasFetchedInstances, isFetchingInstances, hasFetchedEndpoints) =>
        hasFetchedEndpoints && !hasFetchedInstances && !isFetchingInstances
);


export const shouldFetchInspections = createSelector(
    [hasFetchedInspections, isFetchingInspections, hasFetchedEndpoints],
    (hasFetchedInspections, isFetchingInspections, hasFetchedEndpoints) =>
        hasFetchedEndpoints && !hasFetchedInspections && !isFetchingInspections
);


export const shouldFetchSearchKeys = createSelector(
    [hasFetchedSearchKeys, isFetchingSearchKeys],
    (hasFetchedSearchKeys, isFetchingSearchKeys) =>
        !hasFetchedSearchKeys && !isFetchingSearchKeys
);
