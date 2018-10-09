import { toggleImportDialogVisible } from '.';


describe('RedisConsole.actions', () => {
  it('can toggleImportDialogVisible', () => {
    const action = toggleImportDialogVisible('redis000');
    expect(action).toBeTruthy();
  });

  it('can toggleImportDialogVisible with isVisible', () => {
    const action = toggleImportDialogVisible('redis000', true);
    expect(action.payload.isVisible).toEqual(true);
  });
});
