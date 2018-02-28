import { createSelector } from 'reselect';
import { find } from 'lodash';


export const redisNavigator = state => state.redisNavigator;
export const props = (state, props) => props;


export const instancesData = createSelector(redisNavigator, redisNavigator => redisNavigator.instancesData || {});
export const activeInstanceName = createSelector(
    redisNavigator, redisNavigator => redisNavigator.activeInstanceName || null);
export const instances = createSelector(redisNavigator, redisNavigator => redisNavigator.instances || []);
export const inspections = createSelector(redisNavigator, redisNavigator => redisNavigator.inspections || {});


// match path
export const routeMatch = createSelector(props, props => props.match || {});
export const routeMatchParams = createSelector(routeMatch, match => match.params || {});
export const routeInstanceName = createSelector(routeMatchParams, params => params.instanceName);
export const routeInstanceData = createSelector(
    [instancesData, routeInstanceName],
    (instancesData, routeInstanceName) => instancesData[routeInstanceName]
);
export const routeInstanceInfo = createSelector(routeInstanceData, instanceData => instanceData.info || {});


export const activeInstance = createSelector(
    [instances, activeInstanceName],
    (instances, activeInstanceName) =>
        find(instances, { name: activeInstanceName })
);



