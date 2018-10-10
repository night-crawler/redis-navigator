import { PageHelper } from './PageHelper';


describe('PageHelper', () => {
  it('getPageNumber', () => {
    const ph = new PageHelper([], 4);
    expect(ph.getPageNumber(0)).toEqual(1);
    expect(ph.getPageNumber(1)).toEqual(1);
    expect(ph.getPageNumber(2)).toEqual(1);
    expect(ph.getPageNumber(3)).toEqual(1);
    expect(ph.getPageNumber(4)).toEqual(2);
    expect(ph.getPageNumber(5)).toEqual(2);

    const wrongArgs = () => ph.getPageNumber();
    expect(wrongArgs).toThrow(Error);
  });

  it('can getSubItem with array slices', () => {
    const arrayOfArrays = [
      [ 0, 1, 2, 3 ],
      [ 4, 5, 6, 7 ],
      'wrong',
      [ 'w', 'r', 'o', 'n', 'g' ]
    ];

    const ph = new PageHelper(arrayOfArrays, 4);

    expect(ph.getSubItem(3)).toEqual(3);
    expect(ph.getSubItem(7)).toEqual(7);

    expect(() => ph.getSubItem(8)).toThrow(Error);
    expect(() => ph.getSubItem(12)).toThrow(Error);
  });

  it('getSubItem with object page mapping', () => {
    const pageMap = {
      1: [ 0, 1, 2, 3 ],
      2: [ 4, 5, 6, 7 ],
      3: 'wrong',
      4: [ 'w', 'r', 'o', 'n', 'g' ],
    };

    const ph = new PageHelper(pageMap, 4);

    expect(ph.getSubItem(3)).toEqual(3);
    expect(ph.getSubItem(7)).toEqual(7);

    expect(() => ph.getSubItem(8)).toThrow(Error);
    expect(() => ph.getSubItem(12)).toThrow(Error);
  });

  it('getSubSlice', () => {
    const arrayOfArrays = [
      [ 10, 11, 12, 13 ],
      [ 14, 15, 16, 17 ],
      [ 18, 19, 20, 21 ],
    ];
    const mapOfArrays = {
      1: [ 10, 11, 12, 13 ],
      2: [ 14, 15, 16, 17 ],
      3: [ 18, 19, 20, 21 ],
    };

    const phArray = new PageHelper(arrayOfArrays, 4);
    const phObject = new PageHelper(mapOfArrays, 4);

    expect(phArray.getSubSlice(0, 0)).toEqual([ 10 ]);
    expect(phObject.getSubSlice(0, 0)).toEqual([ 10 ]);

    expect(phArray.getSubSlice(0, 3)).toEqual([ 10, 11, 12, 13 ]);
    expect(phObject.getSubSlice(0, 3)).toEqual([ 10, 11, 12, 13 ]);

    expect(phArray.getSubSlice(3, 4)).toEqual([ 13, 14 ]);
    expect(phObject.getSubSlice(3, 4)).toEqual([ 13, 14 ]);

    expect(phArray.getSubSlice(3, 8)).toEqual([ 13, 14, 15, 16, 17, 18 ]);
    expect(phObject.getSubSlice(3, 8)).toEqual([ 13, 14, 15, 16, 17, 18 ]);
  });

  it('includes the rightmost value for page range', () => {
    const ph = new PageHelper(undefined, 4);
    expect(ph.getPageRange(1, 6)).toEqual([ 1, 2 ]);
    expect(ph.getPageRange(0, 3)).toEqual([ 1 ]);
  });
});
