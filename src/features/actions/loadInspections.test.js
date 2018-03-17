import { loadInspections } from '.';
import { RSAA } from 'redux-api-middleware';


describe('features.actions', () => {
    it('can loadInspections', () => {
        const action = loadInspections('/url');
        expect(action).toBeTruthy();
        expect(action[RSAA].endpoint).toEqual('/url');
    });
});
