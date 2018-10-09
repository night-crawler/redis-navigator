import { RSAA } from 'redux-api-middleware';

import { fetchInstances } from '.';


describe('features.actions', () => {
  it('can fetchInstances', () => {
    const action = fetchInstances('/url');
    expect(action).toBeTruthy();
    expect(action[RSAA].endpoint).toEqual('/url');
  });
});
