import { REDIS_KEY_TYPE_ICON_MAP } from '~/constants';

import { isEmpty, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { FormattedMessage as Tr } from 'react-intl';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

import { FullPageDimmer } from '~/features/Common/components/FullPageDimmer';

import { CodeMirrorYamlObjectEditor, CodeMirrorTextEditor } from '~/features/Common/components';

import messages from '../messages';

import { KeyInfo } from './KeyInfo';
import './KeyEditor.css';

const i18nFetchKeyData = <Tr { ...messages.fetchKeyData } />;
const i18nSyntaxError = <Tr { ...messages.syntaxError } />;
const i18nSave = <Tr { ...messages.save } />;

export class KeyEditor extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    selectedKey: PropTypes.string,
    info: PropTypes.shape({
      memory_usage: PropTypes.number,
      ttl: PropTypes.number,
      pttl: PropTypes.number,
      object_refcount: PropTypes.number,
      object_encoding: PropTypes.string,
      object_idletime: PropTypes.number,
    }),
    data: PropTypes.any,
    onFetchKeyDataClick: PropTypes.func,
    onSaveKeyDataClick: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.keyMapHandlers = { save: this.handleSaveClicked };
    this.keyMap = { save: 'ctrl+enter' };

    this.state = { dirtyData: undefined };
  }

  render() {
    if (!this.props.selectedKey || !this.props.type)
      return <FullPageDimmer message={ <Tr { ...messages.selectAKey } /> } />;

    if (isEmpty(this.props.info))
      return <FullPageDimmer />;

    const iconName = (REDIS_KEY_TYPE_ICON_MAP[ this.props.type || 'loading' ]).name;

    return (
      <Segment
        className='KeyEditor'
        as={ HotKeys } keyMap={ this.keyMap } handlers={ this.keyMapHandlers } focused={ true }
        basic={ true }
      >
        <Header as='h2'>
          <Icon name={ iconName } />
          { `[${this.props.type}] ${this.props.selectedKey}` }
        </Header>
        <KeyInfo { ...this.props.info } />

        <Button fluid={ true } onClick={ this.handleFetchKeyDataClicked }>
          <Icon name='refresh' />
          { i18nFetchKeyData }
        </Button>

        { this.renderEditor() }

        <Button
          disabled={ !this.checkCanClickSave() } fluid={ true } primary={ true }
          onClick={ this.handleSaveClicked }
        >
          <Icon name='save' />
          { this.state.editorError ? i18nSyntaxError : i18nSave }
        </Button>
      </Segment>
    );
  }

  renderEditor() {
    const { type, data } = this.props;

    if (!type || !data)
      return false;

    switch (type.toLowerCase()) {
      case 'list':
      case 'set':
      case 'zset':
      case 'hash':
        return <CodeMirrorYamlObjectEditor
          params={ data }
          onChange={ this.handleEditorChange }
          onError={ this.handleEditorError }
        />;
      case 'string':
        return <CodeMirrorTextEditor 
          text={ data } 
          onChange={ this.handleEditorChange } 
        />;

      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  checkCanClickSave = () => {
    if (this.state.editorError)
      return false;
    if (this.state.dirtyData === undefined)
      return false;
    if (isEqual(this.props.data, this.state.dirtyData))
      return false;
    return true;
  };

  handleFetchKeyDataClicked = () => {
    const { type, selectedKey, onFetchKeyDataClick } = this.props;
    onFetchKeyDataClick(selectedKey, type);
  };

  handleEditorChange = nextValue => {
    // eslint-disable-next-line
    this.setState({ dirtyData: nextValue, editorError: false });
  };

  handleEditorError = message => {
    // eslint-disable-next-line
    this.setState({ editorError: message });
  };

  handleSaveClicked = () => {
    const { onSaveKeyDataClick, selectedKey, info, type, data } = this.props;
    const { dirtyData } = this.state;

    if (isEqual(data, dirtyData))
      return;

    onSaveKeyDataClick(
      selectedKey,
      type,
      data,
      dirtyData,
      info.pttl
    );
  };
}
