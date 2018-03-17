import { loadInstances } from '.';
import { RSAA } from 'redux-api-middleware';


describe('features.actions', () => {
    it('can loadInstances', () => {
        const action = loadInstances('/url');
        expect(action).toBeTruthy();
        expect(action[RSAA].endpoint).toEqual('/url');
    });
});
