import { fetchInstances } from '.';
import { RSAA } from 'redux-api-middleware';


describe('features.actions', () => {
    it('can fetchInstances', () => {
        const action = fetchInstances('/url');
        expect(action).toBeTruthy();
        expect(action[RSAA].endpoint).toEqual('/url');
    });
});
