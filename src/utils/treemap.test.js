import {
    addToSMTree,
    dumpSMTree,
} from './treemap';


describe('treemap', () => {
    it('addToSMTree', () => {
        const tree = {};
        addToSMTree(tree, 'a:b:c', 'abc');
        addToSMTree(tree, 'a:b', 'ab');
        addToSMTree(tree, 'a', 'a');

        const expected = {
            keyMap: {
                a: {
                    value: 'a',
                    keyMap: {
                        b: {
                            value: 'ab',
                            keyMap: {
                                c: {
                                    value: 'abc',
                                    keyMap: {}
                                }
                            }
                        }
                    }
                }
            }
        };

        expect(dumpSMTree(tree)).toEqual(expected);
    });

});