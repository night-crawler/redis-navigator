import debug from 'debug';
import InfiniteKeyList from 'features/KeyViewer/components/InfiniteKeyList';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Button, Grid, Header, Input, Segment } from 'semantic-ui-react';
import { Timeouts } from 'utils/timers';
import messages from '../messages';



class KeyViewer extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
        actions: PropTypes.shape({
            searchKeys: PropTypes.func.isRequired,
            setActiveKey: PropTypes.func.isRequired,
            fetchKeyRangeWithTypes: PropTypes.func.isRequired,
        }),
        locationSearchParams: PropTypes.shape({
            pattern: PropTypes.string,
            sortKeys: PropTypes.bool,
            scanCount: PropTypes.number,
            ttlSeconds: PropTypes.number,
            perPage: PropTypes.number,
        }),
        activeKey: PropTypes.string,
        routeInstanceSearchUrl: PropTypes.string,
        routeKeys: PropTypes.object,
        keyTypes: PropTypes.object,

        searchPagesMap: PropTypes.object,
        searchInfo: PropTypes.object,

        hasFetchedSearchKeys: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyViewer');
        this.log('initialized', props);
    }

    render() {
        const { intl, locationSearchParams, hasFetchedSearchKeys, searchInfo, activeKey } = this.props;

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
                            {
                                hasFetchedSearchKeys && searchInfo.count
                                    ? <InfiniteKeyList
                                        activeKey={ activeKey }
                                        count={ searchInfo.count }
                                        keyTypes={ this.props.keyTypes }
                                        perPage={ this.props.locationSearchParams.perPage }
                                        searchPagesMap={ this.props.searchPagesMap }
                                        fetchKeyRangeWithTypes={ this.props.actions.fetchKeyRangeWithTypes }
                                        onKeyClick={ this.handleKeyClicked }
                                    /> : false
                            }
                        </div>
                    </Grid.Column>

                    <Grid.Column width={ 11 }>
                        <Header as={ 'h1' }>wip</Header>
                    </Grid.Column>
                </Grid>
            </Segment>

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

    handleKeyClicked = key => {
        const { actions } = this.props;
        actions.setActiveKey(key);
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