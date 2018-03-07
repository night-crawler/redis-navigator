import { uuid4 } from '../../../utils';

export const APPEND_METHOD_CALL_EDITOR = 'redisNavigator/ui/console/appendMethodCallEditor';


export const appendMethodCallEditor = (instanceName, key=uuid4()) => ({
    type: APPEND_METHOD_CALL_EDITOR,
    payload: {
        key: key,
        methodName: null,
        callParams: null,
        result: null,
    },
    meta: { path: instanceName },
});
