import { isArray, isPlainObject, range } from 'lodash';


export class PageHelper {
  constructor(slices = [], pageSize) {
    if (+pageSize !== pageSize)
      throw new Error(`pageSize must me a number but got ${typeof pageSize}: ${pageSize}`);

    if (isArray(slices)) {
      this.slicesType = 'array';
    } else if (isPlainObject(slices)) {
      this.slicesType = 'object';
    } else {
      this.slicesType = null;
    }

    if (this.slicesType === null)
      throw new Error(`Slices expected an array || object but got ${typeof slices}: ${slices}`);

    this.pageSize = pageSize;
    this.slices = slices;
  }

  getPageNumber(index) {
    if (+index !== index)
      throw new Error(`Index must me a number but got ${typeof index}: ${index}`);
    return Math.ceil(( index + 1 ) / this.pageSize) || 1;
  }

  /**
     * [ ..., [1, 2, 3], [1, 2, 3], ... ]
     * { 1: [1, 2, 3], ... }
     */
  getSubItem(index) {
    const
      pageNumber = this.getPageNumber(index) - ( this.slicesType === 'array' ? 1 : 0 ),
      offset = index % this.pageSize,
      page = this.getPage(pageNumber);

    if (page.length < offset)
      throw new Error(`Page ${pageNumber} has only ${pageNumber.length} elements, but ${offset} requested`);

    return page[ offset ];
  }

  isRowLoaded(index) {
    try {
      this.getSubItem(index);
      return true;
    } catch (e) {
      return false;
    }
  }

  getPage(pageNumber) {
    const page = this.slices[ pageNumber ];

    if (!isArray(page))
      throw new Error(`Expected an array at ${pageNumber} but got ${typeof page}: ${page}`);
    if (page.length > this.pageSize)
      throw new Error(`Page ${pageNumber} has length ${page.length} but it must be less then ${this.pageSize}`);

    return page;
  }

  getPageRange(startIndex, stopIndex) {
    return range(
      this.getPageNumber(startIndex),
      this.getPageNumber(stopIndex) + 1
    );
  }

  getSubSlice(startIndex, stopIndex) {
    const
      startPageNumber = this.getPageNumber(startIndex) - ( this.slicesType === 'array' ? 1 : 0 ),
      stopPageNumber = this.getPageNumber(stopIndex) - ( this.slicesType === 'array' ? 1 : 0 ),
      startOffset = startIndex % this.pageSize,
      stopOffset = stopIndex % this.pageSize;

    if (startPageNumber === stopPageNumber) {
      return this.slices[ startPageNumber ].slice(startOffset, stopOffset + 1);
    }

    const
      firstPage = this.getPage(startPageNumber),
      lastPage = this.getPage(stopPageNumber);

    const items = [];
    items.push(...firstPage.slice(startOffset));

    for (let pageNumber = startPageNumber + 1; pageNumber <= stopPageNumber - 1; pageNumber++) {
      const page = this.getPage(pageNumber);
      items.push(...page);
    }

    items.push(...lastPage.slice(0, stopOffset + 1));

    return items;
  }
}
