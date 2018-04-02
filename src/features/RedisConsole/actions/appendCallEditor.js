import { uuid4 } from 'utils';

export const APPEND_CALL_EDITOR = 'redisNavigator/ui/console/appendCallEditor';


export const appendCallEditor = ({
    instanceName,
    key = uuid4(),
    color = 'red',
    methodName = null,
    methodParams = null,
    response = null,
    dirty = true,
}) => ({
    type: APPEND_CALL_EDITOR,
    payload: {
        key, color,
        methodName,
        methodParams,
        response,
        dirty,
    },
    meta: { path: instanceName },
});
