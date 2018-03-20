import {
    checkCommandShapeValid,
    checkCommandsValid,
    cleanMethodDoc,
    methodParameterToSingleValue,
    parametersToJson,
    reprMethodDoc
} from './utils';


describe('RedisConsole.utils', () => {
    it('cleanMethodDoc', () => {
        const doc =
            'Count the number of members in a sorted set between a given\n        lexicographical range.\n\n      ' +
            ':raises TypeError: if min is not bytes\n        :raises TypeError: if max is not bytes\n        ';
        const cleanDoc =
            'Count the number of members in a sorted set between a given\n' +
            'lexicographical range.\n' +
            ':raises TypeError: if min is not bytes\n' +
            ':raises TypeError: if max is not bytes';

        expect(cleanMethodDoc(doc)).toEqual(cleanDoc);
    });
    it('reprMethodDoc', () => {
        const cleanDoc =
            'Count the number of members in a sorted set between a given\n' +
            'lexicographical range.\n' +
            ':raises TypeError: if min is not bytes\n' +
            ':raises TypeError: if max is not bytes';

        expect(reprMethodDoc(cleanDoc)).toBeTruthy();
    });

    it('checkSingleCommandValid', () => {
        expect(checkCommandShapeValid([])).toEqual(false);
        expect(checkCommandShapeValid({})).toEqual(true);

        expect(checkCommandShapeValid({ methodName: 2 })).toEqual(false);
        expect(checkCommandShapeValid({ something: 'qwe' })).toEqual(false);

        expect(checkCommandShapeValid({ methodName: 'name' })).toEqual(true);
        expect(checkCommandShapeValid({ methodName: 'name', methodParams: [] })).toEqual(false);
        expect(checkCommandShapeValid({ methodName: 'name', methodParams: {} })).toEqual(true);
    });

    it('checkCommandsValid', () => {
        expect(checkCommandsValid([
            { methodName: 'echo' }
        ])).toEqual(true);

        expect(checkCommandsValid({})).toEqual(false);
    });


    it('methodParameterToSingleValue', () => {
        expect(methodParameterToSingleValue({ kind: 'VAR_POSITIONAL' })).toEqual([]);
        expect(methodParameterToSingleValue({ kind: 'VAR_POSITIONAL', default: [1] })).toEqual([1]);

        expect(methodParameterToSingleValue({ kind: 'VAR_KEYWORD' })).toEqual({});
        expect(methodParameterToSingleValue({ kind: 'VAR_KEYWORD', default: { a: 1 } })).toEqual({ a: 1 });

        expect(methodParameterToSingleValue({ kind: 'POSITIONAL_OR_KEYWORD' })).toEqual('');
        expect(methodParameterToSingleValue({ kind: 'POSITIONAL_OR_KEYWORD', default: 33 })).toEqual(33);

        expect(methodParameterToSingleValue({ kind: 'POSITIONAL_ONLY' })).toEqual('');
        expect(methodParameterToSingleValue({ kind: 'POSITIONAL_ONLY', default: 42 })).toEqual(42);
    });

    it('parametersToJson', () => {
        const parameters = [
            {
                name: 'key',
                kind: 'POSITIONAL_OR_KEYWORD',
                default: null,
                type: null
            },
            {
                name: 'min',
                kind: 'POSITIONAL_OR_KEYWORD',
                default: '-',
                type: null
            },
            {
                name: 'max',
                kind: 'POSITIONAL_OR_KEYWORD',
                default: '+',
                type: null
            },
            {
                name: 'include_min',
                kind: 'POSITIONAL_OR_KEYWORD',
                default: true,
                type: null
            },
            {
                name: 'include_max',
                kind: 'POSITIONAL_OR_KEYWORD',
                default: true,
                type: null
            }
        ];

        expect(parametersToJson(parameters)).toEqual({
            include_max: true,
            include_min: true,
            key: '',
            max: '+',
            min: '-'
        });
    });

});
