import { KEY_VIEWER_KEYS_MIN_WIDTH, KEY_VIEWER_SEARCH_TIMEOUT, MAX_CONTENT_AUTOLOAD_SIZE } from '~/constants';

import SplitPane from 'react-split-pane';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import { Timeouts } from 'utils/timers';

import { InfiniteKeyList } from './InfiniteKeyList';
import { KeyEditor } from './KeyEditor';
import { KeyUpdateResults } from './KeyUpdateResults';
import { PluralFoundKeys } from './PluralFoundKeys';
import { KeyFilterInput } from './KeyFilterInput';
import './KeyViewer.css';


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

    this.state = {
      keysPaneWidth: KEY_VIEWER_KEYS_MIN_WIDTH,
      editorPaneWidth: window.innerWidth - KEY_VIEWER_KEYS_MIN_WIDTH - 25*2
    };
  }

  render() {

    return (
      <SplitPane
        className='KeyViewer'
        style={ { height: 'calc(100vh - 56px)' } }
        split='vertical'
        minSize={ KEY_VIEWER_KEYS_MIN_WIDTH } defaultSize={ KEY_VIEWER_KEYS_MIN_WIDTH }
        pane1ClassName='KeysList'
        panel2ClassName='Details'
        onDragFinished={
          // eslint-disable-next-line
          draggedSize => this.setState({
            keysPaneWidth: draggedSize,
            editorPaneWidth: window.innerWidth - draggedSize - 25*2
          })
        }
      >
        <div style={ { height: 'calc(100vh - 56px)' } }>
          <KeyFilterInput
            locationSearchParams={ this.props.locationSearchParams }
            onChange={ this.handleFilterKeysChange }
            onClear={ this.handleClearFilterKeysClicked }
            onToggleSort={ this.handleToggleSortKeysClicked }
          />

          <PluralFoundKeys keyCount={ this.props.searchInfo.count } />
          { this.renderInfiniteKeyList() }
        </div>
        <div style={ { height: 'calc(100vh - 56px)', maxWidth: this.state.editorPaneWidth } }>
          { this.renderKeyEditor() }
        </div>
      </SplitPane>
    );
  }

  renderInfiniteKeyList() {
    return this.props.hasFetchedSearchKeys && !!this.props.searchInfo.count &&
      <InfiniteKeyList
        selectedKey={ this.props.selectedKey }
        count={ this.props.searchInfo.count }
        keyTypes={ this.props.keyTypes }
        perPage={ this.props.locationSearchParams.perPage }
        searchPagesMap={ this.props.searchPagesMap }
        fetchKeyRangeWithTypes={ this.props.actions.fetchKeyRangeWithTypes }
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
  }

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

  handleClearFilterKeysClicked = () => this.props.actions.searchKeys({
    ...this.props.locationSearchParams,
    pattern: '*'
  });

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
