import { LOCATION_CHANGE } from 'react-router-redux';

const routeInitialState = {
  location: null,
};

export function routeReducer(state = routeInitialState, action) {
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
