import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Segment, Button, Icon } from 'semantic-ui-react';
import { COLORS } from 'semantic-ui-react/dist/es/lib/SUI';
import { uuid4 } from '../../utils';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import RedisRpcMethodCallEditor from './MethodCallEditor';


export default class RedisRpc extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        routeInstanceName: PropTypes.string.isRequired,
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

                    <Button basic={ true } color='green'>
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
                onJsonChange={ newJson => this.handleJsonChanged(newJson, i) }
            />
        ));
    }

    handleClearEditorsOptionsClicked = () => {
        this.setState({ editorsOptions: [] });
    };

    appendEditorOptions() {
        const { editorsOptions, ddMethodsOptions } = this.state;
        const { routeInstanceName, inspections } = this.props;

        const newEditorOptions = {
            key: uuid4(),
            instanceName: routeInstanceName,
            inspections,
            ddMethodsOptions,

            result: null,
            methodName: null,
            json: null,
        };

        this.setState({ editorsOptions: [...editorsOptions, newEditorOptions] });
    }

    handleAppendEditorClicked = () => {
        this.appendEditorOptions();
    };

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

    handleJsonChanged = (newJson, index) => {
        const { editorsOptions } = this.state;
        editorsOptions[index].json = newJson;
        this.setState({ editorsOptions });
    }
}
