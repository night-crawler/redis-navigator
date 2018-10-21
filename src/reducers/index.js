import { reducer as notifications } from 'react-notification-system-redux';
import { combineReducers } from 'redux';

import { routeReducer } from './routeReducer';
import { redisNavigator } from './redisNavigatorReducer';

import { internationalizationReducer } from '~/features/Internationalization/reducer';


export default function createRootReducer(injectedReducers) {
  return combineReducers({
    notifications,
    redisNavigator,
    internationalization: internationalizationReducer,
    route: routeReducer,
    ...injectedReducers,
  });
}
