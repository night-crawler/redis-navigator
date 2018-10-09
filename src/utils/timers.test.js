import { Timeout } from './timers';


describe('timers', () => {
  describe('Timeout', () => {

    it('can validate args on add', () => {
      const timers = new Timeout();

      const throwOnEmptyName = () => timers.add({ callback: () => 'die' });
      expect(throwOnEmptyName).toThrow();

      const throwOnEmptyCallback = () => timers.add({ name: 'qwe' });
      expect(throwOnEmptyCallback).toThrow();
    });

    it('can validate args on remove', () => {
      const timers = new Timeout();
      const throwOnEmptyName = () => timers.remove();
      expect(throwOnEmptyName).toThrow();
    });

    it('works', () => {
      const _setTimeout = jest.fn(() => 100500);
      const _clearTimeout = jest.fn(() => null);

      const cb = () => 'some timer callback';

      const timers = new Timeout(_setTimeout, _clearTimeout);

      timers.add({
        name: 'newTimer',
        callback: cb,
        timeout: 1,
      });
      expect(_setTimeout).toHaveBeenCalledWith(cb, 1);

      // second call should trigger a clearTimeout
      timers.add({
        name: 'newTimer',
        callback: cb,
        timeout: 1,
      });
      expect(_clearTimeout).toHaveBeenCalledWith(100500);
    });

  });
});
