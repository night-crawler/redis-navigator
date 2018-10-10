import { initStoreWithUrls } from './initStoreWithUrls';


describe('features.actions', () => {
  it('can initStoreWithUrls', () => {
    const action = initStoreWithUrls({ a: 1, b: 2 });
    expect(action).toBeTruthy();
  });
});
