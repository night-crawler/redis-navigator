import { SortedMap } from 'collections/sorted-map';
import { fromPairs } from 'lodash';
import { findFirstDelimiter, splitKey } from './strings';

/**
 myns:1:trash:2:value:16 = 16
 myns:1:trash:2:bla:13 = 16
 myns:1 = 32

 keyMap = {
        keys: {
            myns: {
                value: undefined
                keys: {
                    1: {
                        value: 32,
                        keys: {
                            trash:
                        }
                    }
                }
            }
        }
    }
 */
export function addToSMTree(rootObject, path, value, delimiters = [ '::', ':', '/' ]) {
    const
        pathParts = splitKey(path, delimiters),
        delimiter = findFirstDelimiter(path, delimiters);

    if (rootObject.keyMap === undefined)
        rootObject.keyMap = SortedMap();

    let obj = rootObject;
    for (let pathItem of pathParts) {
        if (!obj.keyMap.has(pathItem))
            obj.keyMap.set(pathItem, {
                keyMap: SortedMap(),
                value: undefined,
            });

        obj = obj.keyMap.get(pathItem);
    }
    obj.value = value;
    return obj;
}


export function dumpSMTree(tree) {
    const newObject = { value: tree.value };
    // newObject.keyMap = newObject.keyMap.keys().map(key => dumpSMTree())
    newObject.keyMap = fromPairs(
        tree.keyMap.entries().map(
            ([ keyName, inner ]) => [ keyName, dumpSMTree(inner) ]
        )
    );
    return newObject;
}
