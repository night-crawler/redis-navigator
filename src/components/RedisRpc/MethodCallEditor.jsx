import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import ReactJson from 'react-json-view';
import { Button, Dropdown, Grid, Header, Segment } from 'semantic-ui-react';
import { parametersToJson, reprMethodArgs, reprMethodDoc } from './utils';


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
        json: PropTypes.object,

        onMethodNameChange: PropTypes.func,
        onJsonChange: PropTypes.func,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        color: 'red',
        isFinished: false,
        methodName: null,
        onMethodNameChange: () => {},
        onJsonChange: () => {},
        onRemove: () => {},
    };

    constructor(props) {
        super(props);
        const { methodName, inspections } = props;

        debug.enable('*');
        this.log = debug('RedisRpcMethodCall');
        this.log('initialized', props);
        this.state = {
            methodName,
            methodProps: methodName ? inspections[methodName] : [],
        };
    }

    render() {
        this.log('render');
        const { methodName, methodProps } = this.state;
        const { instanceName, color, onRemove, json } = this.props;

        if (!methodName)
            return this.renderMethodSelector();

        const jsonParameters = json || parametersToJson(methodProps.parameters);

        return (
            <Segment raised={ true } color={ color }>
                <Header as='h2' block={ true }>
                    <Header.Content>
                        <Button
                            color='orange' icon='remove' size='huge'
                            onClick={ onRemove }
                        />
                    </Header.Content>
                    <Header.Content>
                        { instanceName }.{ methodName }
                        { reprMethodArgs(methodProps.parameters) }
                    </Header.Content>
                    <Header.Subheader>
                        { reprMethodDoc(methodProps.doc) }
                    </Header.Subheader>
                </Header>


                <Grid>
                    <Grid.Column width={ 6 }>
                        <ReactJson
                            src={ jsonParameters }
                            name='params'
                            onEdit={ this.handleJsonChanged }
                            onAdd={ () => null }
                            onDelete={ () => null }
                        />
                    </Grid.Column>
                </Grid>


            </Segment>
        );
    }

    handleMethodNameChanged = (e, { value }) => {
        const { inspections, onMethodNameChange } = this.props;
        this.setState({
            methodName: value,
            methodProps: inspections[value]
        });
        onMethodNameChange(value);
    };

    handleJsonChanged = ({ updated_src }) => {
        const { onJsonChange } = this.props;
        onJsonChange(updated_src);
    };

    renderMethodSelector() {
        const { instanceName, color, onRemove } = this.props;

        return (
            <Segment raised={ true } color={ color }>
                <Header as='h2' block={ true }>
                    <Header.Content>
                        <Button
                            color='orange' icon='remove' size='huge'
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
        />;
    }

}
