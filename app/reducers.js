/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { LOCATION_CHANGE } from 'react-router-redux';
import { combineReducers } from 'redux';
import redisNavigator from '../lib/reducer';

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
export default function createReducer(injectedReducers) {
    return combineReducers({
        route: routeReducer,
        redisNavigator: redisNavigator,
        ...injectedReducers,
    });
}
