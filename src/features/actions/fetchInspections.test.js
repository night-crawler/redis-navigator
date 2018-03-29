import { fetchInspections } from '.';
import { RSAA } from 'redux-api-middleware';


describe('features.actions', () => {
    it('can fetchInspections', () => {
        const action = fetchInspections('/url');
        expect(action).toBeTruthy();
        expect(action[RSAA].endpoint).toEqual('/url');
    });
});
