import { csrfSafeMethod, getApiMiddlewareOptions } from './requests';


describe('request utils', function () {
  it('understands which methods are safe!11', () => {
    expect(csrfSafeMethod('get')).toEqual(true);
  });

  it('getApiMiddlewareOptions', () => {
    const opts = getApiMiddlewareOptions();
    expect(opts).toBeTruthy();
  });
});
