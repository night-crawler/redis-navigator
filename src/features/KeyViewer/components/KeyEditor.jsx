import { REDIS_KEY_TYPE_ICON_MAP } from 'constants';

import debug from 'debug';
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
      debug.enable('*');
      this.log = debug('KeyEditor');
      this.log('initialized', props);

      this.keyMapHandlers = { save: this.handleSaveClicked };
      this.keyMap = { save: 'ctrl+enter' };

      this.state = { dirtyData: undefined };
    }

    render() {
      const
        { type, selectedKey, info } = this.props,
        { editorError } = this.state;


      if (!selectedKey || !type)
        return <FullPageDimmer message={ <Tr { ...messages.selectAKey } /> } />;

      if (isEmpty(info))
        return <FullPageDimmer />;

      const iconName = (REDIS_KEY_TYPE_ICON_MAP[ type ] || { name: 'spinner' }).name;

      return (
        <Segment
          className='KeyEditor'
          as={ HotKeys } keyMap={ this.keyMap } handlers={ this.keyMapHandlers } focused={ true }
          basic={ true }
        >
          <Header as='h2'>
            <Icon name={ iconName } />
            { `[${type}] ${selectedKey}` }
          </Header>
          <KeyInfo { ...info } />

          <Button fluid={ true } onClick={ this.handleFetchKeyDataClicked }>
            <Icon name='refresh' />
            <Tr { ...messages.fetchKeyData } />
          </Button>

          { this.renderEditor() }

          <Button
            disabled={ !this.checkCanClickSave() } fluid={ true } primary={ true }
            onClick={ this.handleSaveClicked }
          >
            <Icon name='save' />
            { editorError
              ? <Tr { ...messages.syntaxError } />
              : <Tr { ...messages.save } />
            }
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
          return <CodeMirrorTextEditor text={ data } onChange={ this.handleEditorChange } />;

        default:
          throw new Error(`Unknown type: ${type}`);
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { data: nextData } = nextProps;
      const { data: prevData } = prevState;

      if (!isEqual(nextData, prevData)) {
        return { dirtyData: nextData };
      }
      return null;
    }

    checkCanClickSave = () => {
      const
        { data } = this.props,
        { dirtyData, editorError } = this.state;

      if (editorError)
        return false;
      if (isEqual(data, dirtyData))
        return false;

      return true;
    };

    handleFetchKeyDataClicked = () => {
      const { type, selectedKey, onFetchKeyDataClick } = this.props;
      onFetchKeyDataClick(selectedKey, type);
    };

    handleEditorChange = nextValue => {
      this.setState({ dirtyData: nextValue, editorError: false });
    };

    handleEditorError = message => {
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
