import { changeCallEditorMethodParams } from '.';


describe('RedisConsole.actions', () => {
  it('can changeCallEditorMethodParams', () => {
    const action = changeCallEditorMethodParams('redis000', {params: {a: 1, b: 2}}, 'some-uuid-lol');
    expect(action).toBeTruthy();
  });
});
