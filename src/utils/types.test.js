import { isJson, isBase64, isValidNumber, isYaml } from './types';

describe('type utils', function () {
  it('isValidNumber', () => {
    expect(isValidNumber('')).toEqual(false);
    expect(isValidNumber([ 1, 2, 3 ])).toEqual(false);
    expect(isValidNumber({ a: 1 })).toEqual(false);
    expect(isValidNumber('test')).toEqual(false);

    expect(isValidNumber(0)).toEqual(true);
    expect(isValidNumber(1)).toEqual(true);
    expect(isValidNumber('0')).toEqual(true);
    expect(isValidNumber('1')).toEqual(true);

    expect(isValidNumber(1.12)).toEqual(true);
    expect(isValidNumber(0.12)).toEqual(true);
  });

  it('isBase64', () => {
    expect(isBase64('')).toEqual(false);
    expect(isBase64([ 1, 2, 3 ])).toEqual(false);

    expect(isBase64('test')).toEqual(false);
    expect(isBase64('test', 0)).toEqual(true);
  });

  it('isJson', () => {
    expect(isJson('{"a": 1}')).toEqual(true);
    expect(isJson(1)).toEqual(false);
    expect(isJson('1')).toEqual(false);
    expect(isJson('{"a": \'1}')).toEqual(false);
  });

  it('isYaml', () => {
    const _yaml = `
        glossary:
            title: example glossary`;

    expect(isYaml('true')).toEqual(false);
    expect(isYaml(true)).toEqual(false);
    expect(isYaml([ 1, 2, 3 ])).toEqual(false);
    expect(isYaml({ a: 1 })).toEqual(false);
    expect(isYaml('trash')).toEqual(false);

    expect(isYaml(_yaml)).toEqual(true);
  });
});
