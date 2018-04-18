import { KEY_VIEWER_SEARCH_TIMEOUT, MAX_CONTENT_AUTOLOAD_SIZE } from 'constants';
import SplitPane from 'react-split-pane';
import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Button, Grid, Input, Segment } from 'semantic-ui-react';

import messages from '../messages';

import InfiniteKeyList from './InfiniteKeyList';
import KeyEditor from './KeyEditor';
import KeyUpdateResults from './KeyUpdateResults';
import PluralFoundKeys from './PluralFoundKeys';

import { Timeouts } from 'utils/timers';


class KeyViewer extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
        actions: PropTypes.shape({
            searchKeys: PropTypes.func.isRequired,
            setSelectedKey: PropTypes.func.isRequired,
            fetchKeyRangeWithTypes: PropTypes.func.isRequired,
            fetchKeyInfo: PropTypes.func.isRequired,
            fetchKeyData: PropTypes.func.isRequired,
            updateKeyDataAndReload: PropTypes.func.isRequired,
        }),
        locationSearchParams: PropTypes.shape({
            pattern: PropTypes.string,
            sortKeys: PropTypes.bool,
            scanCount: PropTypes.number,
            ttlSeconds: PropTypes.number,
            perPage: PropTypes.number,
        }),
        notifications: PropTypes.shape({
            error: PropTypes.func,
            success: PropTypes.func,
            warning: PropTypes.func,
        }),

        routeInstanceSearchUrl: PropTypes.string,

        selectedKey: PropTypes.string,
        selectedKeyType: PropTypes.string,
        selectedKeyData: PropTypes.any,
        selectedKeyInfo: PropTypes.object,
        selectedKeyUpdateResults: PropTypes.object,

        routeKeys: PropTypes.object,
        keyTypes: PropTypes.object,

        searchPagesMap: PropTypes.object,
        searchInfo: PropTypes.object,
        keyInfo: PropTypes.object,
        keyData: PropTypes.object,

        hasFetchedSearchKeys: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyViewer');
        this.log('initialized', props);

        this.state = {};
    }

    render() {
        const {
            intl,
            locationSearchParams,
            searchInfo,
        } = this.props;

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

            <SplitPane

                split='vertical'
                minSize={ 300 } defaultSize={ 300 }
            >
                <div style={ { height: 'calc(100vh - 150px)' } }>
                    <Input
                        defaultValue={ locationSearchParams.pattern }
                        icon='search'
                        iconPosition='left'
                        fluid={ true }
                        onChange={ this.handleFilterKeysChange }
                        action={ filterActionButtonGroup }
                        placeholder={ intl.formatMessage({ ...messages.filterKeys }) }
                    />
                    <PluralFoundKeys keyCount={ searchInfo.count } />
                    { this.renderInfiniteKeyList() }
                </div>
                <div>
                    { this.renderKeyEditor() }
                </div>
            </SplitPane>
        );
    }

    renderInfiniteKeyList() {
        const {
            locationSearchParams,
            hasFetchedSearchKeys,
            searchInfo,
            selectedKey,
            keyTypes,
            actions,
            searchPagesMap,
        } = this.props;

        return hasFetchedSearchKeys && !!searchInfo.count &&
            <InfiniteKeyList
                selectedKey={ selectedKey }
                count={ searchInfo.count }
                keyTypes={ keyTypes }
                perPage={ locationSearchParams.perPage }
                searchPagesMap={ searchPagesMap }
                fetchKeyRangeWithTypes={ actions.fetchKeyRangeWithTypes }
                onKeyClick={ this.handleKeyClicked }
            />;
    }

    renderKeyEditor() {
        const { selectedKey, selectedKeyType, selectedKeyData, selectedKeyInfo } = this.props;
        return <KeyEditor
            type={ selectedKeyType }
            info={ selectedKeyInfo }
            data={ selectedKeyData }
            selectedKey={ selectedKey }
            onFetchKeyDataClick={ this.handleFetchKeyDataClicked }
            onSaveKeyDataClick={ this.handleSaveKeyDataClick }
        />;
    };

    componentDidMount() {
        const { locationSearchParams, actions } = this.props;
        actions.searchKeys(locationSearchParams);
    }

    static getDerivedStateFromProps(nextProps) {
        const {
            selectedKey,
            selectedKeyType: type,
            selectedKeyData: data,
            selectedKeyInfo: info,
            selectedKeyUpdateResults: updateResults,
            actions,
            notifications,
        } = nextProps;

        // if (selectedKey && !info)
        //     actions.fetchKeyInfo(selectedKey);

        if (info && type && !data && info.memory_usage <= MAX_CONTENT_AUTOLOAD_SIZE)
            actions.fetchKeyData(selectedKey, type);

        if (updateResults) {
            if (updateResults.hasErrors === false)
                notifications.success({ message: <KeyUpdateResults { ...updateResults } /> });
            if (updateResults.hasErrors === true)
                notifications.error({ message: <KeyUpdateResults { ...updateResults } />, autoDismiss: false });
        }
        return null;
    }

    handleFetchKeyDataClicked = (key, type) => {
        const { actions } = this.props;
        actions.fetchKeyInfo(key);
        actions.fetchKeyData(key, type);
    };

    handleClearFilterKeysClicked = () => {
        const { locationSearchParams, actions } = this.props;
        actions.searchKeys({
            ...locationSearchParams,
            pattern: '*'
        });
    };

    handleKeyClicked = key => {
        const { actions } = this.props;
        actions.setSelectedKey(key);
        actions.fetchKeyInfo(key);
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
            timeout: KEY_VIEWER_SEARCH_TIMEOUT
        });
    };

    handleSaveKeyDataClick = (key, type, prevData, nextData, pexpire) => {
        const { actions } = this.props;
        actions.updateKeyDataAndReload(key, type, prevData, nextData, pexpire);
    }
}


export default injectIntl(KeyViewer);
