import { setActiveInstance } from '.';


describe('features.actions', () => {
    it('can setActiveInstance', () => {
        const action = setActiveInstance('redis000');
        expect(action).toBeTruthy();
    });
});
