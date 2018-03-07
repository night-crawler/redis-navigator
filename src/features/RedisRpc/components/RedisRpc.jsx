import debug from 'debug';
import { isEmpty, filter } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Segment, Button, Icon } from 'semantic-ui-react';
import { COLORS } from 'semantic-ui-react/dist/es/lib/SUI';
import { uuid4 } from '../../../utils';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import RedisRpcMethodCallEditor from './MethodCallEditor';


export default class RedisRpc extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        routeInstanceName: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            handleBatchExecute: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        const { inspections } = props;
        debug.enable('*');
        this.log = debug('RedisRpc');
        this.log('initialized', props);
        this.state = {
            ddMethodsOptions: Object.entries(inspections).map(([fName, fOptions]) => {
                return {
                    key: fName,
                    text: fName,
                    value: fName,
                    content: <DropdownRpcMethodItem { ...fOptions } name={ fName } />
                };
            }),
            editorsOptions: [],
        };
    }

    componentDidMount() {
        const { editorsOptions } = this.state;
        isEmpty(editorsOptions) && this.appendEditorOptions();
    }

    render() {
        this.log('render');
        const { ddMethodsOptions } = this.state;

        if (isEmpty(ddMethodsOptions))
            return false;

        return (
            <Segment.Group>
                <Helmet><title>Call RPC method</title></Helmet>

                <Button.Group widths='4' attached='top'>
                    <Button basic={ true } color='red' onClick={ this.handleClearEditorsOptionsClicked }>
                        <Icon name='trash outline' />Clear
                    </Button>

                    <Button>Export</Button>
                    <Button>Import</Button>

                    <Button basic={ true } color='green' onClick={ this.handleExecuteAllClicked }>
                        <Icon name='lightning' />Execute
                    </Button>
                </Button.Group>

                { this.renderEditors() }

                <Button attached='bottom' icon='add' onClick={ this.handleAppendEditorClicked } />
            </Segment.Group>
        );
    }

    renderEditors() {
        return this.state.editorsOptions.map(((editorOptions, i) =>
            <RedisRpcMethodCallEditor
                color={ COLORS[i % COLORS.length] }
                { ...editorOptions }
                key={ editorOptions.key }
                onMethodNameChange={ methodName => this.handleMethodNameChanged(methodName, i) }
                onRemove={ () => this.handleMethodRemoveClicked(i) }
                onCallParamsChange={ newCallParams => this.handleCallParamsChanged(newCallParams, i) }
            />
        ));
    }

    handleClearEditorsOptionsClicked = () => this.setState({ editorsOptions: [] });

    handleAppendEditorClicked = () => this.appendEditorOptions();

    handleMethodNameChanged = (methodName, index) => {
        const { editorsOptions } = this.state;
        editorsOptions[index].methodName = methodName;
        this.setState({ editorsOptions });
    };

    handleMethodRemoveClicked = (index) => {
        const { editorsOptions } = this.state;
        editorsOptions.splice(index, 1);
        this.setState({ editorsOptions: [...editorsOptions] });
    };

    handleCallParamsChanged = (newCallParams, index) => {
        const { editorsOptions } = this.state;
        editorsOptions[index].callParams = newCallParams;
        this.setState({ editorsOptions });
    };

    handleExecuteAllClicked = () => {
        const { editorsOptions } = this.state;
        const { actions: handleBatchExecute } = this.props;

        console.log(this.getReadyEditors());
    };

    getReadyEditors() {
        const { editorsOptions } = this.state;
        return filter(editorsOptions, { result: undefined });
    }

    appendEditorOptions() {
        const { editorsOptions, ddMethodsOptions } = this.state;
        const { routeInstanceName, inspections } = this.props;

        const newEditorOptions = {
            key: uuid4(),
            instanceName: routeInstanceName,
            inspections,
            ddMethodsOptions,

            result: undefined,
            methodName: null,
            callParams: null,
        };

        this.setState({ editorsOptions: [...editorsOptions, newEditorOptions] });
    }
}
