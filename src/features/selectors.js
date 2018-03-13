import { find, every, filter } from 'lodash';
import { createSelector } from 'reselect';


export const redisNavigator = state => state.redisNavigator;
export const props = (state, props) => props;

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


export const routeConsoleCommandsToExecute = createSelector(
    routeConsoleCommands,
    routeConsoleCommands => filter(
        routeConsoleCommands,
        cmd => cmd.result === null && cmd.methodName
    )
);


export const activeInstance = createSelector(
    [instances, activeInstanceName],
    (instances, activeInstanceName) =>
        find(instances, { name: activeInstanceName })
);
