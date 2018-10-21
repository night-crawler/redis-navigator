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
    return (
      <InfiniteLoader
        ref={ self => {
          this.InfiniteLoader = self;
        } }

        isRowLoaded={ this.isRowLoaded }
        loadMoreRows={ this.loadMoreRows }
        rowCount={ this.props.count }
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
                rowCount={ this.props.count }
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

  isRowLoaded = ({ index }) => new PageHelper(
    this.props.searchPagesMap, 
    this.props.perPage
  ).isRowLoaded(index);

  loadMoreRows = ({ startIndex, stopIndex }) =>
    this.props.fetchKeyRangeWithTypes({ 
      startIndex, 
      stopIndex, 
      perPage: this.props.perPage,
    });

  // eslint-disable-next-line no-unused-vars
  renderNotLoadedRow = ({ index, key, style }) => {
    return <div style={ style } key={ key }>-</div>;
  };

  renderRow = ({ index, key, style }) => {
    if (!this.isRowLoaded({ index }))
      return this.renderNotLoadedRow({ index, key, style });

    const item = new PageHelper(this.props.searchPagesMap, this.props.perPage).getSubItem(index);
    const keyType = this.props.keyTypes[ item ];

    if (keyType === undefined) {
      // eslint-disable-next-line
      console.debug(`Key type is undefined for ${item}`, item);
    }

    return <KeyRow
      onClick={ () => this.props.onKeyClick(item) }
      item={ item }
      keyType={ keyType }
      style={ style }
      key={ key }
      isActive={ this.props.selectedKey === item }
    />;
  };
}
