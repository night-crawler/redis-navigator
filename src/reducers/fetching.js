import {
  FETCH_ENDPOINTS_START,
  FETCH_ENDPOINTS_SUCCESS,
  FETCH_INSPECTIONS_START, FETCH_INSPECTIONS_SUCCESS, FETCH_INSTANCES_START,
  FETCH_INSTANCES_SUCCESS, SEARCH_KEYS_START, SEARCH_KEYS_SUCCESS
} from '~/features/actions';


export const hasFetched = (state = {}, action) => {
  const updateState = {
    [ FETCH_INSPECTIONS_START ]: { inspections: false },
    [ FETCH_INSPECTIONS_SUCCESS ]: { inspections: true },

    [ FETCH_INSTANCES_START ]: { instances: false },
    [ FETCH_INSTANCES_SUCCESS ]: { instances: true },

    [ FETCH_ENDPOINTS_START ]: { endpoints: false },
    [ FETCH_ENDPOINTS_SUCCESS ]: { endpoints: true },

    [ SEARCH_KEYS_START ]: { searchKeys: false },
    [ SEARCH_KEYS_SUCCESS ]: { searchKeys: true },
  }[ action.type ];

  return updateState === undefined
    ? state
    : { ...state, ...updateState };
};


export const isFetching = (state = {}, action) => {
  const updateState = {
    [ FETCH_INSPECTIONS_START ]: { inspections: true },
    [ FETCH_INSPECTIONS_SUCCESS ]: { inspections: false },

    [ FETCH_INSTANCES_START ]: { instances: true },
    [ FETCH_INSTANCES_SUCCESS ]: { instances: false },

    [ FETCH_ENDPOINTS_START ]: { endpoints: true },
    [ FETCH_ENDPOINTS_SUCCESS ]: { endpoints: false },

    [ SEARCH_KEYS_START ]: { searchKeys: true },
    [ SEARCH_KEYS_SUCCESS ]: { searchKeys: false },
  }[ action.type ];

  return updateState === undefined
    ? state
    : { ...state, ...updateState };
};
