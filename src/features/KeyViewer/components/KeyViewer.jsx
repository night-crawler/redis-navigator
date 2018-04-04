import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { Button, Grid, Input, Header, List as SUIList, Icon } from 'semantic-ui-react';
import { Timeouts } from 'timers';
import messages from '../messages';


class KeyViewer extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
        actions: PropTypes.shape({
            searchKeys: PropTypes.func,
        }),
        locationSearchParams: PropTypes.shape({
            pattern: PropTypes.string,
            sortKeys: PropTypes.bool,
            scanCount: PropTypes.number,
            ttlSeconds: PropTypes.number
        }),
        routeInstanceSearchUrl: PropTypes.string,
        routeKeys: PropTypes.object,

        // todo
        searchPagesMap: PropTypes.object,
        searchInfo: PropTypes.any,
        searchNumPages: PropTypes.number,

        hasFetchedSearchKeys: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyViewer');
        this.log('initialized', props);
    }

    componentDidUpdate() {
        // if (this.props.orderBy !== orderBy) {
        //     // noinspection JSUnresolvedFunction
        //     this.InfiniteLoader.resetLoadMoreRowsCache(true);
        //     // noinspection JSUnresolvedFunction
        //     this.List.scrollToPosition(0);
        // }
    }


    render() {
        const { intl, locationSearchParams, hasFetchedSearchKeys, searchInfo } = this.props;

        const filterActionButtonGroup = (
            <Button.Group>
                <Button
                    color={ locationSearchParams.sortKeys ? 'green' : undefined }
                    icon='sort alphabet ascending'
                    onClick={ this.handleToggleSortKeysClicked }
                />
                <Button
                    icon='remove'
                    onClick={ this.handleClearFilterKeysClicked }
                />;
            </Button.Group>
        );
        /**/
        return (
            <Grid style={ { height: 'calc(100vh - 45px)', margin: 0, padding: 0 } }>
                <Grid.Column width={ 5 } style={ { display: 'flex', alignItems: 'stretch', flexDirection: 'column', margin: 0, padding: 0 } }>
                    <Input
                        defaultValue={ locationSearchParams.pattern }
                        icon='search'
                        iconPosition='left'
                        fluid={ true }
                        onChange={ this.handleFilterKeysChange }
                        action={ filterActionButtonGroup }
                        placeholder={ intl.formatMessage({ ...messages.filterKeys }) }
                    />
                    <div style={ { flex: '1 1 auto' } }>
                        { hasFetchedSearchKeys && searchInfo.count ? this.renderLoader() : false }
                    </div>
                </Grid.Column>

                <Grid.Column width={ 11 }>
                    <Header as={ 'h1' }>wip</Header>
                </Grid.Column>
            </Grid>

        );
    }

    renderLoader = () => {
        const { searchInfo: { count } } = this.props;

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

                            <SUIList as={ List }
                                ref={ self => {
                                    this.List = self;
                                    registerChild(self);
                                } }

                                onRowsRendered={ onRowsRendered }
                                rowRenderer={ this.renderRow }

                                height={ height }
                                width={ width }

                                rowHeight={ 50 }
                                rowCount={ count }
                            />

                        ) }
                    </AutoSizer>
                )}
            </InfiniteLoader>
        );
    };

    isRowLoaded = ({ index }) => {
        const { locationSearchParams, searchPagesMap } = this.props;
        const { perPage } = locationSearchParams;

        const pageNumberForIndex = Math.ceil((index + 1) / perPage) || 1;
        this.log(
            'isRowLoaded',
            searchPagesMap[pageNumberForIndex] !== undefined,
            'pageNumberForIndex', pageNumberForIndex
        );
        return searchPagesMap[pageNumberForIndex] !== undefined;
    };

    loadMoreRows = ({ startIndex, stopIndex }) => {
        const { locationSearchParams, actions } = this.props;
        const { perPage } = locationSearchParams;

        const startPage = Math.ceil((startIndex + 1) / perPage) || 1;
        const stopPage = Math.ceil((stopIndex + 1) / perPage) || 1;

        const promises = [];
        for (let page = startPage; page <= stopPage; page++) {
            promises.push(actions.fetchKeysPage(page));
        }
        return Promise.all(promises);
    };

    renderNotLoadedRow = ({ index, key, style }) => {
        return <div style={ style }>-</div>;
    };
    renderRow = ({ index, key, style }) => {
        if (!this.isRowLoaded({ index }))
            return this.renderNotLoadedRow({ index, key, style });

        const { locationSearchParams, searchPagesMap } = this.props;
        const { perPage } = locationSearchParams;
        const pageNumberForIndex = Math.ceil((index + 1) / perPage) || 1;
        const offset = index % perPage;

        const item = searchPagesMap[pageNumberForIndex][offset];
        console.log(`INDEX: ${index}, page: ${pageNumberForIndex}, offset: ${offset}, item: ${item}`);

        return (
            <div style={ { display: 'flex', alignItems: 'stretch', flexDirection: 'row', ...style } }>
                <Icon name='mail' />
                <div>{ item }</div>
            </div>
        );
    };

    componentDidMount() {
        const { locationSearchParams, actions } = this.props;
        actions.searchKeys(locationSearchParams);
    }

    handleClearFilterKeysClicked = () => {
        const { locationSearchParams, actions } = this.props;
        actions.searchKeys({
            ...locationSearchParams,
            pattern: '*'
        });
    };

    handleToggleSortKeysClicked = () => {
        const { locationSearchParams, actions } = this.props;
        actions.searchKeys({
            ...locationSearchParams,
            sortKeys: !locationSearchParams.sortKeys
        });
    };

    handleFilterKeysChange = (e, { value }) => {
        const { locationSearchParams, actions } = this.props;
        const newParams = { ...locationSearchParams, pattern: value };

        Timeouts.add({
            name: 'KeyViewer.search',
            callback: () => actions.searchKeys(newParams),
            timeout: 300
        });
    }

}

export default injectIntl(KeyViewer);