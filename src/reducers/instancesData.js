import produce from 'immer/dist/immer';
import { findIndex, isBoolean } from 'lodash';

import {
  FETCH_INSTANCES_SUCCESS,
  REDIS_RPC_FETCH_INFO_SUCCESS,
  RPC_BATCH_START,
  RPC_BATCH_SUCCESS
} from '~/features/actions';

import {
  APPEND_CALL_EDITOR,
  BIND_CALL_EDITOR_TO_ID, CHANGE_CALL_EDITOR_METHOD_NAME, CHANGE_CALL_EDITOR_METHOD_PARAMS, CLEAR_CALL_EDITORS,
  REMOVE_CALL_EDITOR,
  TOGGLE_IMPORT_DIALOG_VISIBLE
} from '~/features/RedisConsole/actions';

import { mapRpcRequestsById, mapRpcResponsesById, prepareServerInfo } from '~/utils';


export const instancesData = (state = {}, action) => produce(state, draft => {
  const { payload, meta } = action;

  const draftRedis = meta ? draft[ meta.path ] : null;
  const redis = meta ? state[ meta.path ] : null;

  // index of call editor's actions
  const cmdIndex = redis && payload && payload.key
    ? findIndex(redis.consoleCommands, { key: payload.key })
    : null;

  switch (action.type) {
    case FETCH_INSTANCES_SUCCESS:
      payload.forEach(({ name }) => {
        if (!state[ name ])
          draft[ name ] = {
            requests: {},
            responses: {},
            info: {},
            consoleCommands: [],
            importDialogIsVisible: false,
          };
      });
      break;

    case RPC_BATCH_START:
      draftRedis.requests = {
        ...state[ meta.path ].requests,
        ...mapRpcRequestsById(meta.request)
      };
      break;

    case RPC_BATCH_SUCCESS:
      draftRedis.responses = {
        ...redis.responses,
        ...mapRpcResponsesById(payload)
      };
      break;

    case REDIS_RPC_FETCH_INFO_SUCCESS:
      draftRedis.info = prepareServerInfo(meta.request, payload);
      break;

    case APPEND_CALL_EDITOR:
      draftRedis.consoleCommands.push(payload);
      break;

    case REMOVE_CALL_EDITOR:
      draftRedis.consoleCommands.splice(cmdIndex, 1);
      break;

    case CHANGE_CALL_EDITOR_METHOD_NAME:
      draftRedis
        .consoleCommands[ cmdIndex ]
        .methodName = payload.methodName;
      draftRedis
        .consoleCommands[ cmdIndex ]
        .dirty = true;
      break;

    case CHANGE_CALL_EDITOR_METHOD_PARAMS:
      draftRedis
        .consoleCommands[ cmdIndex ]
        .methodParams = payload.methodParams;
      draftRedis.consoleCommands[ cmdIndex ].dirty = true;
      break;

    case CLEAR_CALL_EDITORS:
      draftRedis
        .consoleCommands = [];
      break;

    case BIND_CALL_EDITOR_TO_ID:
      draftRedis
        .consoleCommands[ cmdIndex ]
        .response = redis.responses[ payload.requestId ];
      draftRedis
        .consoleCommands[ cmdIndex ]
        .dirty = false;
      break;

    case TOGGLE_IMPORT_DIALOG_VISIBLE:
      draftRedis.importDialogIsVisible =
                isBoolean(payload.isVisible)
                  ? payload.isVisible
                  : !redis.importDialogIsVisible;
      break;
  }
});
