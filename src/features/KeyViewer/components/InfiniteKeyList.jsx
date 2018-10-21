import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';

import { PageHelper } from '~/utils';

import { KeyRow } from './KeyRow';



export class InfiniteKeyList extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    searchPagesMap: PropTypes.object.isRequired,
    perPage: PropTypes.number.isRequired,
    keyTypes: PropTypes.object.isRequired,
    onKeyClick: PropTypes.func,
    fetchKeyRangeWithTypes: PropTypes.func.isRequired,
    selectedKey: PropTypes.string,
  };

  render() {
    const { count } = this.props;


    return (
      <InfiniteLoader
        ref={ self => {
          this.InfiniteLoader = self;
        } }

        isRowLoaded={ this.isRowLoaded }
        loadMoreRows={ this.loadMoreRows }
        rowCount={ count }
      >
        { ({ onRowsRendered, registerChild }) => (

          <AutoSizer>
            { ({ height, width }) => (

              <List
                ref={ self => {
                  this.List = self;
                  registerChild(self);
                } }

                onRowsRendered={ onRowsRendered }
                rowRenderer={ this.renderRow }

                height={ height }
                width={ width }

                rowHeight={ 25 }
                rowCount={ count }
              />

            ) }
          </AutoSizer>
        ) }
      </InfiniteLoader>
    );
  }

  componentDidUpdate({ selectedKey }) {
    if (selectedKey !== this.props.selectedKey)
      this.List.forceUpdateGrid();

    // this.InfiniteLoader.resetLoadMoreRowsCache(true);
  }

  isRowLoaded = ({ index }) => {
    const { perPage, searchPagesMap } = this.props;

    return new PageHelper(searchPagesMap, perPage).isRowLoaded(index);
  };

  loadMoreRows = ({ startIndex, stopIndex }) => {
    const { fetchKeyRangeWithTypes, perPage } = this.props;
    return fetchKeyRangeWithTypes({ startIndex, stopIndex, perPage });
  };

  // eslint-disable-next-line no-unused-vars
  renderNotLoadedRow = ({ index, key, style }) => {
    return <div style={ style } key={ key }>-</div>;
  };

  renderRow = ({ index, key, style }) => {
    if (!this.isRowLoaded({ index }))
      return this.renderNotLoadedRow({ index, key, style });

    const { perPage, searchPagesMap, keyTypes, selectedKey, onKeyClick } = this.props;

    const item = new PageHelper(searchPagesMap, perPage).getSubItem(index);
    const keyType = keyTypes[ item ];

    if (keyType === undefined)
      this.log(`Key type is undefined for ${item}`);

    // this.log(`renderRow, INDEX: ${index}, item: ${item}, selectedKey: ${selectedKey} ${selectedKey === item}`);

    return <KeyRow
      onClick={ () => onKeyClick(item) }
      item={ item }
      keyType={ keyType }
      style={ style }
      key={ key }
      isActive={ selectedKey === item }
    />;
  };
}
