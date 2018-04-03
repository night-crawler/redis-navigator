import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Button, Grid, Input, Segment } from 'semantic-ui-react';
import { Timeouts } from 'timers';
import messages from '../messages';
import { InfiniteLoader, List } from 'react-virtualized';


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
        searchDataSlices: PropTypes.any,
        searchInfo: PropTypes.any,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyViewer');
        this.log('initialized', props);
    }

    isRowLoaded = ({ index }) => {  // index == 100500
        const { searchDataSlices, searchInfo } = this.props;
        if (!searchInfo || searchInfo.paginationCursor === undefined)
            return false;
        const { per_page } = searchInfo.paginationCursor;

        const pageNumberForIndex = parseInt(index / per_page, 10);
        if (searchDataSlices[pageNumberForIndex] !== undefined)
            console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ');

        console.log('suka! pageNumberForIndex', pageNumberForIndex, searchDataSlices);

        return searchDataSlices[pageNumberForIndex] !== undefined;
    };
    loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log('loadMoreRows', startIndex, stopIndex);
    };
    renderRow = ({ index, key, style }) => {

    };

    render() {
        const { intl, locationSearchParams,
            searchDataSlices, searchInfo
        } = this.props;
        console.log(searchInfo, searchDataSlices);

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

                    </div>
                </Grid.Column>
            </Grid>

        );
    }

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