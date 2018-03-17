import { clearCallEditors } from '.';


describe('RedisConsole.actions', () => {
    it('can clearCallEditors', () => {
        const action = clearCallEditors('redis000');
        expect(action).toBeTruthy();
    });
});
