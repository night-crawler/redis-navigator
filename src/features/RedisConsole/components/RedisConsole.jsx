import debug from 'debug';
import { isEmpty, map, zip, fromPairs } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Segment, Button, Icon } from 'semantic-ui-react';
import { COLORS } from 'semantic-ui-react/dist/es/lib/SUI';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import MethodCallEditor from './MethodCallEditor';


const ConsoleCommandType = PropTypes.shape({
    key: PropTypes.string,
    methodName: PropTypes.string,
    methodParams: PropTypes.object,
    result: PropTypes.any,
});

export default class RedisConsole extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        routeInstanceName: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            batchExecute: PropTypes.func.isRequired,

            appendCallEditor: PropTypes.func.isRequired,
            removeCallEditor: PropTypes.func.isRequired,
            changeCallEditorMethodName: PropTypes.func.isRequired,
            changeCallEditorMethodParams: PropTypes.func.isRequired,
            clearCallEditors: PropTypes.func.isRequired,
        }).isRequired,
        routeConsoleCommands: PropTypes.arrayOf(ConsoleCommandType),
        routeConsoleCommandsToExecute: PropTypes.arrayOf(ConsoleCommandType),
    };

    constructor(props) {
        super(props);
        const { inspections } = props;
        debug.enable('*');
        this.log = debug('RedisConsole');
        this.log('initialized', props);

        this.ddMethodsOptions = Object.entries(inspections).map(([fName, fOptions]) => {
            return {
                key: fName,
                text: fName,
                value: fName,
                content: <DropdownRpcMethodItem { ...fOptions } name={ fName } />
            };
        });

        this.state = {
            editorsOptions: [],
        };
    }

    componentDidMount() {
        const { routeConsoleCommands } = this.props;
        isEmpty(routeConsoleCommands) && this.appendMethodCallEditor();
    }

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

                    <Button basic={ true } color='grey'>
                        <Icon name='external' />Export
                    </Button>
                    <Button basic={ true } color='grey'>
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
                color={ COLORS[i % COLORS.length] }
                key={ editorOptions.key }
                instanceName={ routeInstanceName }
                { ...editorOptions }
                ddMethodsOptions={ this.ddMethodsOptions }
                inspections={ inspections }
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
        const
            { routeConsoleCommandsToExecute: commands } = this.props,
            cmdPairBundles = commands.map(cmd => [ cmd.methodName, cmd.methodParams ]);

        const response = this.props.actions.batchExecute(
            this.props.routeInstanceName,
            ...cmdPairBundles
        );

        response.then((data) => {
            const idToKeyMap = fromPairs(zip(
                map(data.meta.request, 'id'),
                map(commands, 'key')
            ));

            console.log(idToKeyMap);
        });

    };

    appendMethodCallEditor() {
        const { routeInstanceName, actions } = this.props;
        actions.appendCallEditor(routeInstanceName);
    }
}
