import { DEFAULT_SEARCH_KEYS_PARAMS } from 'constants';

import { warning, error, success } from 'react-notification-system-redux';
import { flatten, map, pickBy } from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import { makeAbsoluteUrl, PageHelper, serializeQuery } from '~/utils';

import {
  hasFetchedSearchKeys,
  isFetchingSearchKeys,
  routeInstanceName,
  routeInstanceSearchUrl,
  routeKeys,
  shouldFetchSearchKeys,
  urls,
} from '~/features/selectors';

import { fetchKeysPage, RedisRpc, searchKeys } from '~/features/actions';

import { setSelectedKey } from './actions';
import { KeyViewer } from './components';
import {
  keyTypes,
  locationSearchParamsWithDefaults,
  searchEndpoints,
  searchPageUrlPrefix,
  searchInfo,
  searchPagesMap,
  selectedKey,
  keyInfo,
  keyData,
  selectedKeyType,
  selectedKeyData,
  selectedKeyInfo,
  selectedKeyUpdateResults,
} from './selectors';




function mapDispatchToProps(dispatch) {
  return { dispatch };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
  const {
    urls,
    routeInstanceSearchUrl,
    routeInstanceName,
    searchPageUrlPrefix,
  } = stateProps;

  const { dispatch } = dispatchProps;

  const rpc = new RedisRpc({
    dispatch,
    instanceName: routeInstanceName,
    endpoint: urls.rpc,
  });

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    actions: {
      searchKeys: ({ pattern, scanCount, sortKeys, ttlSeconds }) => {
        const searchParams = {
          ...DEFAULT_SEARCH_KEYS_PARAMS,
          ...pickBy({ pattern, sortKeys, scanCount, ttlSeconds }, (val) => val !== undefined)
        };

        dispatch(push({
          search: serializeQuery(searchParams, DEFAULT_SEARCH_KEYS_PARAMS)
        }));

        return dispatch(searchKeys({
          url: makeAbsoluteUrl(urls.base, routeInstanceSearchUrl),
          ...searchParams
        }));
      },

      setSelectedKey: (key) => dispatch(setSelectedKey(key)),

      fetchKeyInfo: rpc.fetchKeyInfo,
      fetchKeyData: rpc.fetchKeyData,

      updateKeyDataAndReload: (key, type, prevData, nextData, pexpire) => {
        const promise = rpc.updateKeyData(key, type, prevData, nextData, pexpire);
        return promise.then(() => {
          rpc.fetchInfo(key);
          rpc.fetchKeyData(key, type);
        });
      },

      fetchKeyRangeWithTypes: ({ startIndex, stopIndex, perPage }) => {
        const pageHelper = new PageHelper(undefined, perPage);

        return Promise
          .all(
            pageHelper
              .getPageRange(startIndex, stopIndex)
              .map(pageNum => dispatch(fetchKeysPage(searchPageUrlPrefix, pageNum, perPage)))
          )
          .then(data =>
            rpc.fetchKeyTypes(flatten(map(data, 'payload.results')))
          );
      },
    },
    notifications: {
      warning: ({ title, message, position='tr', autoDismiss=2 }) =>
        dispatch(warning({ title, message, position, autoDismiss })),
      error: ({ title, message, position='tr', autoDismiss=2 }) =>
        dispatch(error({ title, message, position, autoDismiss })),
      success: ({ title, message, position='tr', autoDismiss=2 }) =>
        dispatch(success({ title, message, position, autoDismiss })),
    },
    dispatch: undefined,
  };
}


export default connect(
  createStructuredSelector({
    selectedKey,
    routeInstanceName,
    routeInstanceSearchUrl,
    routeKeys,
    urls,
    searchPagesMap,
    searchEndpoints,
    searchInfo,
    searchPageUrlPrefix,
    shouldFetchSearchKeys,
    hasFetchedSearchKeys,
    isFetchingSearchKeys,
    locationSearchParams: locationSearchParamsWithDefaults,
    keyTypes,
    keyInfo,
    keyData,
    selectedKeyType,
    selectedKeyData,
    selectedKeyInfo,
    selectedKeyUpdateResults,
  }),
  mapDispatchToProps,
  mergeProps
)(KeyViewer);
