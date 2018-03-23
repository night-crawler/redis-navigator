import { every, filter, find, get } from 'lodash';
import { createSelector } from 'reselect';


export const redisNavigator = state => state.redisNavigator;
export const props = (state, props) => props;


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
 * state.redisNavigator.hasLoaded
 */
export const hasLoaded = createSelector(redisNavigator, redisNavigator => redisNavigator.hasLoaded);


/**
 * state.redisNavigator.hasLoaded.inspections
 */
export const hasLoadedInspections = createSelector(hasLoaded, hasLoaded => hasLoaded.inspections);


/**
 * state.redisNavigator.hasLoaded.instances
 */
export const hasLoadedInstances = createSelector(hasLoaded, hasLoaded => hasLoaded.instances);


export const isReady = createSelector(
    [hasLoadedInspections, hasLoadedInstances],
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
 * state.redisNavigator.instancesData[:instanceName].info.dbsize.result
 */
export const routeInstanceDbSize = createSelector(
    routeInstanceInfo,
    routeInstanceInfo => get(routeInstanceInfo, 'dbsize.result', false)
);


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
 * state.redisNavigator.keys[:instanceName]
 */
export const routeKeys = createSelector(
    [keys, routeInstanceName],
    (keys, routeInstanceName) => keys[routeInstanceName] || {}
);
