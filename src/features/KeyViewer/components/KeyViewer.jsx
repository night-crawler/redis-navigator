import debug from 'debug';
import { searchPagesMap } from 'features/KeyViewer/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { InfiniteLoader, List } from 'react-virtualized';
import { Button, Grid, Input } from 'semantic-ui-react';
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

    render() {
        const { intl, locationSearchParams, hasFetchedSearchKeys } = this.props;


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
            <Grid>
                <Grid.Column width={ 5 }>
                    <div>

                        <Input
                            defaultValue={ locationSearchParams.pattern }
                            icon='search'
                            iconPosition='left'
                            fluid={ true }
                            onChange={ this.handleFilterKeysChange }
                            action={ filterActionButtonGroup }
                            placeholder={ intl.formatMessage({ ...messages.filterKeys }) }
                        />

                        { this.props.routeInstanceSearchUrl }

                        { hasFetchedSearchKeys && this.renderLoader() }

                    </div>
                </Grid.Column>
            </Grid>

        );
    }

    renderLoader = () => {
        return (
            <InfiniteLoader
                ref={ self => {
                    this.InfiniteLoader = self;
                } }

                isRowLoaded={ this.isRowLoaded }
                loadMoreRows={ this.loadMoreRows }
                rowCount={ 500 }
            >
                { ({ onRowsRendered, registerChild }) => (

                    <List
                        ref={ self => {
                            this.List = self;
                            registerChild(self);
                        } }

                        onRowsRendered={ onRowsRendered }
                        rowRenderer={ this.renderRow }

                        height={ 500 }
                        width={ 500 }

                        rowHeight={ 50 }
                        rowCount={ 500 }
                    />

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

    renderRow = ({ index, key, style }) => {
        const { locationSearchParams, searchPagesMap } = this.props;
        const { perPage } = locationSearchParams;
        const pageNumberForIndex = Math.ceil((index + 1) / perPage) || 1;
        const offset = index % perPage;

        // const page = searchPagesMap[pageNumberForIndex];
        // if (!page) {
        //     console.log('MRAZ');
        // }
        // const item = page && page[offset];

        const item = searchPagesMap[pageNumberForIndex][offset];

        console.log(`INDEX: ${index}, page: ${pageNumberForIndex}, offset: ${offset}, item: ${item}`);
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