import { removeCallEditor } from './removeCallEditor';


describe('RedisConsole.actions', () => {
  it('can removeCallEditor', () => {
    const action = removeCallEditor('redis000', 'my-editor-uuid');
    expect(action).toBeTruthy();
  });
});
