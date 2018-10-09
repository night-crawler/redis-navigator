import { toggleProgressBarVisible } from '.';


describe('actions', () => {
  it('can toggleProgressBarVisible', () => {
    const action = toggleProgressBarVisible();
    expect(action).toBeTruthy();
  });

  it('can toggleProgressBarVisible with isVisible', () => {
    const action = toggleProgressBarVisible(true);
    expect(action.payload.isVisible).toEqual(true);
  });
});
