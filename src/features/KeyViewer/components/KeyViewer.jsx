import debug from 'debug';
import KeyRow from './KeyRow';
import { flatten, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { Button, Grid, Header, Input, Segment } from 'semantic-ui-react';
import { Timeouts } from 'timers';
import { PageHelper } from 'utils';
import messages from '../messages';



class KeyViewer extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
        actions: PropTypes.shape({
            searchKeys: PropTypes.func,
            fetchKeyTypes: PropTypes.func,
            setActiveKey: PropTypes.func,
        }),
        locationSearchParams: PropTypes.shape({
            pattern: PropTypes.string,
            sortKeys: PropTypes.bool,
            scanCount: PropTypes.number,
            ttlSeconds: PropTypes.number
        }),
        routeInstanceSearchUrl: PropTypes.string,
        routeKeys: PropTypes.object,
        keyTypes: PropTypes.object,

        searchPagesMap: PropTypes.object,
        searchInfo: PropTypes.object,
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

        return (

            <Segment>
                <Grid style={ { height: 'calc(100vh - 75px)', margin: 0, padding: 0 } }>
                    <Grid.Column width={ 5 } style={ {
                        display: 'flex',
                        alignItems: 'stretch',
                        flexDirection: 'column',
                        margin: 0,
                        padding: 0
                    } }>
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
            </Segment>

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
    };

    isRowLoaded = ({ index }) => {
        const { locationSearchParams, searchPagesMap } = this.props;
        const { perPage } = locationSearchParams;

        return new PageHelper(searchPagesMap, perPage).isRowLoaded(index);
    };

    loadMoreRows = ({ startIndex, stopIndex }) => {
        const { locationSearchParams, actions } = this.props;
        const { perPage } = locationSearchParams;
        const pageHelper = new PageHelper(undefined, perPage);

        const promises = Promise.all(
            pageHelper
                .getPageRange(startIndex, stopIndex)
                .map(pageNumber => actions.fetchKeysPage(pageNumber, perPage))
        );

        return new Promise(
            (resolve, reject) => promises.then(
                data => resolve(
                    actions.fetchKeyTypes(flatten(map(data, 'payload.results')))
                ),
                error => reject(error)
            )
        );
    };

    renderNotLoadedRow = ({ index, key, style }) => {
        return <div style={ style } key={ key }>-</div>;
    };

    renderRow = ({ index, key, style }) => {
        if (!this.isRowLoaded({ index }))
            return this.renderNotLoadedRow({ index, key, style });

        const { locationSearchParams, searchPagesMap, keyTypes } = this.props;
        const { perPage } = locationSearchParams;

        const item = new PageHelper(searchPagesMap, perPage).getSubItem(index);
        const keyType = keyTypes[item];

        if (keyType === undefined)
            this.log(`Key type is undefined for ${item}`);

        // this.log(`INDEX: ${index}, page: ${pageNumberForIndex}, offset: ${offset}, item: ${item}`);

        return <KeyRow
            onClick={ this.handleKeyClicked }
            item={ item }
            keyType={ keyType }
            style={ style }
            key={ key }
        />;
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

    handleKeyClicked = key => {
        console.log(key);
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