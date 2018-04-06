import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { PageHelper } from 'utils';
import KeyRow from './KeyRow';


export default class InfiniteKeyList extends React.Component {
    static propTypes = {
        count: PropTypes.number.isRequired,
        searchPagesMap: PropTypes.object.isRequired,
        perPage: PropTypes.number.isRequired,
        keyTypes: PropTypes.object.isRequired,
        onKeyClick: PropTypes.func,
        fetchKeyRangeWithTypes: PropTypes.func.isRequired,
        activeKey: PropTypes.string,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('InfiniteKeyList');
        this.log('initialized', props);
    }

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

    componentDidUpdate({ activeKey }) {
        if (activeKey !== this.props.activeKey)
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

    renderNotLoadedRow = ({ index, key, style }) => {
        return <div style={ style } key={ key }>-</div>;
    };

    renderRow = ({ index, key, style }) => {
        if (!this.isRowLoaded({ index }))
            return this.renderNotLoadedRow({ index, key, style });

        const { perPage, searchPagesMap, keyTypes, activeKey, onKeyClick } = this.props;

        const item = new PageHelper(searchPagesMap, perPage).getSubItem(index);
        const keyType = keyTypes[ item ];

        if (keyType === undefined)
            this.log(`Key type is undefined for ${item}`);

        // this.log(`renderRow, INDEX: ${index}, item: ${item}, activeKey: ${activeKey} ${activeKey === item}`);

        return <KeyRow
            onClick={ () => onKeyClick(item) }
            item={ item }
            keyType={ keyType }
            style={ style }
            key={ key }
            isActive={ activeKey === item }
        />;
    };
}
