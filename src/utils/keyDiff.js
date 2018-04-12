import { difference, differenceWith, flatten, isEqual, isEmpty, reverse, isString } from 'lodash';


const DIFF_FN_MAP = {
    string: keyDiffString,
    list: keyDiffList,
    set: keyDiffSet,
    zset: keyDiffZSet,
    hash: keyDiffHash,
};


export function keyDiff(key, type, prevData, nextData, pexpire) {
    if (!isString(key))
        throw new Error(`Key ${key} must be a string but got ${typeof key}`);

    const fn = DIFF_FN_MAP[type];

    if (fn === undefined)
        throw new Error(`Unknown type ${type} for key ${key}`);

    if (isEqual(prevData, nextData))
        throw new Error(`Previous data and next data are equal: ${nextData}`);

    const rpcCommands = [
        [ 'multi_exec' ],
        ...fn(key, prevData, nextData),
    ];

    if (+pexpire > 0)
        rpcCommands.push([ 'pexpire', { key, timeout: pexpire } ]);

    return rpcCommands;
}


export function keyDiffString(key, prevData, nextData) {
    return [
        [ 'set', { key, value: nextData } ]
    ];
}


export function keyDiffSet(key, prevData, nextData) {
    const
        removedMembers = difference(prevData, nextData),
        addedMembers = difference(nextData, prevData),
        batch = [];

    !isEmpty(removedMembers) && batch.push(
        [ 'srem', { key, members: removedMembers } ]
    );
    !isEmpty(addedMembers) && batch.push(
        [ 'sadd', { key, members: addedMembers } ]
    );

    return batch;
}


export function keyDiffList(key, prevData, nextData) {
    // diff is too complicated since redis cannot insert a value by index
    return [
        [ 'delete', { key } ],
        [ 'rpush', { key, values: nextData } ]
    ];
}


export function keyDiffZSet(key, prevData, nextData) {
    const
        removedPairs = differenceWith(prevData, nextData, isEqual),
        addedPairs = differenceWith(nextData, prevData, isEqual),
        batch = [];

    !isEmpty(removedPairs) && batch.push(
        [ 'zrem', { key, members: removedPairs.map(([ value, ]) => value) } ]
    );
    !isEmpty(addedPairs) && batch.push(
        [ 'zadd', { key, pairs: flatten(addedPairs.map(pair => reverse(pair))) } ]
    );

    return batch;
}


export function keyDiffHash(key, prevData, nextData) {
    const
        deleteFields = [],
        updateFields = {},
        batch = [];

    for (let [ field, value ] of Object.entries(prevData)) {
        if (nextData[field] === undefined) {
            deleteFields.push(field);
        } else if (nextData[field] !== value) {
            updateFields[field] = value;
        }
    }

    for (let [ field, value ] of Object.entries(nextData)) {
        if (prevData[field] === undefined || prevData[field] !== value) {
            updateFields[field] = value;
        }
    }

    !isEmpty(deleteFields) && batch.push(
        [ 'hdel', { key, fields: deleteFields } ]
    );

    !isEmpty(updateFields) && batch.push(
        [ 'hmset_dict', { key, kwargs: updateFields } ]
    );

    return batch;
}
