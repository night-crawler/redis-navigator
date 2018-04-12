import { keyViewer } from 'features/KeyViewer/reducer';
import { combineReducers } from 'redux';
import { activeInstanceName } from './activeInstanceName';
import { hasFetched, isFetching } from './fetching';
import { inspections } from './inspections';
import { instances } from './instances';
import { instancesData } from './instancesData';
import { progress } from './progress';
import { urls } from './urls';


export const redisNavigator = combineReducers({
    instances,
    instancesData,
    activeInstanceName,
    hasFetched,
    isFetching,
    inspections,
    urls,
    progress,
    keyViewer,
});

export default redisNavigator;
