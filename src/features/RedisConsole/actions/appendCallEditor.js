import { uuid4 } from '../../../utils';

export const APPEND_CALL_EDITOR = 'redisNavigator/ui/console/appendCallEditor';


export const appendCallEditor = (instanceName, key=uuid4()) => ({
    type: APPEND_CALL_EDITOR,
    payload: {
        key: key,
        methodName: null,
        methodParams: null,
        result: null,
    },
    meta: { path: instanceName },
});
