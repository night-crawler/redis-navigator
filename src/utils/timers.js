import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';


export class Timeout {
    constructor(setFn, clearFn) {
        this._timers = {};
        this._setFn = setFn;
        this._clearFn = clearFn;
    }

    add = ({ callback, timeout = 1000, name = null }) => {
        if (!name || !isString(name))
            throw new Error(`You must specify a valid name name for timer, got ${typeof name}: ${name}`);
        if (!callback || !isFunction(callback))
            throw new Error(`You must specify a valid callback, got ${typeof callback}: ${callback}`);

        this.remove(name);
        const timerId = this._setFn(callback, timeout);
        this._timers[name] = timerId;

        return timerId;
    };

    remove = (name) => {
        if (!name || !isString(name))
            throw new Error(`You must specify a valid name name for timer, got ${typeof name}: ${name}`);
        
        const timerId = this._timers[name];
        if (!timerId)
            return;
        
        this._clearFn(timerId);
    }
}

// cannot just pass `setTimeout`, get ``Illegal invocation``
export const Timeouts = new Timeout(
    (...args) => window.setTimeout(...args),
    (...args) => window.clearTimeout(args)
);
export const Intervals = new Timeout(
    (...args) => window.setInterval(...args),
    (...args) => window.clearInterval(...args)
);
