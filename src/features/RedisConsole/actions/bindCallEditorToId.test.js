import { bindCallEditorToId } from './bindCallEditorToId';


describe('RedisConsole.actions', () => {
  it('can bindCallEditorToId', () => {
    const action = bindCallEditorToId('redis000', 'key', 1);
    expect(action).toBeTruthy();
  });
});
