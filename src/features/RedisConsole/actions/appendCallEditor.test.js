import { appendCallEditor } from '.';


describe('RedisConsole.actions', () => {
  it('can appendCallEditor', () => {
    const action = appendCallEditor({ instanceName: 'lol' });
    expect(action).toBeTruthy();
  });
});
