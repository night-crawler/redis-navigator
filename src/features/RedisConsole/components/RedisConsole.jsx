import { find, isEmpty, map, zip } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { HotKeys } from 'react-hotkeys';
import { FormattedMessage as Tr } from 'react-intl';
import { Button, Icon, Segment } from 'semantic-ui-react';

import { SUI_COLORS as COLORS } from '~/utils/semanticConstants';

import { saveFile } from '~/utils';

import messages from '../messages';

import { CommandImporter } from './CommandImporter';
import { DropdownRpcMethodItem } from './DropdownRpcMethodItem';
import { MethodCallEditor } from './MethodCallEditor';


const i18nNothingToExecute = <Tr { ...messages.nothingToExecute } />;
const i18nChangeSomething = <Tr { ...messages.changeSomething } />;
const i18nAppend = <Tr { ...messages.append } />;
const i18nExport = <Tr { ...messages.export } />;
const i18nImport = <Tr { ...messages.import } />;
const i18nClear = <Tr { ...messages.clear } />;
const i18nExecute = <Tr { ...messages.execute } />;


const ConsoleCommandType = PropTypes.shape({
  key: PropTypes.string,
  methodName: PropTypes.string,
  methodParams: PropTypes.object,
  response: PropTypes.any,
});

export class RedisConsole extends React.Component {
    static propTypes = {
      inspections: PropTypes.object.isRequired,

      routeInstanceName: PropTypes.string.isRequired,
      routeInstanceImportDialogIsVisible: PropTypes.bool,

      routeConsoleCommands: PropTypes.arrayOf(ConsoleCommandType),
      routeConsoleCommandsToExecute: PropTypes.arrayOf(ConsoleCommandType),

      actions: PropTypes.shape({
        batchExecute: PropTypes.func.isRequired,

        appendCallEditor: PropTypes.func.isRequired,
        removeCallEditor: PropTypes.func.isRequired,
        changeCallEditorMethodName: PropTypes.func.isRequired,
        changeCallEditorMethodParams: PropTypes.func.isRequired,
        clearCallEditors: PropTypes.func.isRequired,
        bindCallEditorToId: PropTypes.func.isRequired,
        toggleImportDialogVisible: PropTypes.func,
      }).isRequired,

      notifications: PropTypes.shape({
        warning: PropTypes.func,
      }),
    };

    keyMap = {
      executeAll: 'alt+x',
      clearCallEditors: 'alt+c',
      appendCallEditor: 'alt+a',
    };

    constructor(props) {
      super(props);
      this.ddMethodsOptions = Object.entries(props.inspections).map(([ fName, fOptions ]) => ({
        key: fName,
        text: fName,
        value: fName,
        content: <DropdownRpcMethodItem { ...fOptions } name={ fName } />
      }));

      this.keyMapHandlers = {
        executeAll: this.handleExecuteAllClicked,
        clearCallEditors: this.handleClearCallEditorsClicked,
        appendCallEditor: this.handleAppendCallEditorClicked,
      };
    }

    render() {
      return (
        <Segment.Group
          className='RedisConsole'
          as={ HotKeys } keyMap={ this.keyMap } handlers={ this.keyMapHandlers } focused={ true }
        >
          <Helmet><title>RPC Console</title></Helmet>

          { this.renderEditors() }
          { this.renderButtons() }

          { this.props.routeInstanceImportDialogIsVisible &&
            <Segment attached='top'>
              <CommandImporter 
                inspections={ this.props.inspections } 
                onImport={ this.handleImport } 
              />
            </Segment> }
        </Segment.Group>
      );
    }

    componentDidMount() {
      isEmpty(this.props.routeConsoleCommands) && 
        this.appendMethodCallEditor();
    }

    renderButtons() {
      return (
        <Button.Group widths='5' attached='bottom'>
          <Button 
            basic={ true } color='grey' icon='add'
            onClick={ this.handleAppendCallEditorClicked }
            content={ i18nAppend }
          />

          <Button 
            basic={ true } color='grey' icon='external'
            onClick={ this.handleExportClicked }
            content={ i18nExport }
          />

          <Button 
            basic={ true } color='grey' icon='download'
            onClick={ this.handleImportClicked }
            content={ i18nImport }
          />

          <Button 
            basic={ true } color='red' icon='trash'
            onClick={ this.handleClearCallEditorsClicked }
            content={ i18nClear }
          />

          <Button 
            basic={ true } color='green' icon='lightning'
            onClick={ this.handleExecuteAllClicked }
            content={ i18nExecute }
          />
        </Button.Group>
      );
    }

    renderEditors() {
      return this.props.routeConsoleCommands.map(editorOptions =>
        <MethodCallEditor
          { ...editorOptions }

          key={ editorOptions.key }
          instanceName={ this.props.routeInstanceName }
          inspections={ this.props.inspections }
          ddMethodsOptions={ this.ddMethodsOptions }

          onRemove={ () => 
            this.props.actions.removeCallEditor(this.props.routeInstanceName, editorOptions.key) 
          }
          onMethodNameChange={ methodName => this.props.actions.changeCallEditorMethodName(
            this.props.routeInstanceName, methodName, editorOptions.key) 
          }
          onMethodParamsChange={ methodParams => this.props.actions.changeCallEditorMethodParams(
            this.props.routeInstanceName, methodParams, editorOptions.key)
          }
          onRetry={ () => this.handleCallEditorRetryClicked(editorOptions.key) }
        />
      );
    }

    handleExportClicked = () => saveFile(
      'consoleCommands.json',
      JSON.stringify(this.props.routeConsoleCommands, null, 4)
    );

    handleImportClicked = () => 
      this.props.actions.toggleImportDialogVisible(this.props.routeInstanceName);

    handleImport = (commands) => {
      commands.forEach((command, i) => {
        this.props.actions.appendCallEditor({
          instanceName: this.props.routeInstanceName,
          color: COLORS[ i % COLORS.length ],
          ...command
        });
      });
      this.props.actions.toggleImportDialogVisible(this.props.routeInstanceName);
    };

    handleCallEditorRetryClicked = key => {
      const cmd = find(this.props.routeConsoleCommands, { key });
      this.handleBatchExecute([ cmd ]);
    };

    handleClearCallEditorsClicked = () => 
      this.props.actions.clearCallEditors(this.props.routeInstanceName);

    handleAppendCallEditorClicked = () => this.appendMethodCallEditor();

    handleBatchExecute(commands) {
      const { routeInstanceName, actions } = this.props;
      const cmdPairBundles = commands.map(cmd => [ cmd.methodName, cmd.methodParams ]);

      actions.batchExecute(...cmdPairBundles)
        .then(data =>
          zip(map(commands, 'key'), map(data.meta.request, 'id'))
            .forEach(([ key, id ]) =>
              actions.bindCallEditorToId(routeInstanceName, key, id))
        );
    }

    handleExecuteAllClicked = () => {
      const {
          routeConsoleCommandsToExecute: commands,
          notifications,
        } = this.props,
        cmdPairBundles = commands.map(cmd => [ cmd.methodName, cmd.methodParams ]);

      if (isEmpty(cmdPairBundles))
        return notifications.warning({
          title: i18nNothingToExecute,
          message: i18nChangeSomething,
        });

      this.handleBatchExecute(commands);
    };

    appendMethodCallEditor = () =>
      this.props.actions.appendCallEditor({
        instanceName: this.props.routeInstanceName,
        color: COLORS[ this.props.routeConsoleCommands.length % COLORS.length ],
      });
}
