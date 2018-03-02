import { find, every } from 'lodash';
import { createSelector } from 'reselect';


export const redisNavigator = state => state.redisNavigator;
export const props = (state, props) => props;


export const instancesData = createSelector(redisNavigator, redisNavigator => redisNavigator.instancesData || {});
export const activeInstanceName = createSelector(
    redisNavigator, redisNavigator => redisNavigator.activeInstanceName || null);
export const instances = createSelector(redisNavigator, redisNavigator => redisNavigator.instances || []);
export const inspections = createSelector(redisNavigator, redisNavigator => redisNavigator.inspections || {});

// loading
export const hasLoaded = createSelector(redisNavigator, redisNavigator => redisNavigator.hasLoaded);
export const hasLoadedInspections = createSelector(hasLoaded, hasLoaded => hasLoaded.inspections);
export const hasLoadedInstances = createSelector(hasLoaded, hasLoaded => hasLoaded.instances);
export const isReady = createSelector(
    [hasLoadedInspections, hasLoadedInstances],
    (...flags) => every(flags)

);


// match path
export const routeMatch = createSelector(props, props => props.match || {});
export const routeMatchParams = createSelector(routeMatch, match => match.params || {});
export const routeInstanceName = createSelector(routeMatchParams, params => params.instanceName);

// an instance data should be initialized after everything got loaded
// if it isn't so, we're got wrong `routeInstanceName`
export const routeInstanceDataExists = createSelector(
    [instancesData, routeInstanceName],
    (instancesData, routeInstanceName) => instancesData[routeInstanceName] !== undefined
);
export const routeInstanceData = createSelector(
    [instancesData, routeInstanceName],
    (instancesData, routeInstanceName) => instancesData[routeInstanceName] || {}
);
export const routeInstanceInfo = createSelector(routeInstanceData, routeInstanceData => routeInstanceData.info || {});



export const activeInstance = createSelector(
    [instances, activeInstanceName],
    (instances, activeInstanceName) =>
        find(instances, { name: activeInstanceName })
);



