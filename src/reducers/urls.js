import { fromPairs } from 'lodash';

import { FETCH_ENDPOINTS_SUCCESS, INIT_STORE_WITH_URLS } from '~/features/actions';

import { makeAbsoluteUrl } from '~/utils';


/**
 * Also makes all urls absolute
 */
export const urls = (state = {}, action) => {
  const { payload } = action;

  switch (action.type) {
    case INIT_STORE_WITH_URLS:
      return {
        ...state,
        base: payload.base,
        endpoints: makeAbsoluteUrl(payload.base, payload.endpoints)
      };

    case FETCH_ENDPOINTS_SUCCESS:
      return {
        ...state,
        ...fromPairs(Object.entries(payload).map(
          ([ name, endpoint ]) => [ name, makeAbsoluteUrl(state.base, endpoint) ]
        )),
      };

    default:
      return state;
  }
};
