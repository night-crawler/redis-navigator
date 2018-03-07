import debug from 'debug';
import { isEmpty, filter } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Segment, Button, Icon } from 'semantic-ui-react';
import { COLORS } from 'semantic-ui-react/dist/es/lib/SUI';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import MethodCallEditor from './MethodCallEditor';


export default class RedisConsole extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        routeInstanceName: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            handleBatchExecute: PropTypes.func.isRequired,

            appendCallEditor: PropTypes.func.isRequired,
            removeCallEditor: PropTypes.func.isRequired,
            changeCallEditorMethodName: PropTypes.func.isRequired,
            changeCallEditorMethodParams: PropTypes.func.isRequired,
            clearCallEditors: PropTypes.func.isRequired,
        }).isRequired,
        routeConsoleCommands: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            methodName: PropTypes.string,
            methodParams: PropTypes.object,
            result: PropTypes.any,
        })),
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

                <Button.Group widths='4' attached='top'>
                    <Button basic={ true } color='red' onClick={ this.handleClearCallEditorsClicked }>
                        <Icon name='trash outline' />Clear
                    </Button>

                    <Button>Export</Button>
                    <Button>Import</Button>

                    <Button basic={ true } color='green' onClick={ this.handleExecuteAllClicked }>
                        <Icon name='lightning' />Execute
                    </Button>
                </Button.Group>

                { this.renderEditors() }

                <Button attached='bottom' icon='add' onClick={ this.handleAppendCallEditorClicked } />
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
        const { editorsOptions } = this.state;
        const { actions: handleBatchExecute } = this.props;
    };

    appendMethodCallEditor() {
        const { routeInstanceName, actions } = this.props;
        actions.appendCallEditor(routeInstanceName);
    }
}
