import debug from 'debug';
import { isEmpty, map, zip } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { success } from 'react-notification-system-redux';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { COLORS } from 'semantic-ui-react/dist/es/lib/SUI';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import MethodCallEditor from './MethodCallEditor';


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
        }).isRequired,

        notifications: PropTypes.shape({
            nothingToExecute: PropTypes.func,
        }),
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
    }

    componentDidMount() {
        const { routeConsoleCommands } = this.props;
        isEmpty(routeConsoleCommands) && this.appendMethodCallEditor();
    }

    handleExportClicked = () => {};
    handleImportClicked = () => {};

    render() {
        this.log('render');

        return (
            <Segment.Group>
                <Helmet><title>RPC Console</title></Helmet>

                { this.renderEditors() }

                <Button.Group widths='5' attached='bottom'>
                    <Button basic={ true } color='grey' onClick={ this.handleAppendCallEditorClicked }>
                        <Icon name='add' />Append
                    </Button>

                    <Button basic={ true } color='grey' onClick={ this.handleExportClicked  }>
                        <Icon name='external' />Export
                    </Button>
                    <Button basic={ true } color='grey' onClick={ this.handleImportClicked }>
                        <Icon name='download' />Import
                    </Button>

                    <Button basic={ true } color='red' onClick={ this.handleClearCallEditorsClicked }>
                        <Icon name='trash outline' />Clear
                    </Button>

                    <Button basic={ true } color='green' onClick={ this.handleExecuteAllClicked }>
                        <Icon name='lightning' />Execute
                    </Button>
                </Button.Group>

            </Segment.Group>
        );
    }

    renderEditors() {
        const { routeConsoleCommands, inspections, actions, routeInstanceName } = this.props;

        return routeConsoleCommands.map((editorOptions, i) =>
            <MethodCallEditor
                { ...editorOptions }

                key={ editorOptions.key }
                instanceName={ routeInstanceName }
                inspections={ inspections }
                color={ COLORS[i % COLORS.length] }
                ddMethodsOptions={ this.ddMethodsOptions }

                onRemove={ () => actions.removeCallEditor(routeInstanceName, i) }
                onMethodNameChange={
                    methodName => actions.changeCallEditorMethodName(routeInstanceName, methodName, i)
                }
                onMethodParamsChange={
                    methodParams => actions.changeCallEditorMethodParams(routeInstanceName, methodParams, i)
                }
            />
        );
    }

    handleClearCallEditorsClicked = () => {
        const { actions, routeInstanceName } = this.props;
        actions.clearCallEditors(routeInstanceName);
    };

    handleAppendCallEditorClicked = () => this.appendMethodCallEditor();

    handleExecuteAllClicked = () => {
        const {
                routeConsoleCommandsToExecute: commands,
                routeInstanceName,
                actions: { bindCallEditorToId, batchExecute },
                notifications: { nothingToExecute },
            } = this.props,
            cmdPairBundles = commands.map(cmd => [cmd.methodName, cmd.methodParams]);

        // console.log(cmdPairBundles);
        if (isEmpty(cmdPairBundles))
            return nothingToExecute();

        batchExecute(routeInstanceName, ...cmdPairBundles)
            .then((data) => {
                zip(map(commands, 'key'), map(data.meta.request, 'id'))
                    .forEach(([key, id]) =>
                        bindCallEditorToId(routeInstanceName, key, id));
            });
    };

    appendMethodCallEditor() {
        const { routeInstanceName, actions } = this.props;
        actions.appendCallEditor(routeInstanceName);
    }
}
