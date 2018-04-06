import { internationalizationReducer } from 'features/Internationalization/reducer';
import { reducer as notifications } from 'react-notification-system-redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import redisNavigator from 'reducers';
import { combineReducers } from 'redux';


// Initial routing state
const routeInitialState = {
    location: null,
};


function routeReducer(state = routeInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return {
                ...state,
                location: action.payload,
            };
        default:
            return state;
    }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createRootReducer(injectedReducers) {
    return combineReducers({
        notifications,
        redisNavigator,
        internationalization: internationalizationReducer,
        route: routeReducer,
        ...injectedReducers,
    });
}
