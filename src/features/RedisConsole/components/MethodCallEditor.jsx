import { isEqual } from 'lodash';
import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import ReactJson from 'react-json-view';
import { Button, Dropdown, Grid, Header, Segment, Label } from 'semantic-ui-react';
import { parametersToJson, reprMethodArgs, reprMethodDoc } from './utils';
import RpcResponse from './RpcResponse';


export default class MethodCallEditor extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        ddMethodsOptions: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            content: PropTypes.element.isRequired,
        })).isRequired,
        instanceName: PropTypes.string.isRequired,
        isFinished: PropTypes.bool,
        color: PropTypes.string,
        methodName: PropTypes.string,
        methodParams: PropTypes.object,
        response: PropTypes.shape({
            result: PropTypes.any,
            error: PropTypes.any,
        }),
        dirty: PropTypes.bool,

        onMethodNameChange: PropTypes.func,
        onMethodParamsChange: PropTypes.func,
        onRemove: PropTypes.func,
        onRetry: PropTypes.func,
    };

    static defaultProps = {
        color: 'red',
        isFinished: false,
        methodName: null,
        onMethodNameChange: () => {},
        onMethodParamsChange: () => {},
        onRemove: () => {},
        onRetry: () => {},
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('MethodCallEditor');
        this.log('initialized', props);
    }

    componentWillReceiveProps(newProps) {
        const { onMethodParamsChange } = this.props;

        const { methodName, methodParams, inspections } = newProps;
        const methodProps = inspections[methodName];

        if (methodProps && methodName && !methodParams) {
            onMethodParamsChange(parametersToJson(methodProps.parameters));
        }
    }

    isSuccess() {
        const { response } = this.props;
        if (!response)
            return false;

        if (response.result !== undefined)
            return true;

        if (response.error !== undefined)
            return false;

        return false;
    }

    render() {
        this.log('render');
        const {
            methodName, methodParams, response, dirty,
            instanceName, color, inspections,
            onRemove, onRetry
        } = this.props;

        if (!methodName)
            return this.renderMethodSelector();

        const methodProps = inspections[methodName];

        if (!methodParams)
            return false;

        return (
            <Segment raised={ true } color={ color }>
                <Header as='h2' block={ true } color={ this.isSuccess() && !dirty ? 'green' : undefined }>
                    <Header.Content>
                        <Button
                            basic={ true } color='orange' icon='remove' size='huge'
                            onClick={ onRemove }
                        />
                    </Header.Content>
                    <Header.Content>
                        { instanceName }.{ methodName }
                        { reprMethodArgs(methodProps.parameters) }
                        <Button as={ Label } icon='repeat' color='orange' basic={ true } circular={ true } onClick={ onRetry } />
                    </Header.Content>
                    <Header.Subheader>
                        { reprMethodDoc(methodProps.doc) }
                    </Header.Subheader>

                </Header>

                <Grid stackable={ true }>
                    <Grid.Column width={ 6 }>
                        <ReactJson
                            src={ methodParams }
                            name='params'
                            onEdit={ this.handleJsonChanged }
                            onAdd={ this.handleJsonChanged }
                            onDelete={ this.handleJsonChanged }
                        />
                    </Grid.Column>
                    {
                        response && (
                            <Grid.Column width={ 10 }>
                                <RpcResponse response={ response } />
                            </Grid.Column>
                        )
                    }
                </Grid>


            </Segment>
        );
    }

    handleMethodNameChanged = (e, { value }) => {
        const { onMethodNameChange } = this.props;
        onMethodNameChange(value);
    };

    handleJsonChanged = ({ updated_src }) => {
        const { onMethodParamsChange } = this.props;
        onMethodParamsChange(updated_src);
    };

    renderMethodSelector() {
        const { instanceName, color, onRemove } = this.props;

        return (
            <Segment raised={ true } color={ color }>
                <Header as='h2' block={ true }>
                    <Header.Content>
                        <Button
                            basic={ true } color='orange' icon='remove' size='huge'
                            onClick={ onRemove }
                        />
                    </Header.Content>
                    <Header.Content>{ instanceName }.?</Header.Content>
                </Header>
                { this.renderMethodDropdown() }
            </Segment>
        );
    }

    renderMethodDropdown() {
        const { ddMethodsOptions } = this.props;
        return <Dropdown
            options={ ddMethodsOptions }
            placeholder='Find command'
            search={ true }
            fluid={ true }
            selection={ true }
            onChange={ this.handleMethodNameChanged }
            selectOnNavigation={ false }
        />;
    }

}
