import { appendCallEditor } from '.';


describe('RedisConsole.actions', () => {
    it('can appendCallEditor', () => {
        const action = appendCallEditor('redis000', 'key', 'green');
        expect(action).toBeTruthy();
    });
});
