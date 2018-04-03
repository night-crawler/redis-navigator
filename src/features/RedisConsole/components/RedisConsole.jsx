import debug from 'debug';
import { find, isEmpty, map, zip } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { HotKeys } from 'react-hotkeys';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { COLORS } from 'semantic-ui-react/dist/es/lib/SUI';
import { saveFile } from 'utils';
import messages from '../messages';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import CommandImporter from './CommandImporter';
import MethodCallEditor from './MethodCallEditor';
import { FormattedMessage as Tr } from 'react-intl';


const ConsoleCommandType = PropTypes.shape({
    key: PropTypes.string,
    methodName: PropTypes.string,
    methodParams: PropTypes.object,
    response: PropTypes.any,
});

export default class RedisConsole extends React.Component {
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
            nothingToExecute: PropTypes.func,
        }),
    };

    keyMap = {
        executeAll: 'alt+x',
        clearCallEditors: 'alt+c',
        appendCallEditor: 'alt+a',
    };

    constructor(props) {
        super(props);
        const { inspections } = props;
        debug.enable('*');
        this.log = debug('RedisConsole');
        this.log('initialized', props);

        this.ddMethodsOptions = Object.entries(inspections).map(([fName, fOptions]) => ( {
            key: fName,
            text: fName,
            value: fName,
            content: <DropdownRpcMethodItem { ...fOptions } name={ fName } />
        } ));

        this.keyMapHandlers = {
            executeAll: this.handleExecuteAllClicked,
            clearCallEditors: this.handleClearCallEditorsClicked,
            appendCallEditor: this.handleAppendCallEditorClicked,
        };
    }

    render() {
        this.log('render');
        const { inspections, routeInstanceImportDialogIsVisible } = this.props;

        return (
            <HotKeys keyMap={ this.keyMap } handlers={ this.keyMapHandlers } focused={ true }>
                <Segment.Group>
                    <Helmet><title>RPC Console</title></Helmet>

                    { this.renderEditors() }

                    <Button.Group widths='5' attached='bottom'>
                        <Button basic={ true } color='grey' onClick={ this.handleAppendCallEditorClicked }>
                            <Icon name='add' />
                            <Tr { ...messages.append } />
                        </Button>

                        <Button basic={ true } color='grey' onClick={ this.handleExportClicked }>
                            <Icon name='external' />
                            <Tr { ...messages.export } />
                        </Button>

                        <Button basic={ true } color='grey' onClick={ this.handleImportClicked }>
                            <Icon name='download' />
                            <Tr { ...messages.import } />
                        </Button>

                        <Button basic={ true } color='red' onClick={ this.handleClearCallEditorsClicked }>
                            <Icon name='trash' />
                            <Tr { ...messages.clear } />
                        </Button>

                        <Button basic={ true } color='green' onClick={ this.handleExecuteAllClicked }>
                            <Icon name='lightning' />
                            <Tr { ...messages.execute } />
                        </Button>
                    </Button.Group>

                    {
                        routeInstanceImportDialogIsVisible &&
                        <Segment attached='top'>
                            <CommandImporter inspections={ inspections } onImport={ this.handleImport } />
                        </Segment>
                    }


                </Segment.Group>
            </HotKeys>
        );
    }

    componentDidMount() {
        const { routeConsoleCommands } = this.props;
        isEmpty(routeConsoleCommands) && this.appendMethodCallEditor();
    }

    renderEditors() {
        const { routeConsoleCommands, inspections, actions, routeInstanceName } = this.props;

        return routeConsoleCommands.map(editorOptions =>
            <MethodCallEditor
                { ...editorOptions }

                key={ editorOptions.key }
                instanceName={ routeInstanceName }
                inspections={ inspections }
                ddMethodsOptions={ this.ddMethodsOptions }

                onRemove={
                    () => actions.removeCallEditor(routeInstanceName, editorOptions.key)
                }
                onMethodNameChange={
                    methodName => actions.changeCallEditorMethodName(routeInstanceName, methodName, editorOptions.key)
                }
                onMethodParamsChange={
                    methodParams => actions.changeCallEditorMethodParams(routeInstanceName, methodParams, editorOptions.key)
                }
                onRetry={
                    () => this.handleCallEditorRetryClicked(editorOptions.key)
                }
            />
        );
    }

    handleExportClicked = () => {
        const { routeConsoleCommands } = this.props;
        saveFile(
            'consoleCommands.json',
            JSON.stringify(routeConsoleCommands, null, 4)
        );
    };

    handleImportClicked = () => {
        const { actions, routeInstanceName } = this.props;
        actions.toggleImportDialogVisible(routeInstanceName);
    };

    handleImport = (commands) => {
        const { actions, routeInstanceName } = this.props;
        commands.forEach((command, i)=> {
            actions.appendCallEditor({
                instanceName: routeInstanceName,
                color: COLORS[i % COLORS.length],
                ...command
            });
        });
        actions.toggleImportDialogVisible(routeInstanceName);
    };

    handleCallEditorRetryClicked = (key) => {
        const { routeConsoleCommands } = this.props;
        const cmd = find(routeConsoleCommands, { key });
        this.handleBatchExecute([cmd]);
    };

    handleClearCallEditorsClicked = () => {
        const { actions, routeInstanceName } = this.props;
        actions.clearCallEditors(routeInstanceName);
    };

    handleAppendCallEditorClicked = () => this.appendMethodCallEditor();

    handleBatchExecute(commands) {
        const { routeInstanceName, actions } = this.props;
        const cmdPairBundles = commands.map(cmd => [cmd.methodName, cmd.methodParams]);

        actions.batchExecute(...cmdPairBundles)
            .then(data =>
                zip(map(commands, 'key'), map(data.meta.request, 'id'))
                    .forEach(([key, id]) =>
                        actions.bindCallEditorToId(routeInstanceName, key, id))
            );
    }

    handleExecuteAllClicked = () => {
        const {
                routeConsoleCommandsToExecute: commands,
                notifications,
            } = this.props,
            cmdPairBundles = commands.map(cmd => [cmd.methodName, cmd.methodParams]);

        if (isEmpty(cmdPairBundles))
            return notifications.nothingToExecute();

        this.handleBatchExecute(commands);
    };

    appendMethodCallEditor() {
        const { routeInstanceName, actions, routeConsoleCommands } = this.props;
        actions.appendCallEditor({
            instanceName: routeInstanceName,
            color: COLORS[routeConsoleCommands.length % COLORS.length],
        });
    }

}
