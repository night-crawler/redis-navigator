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
        routeInstanceName: PropTypes.string.isRequired,
        isFinished: PropTypes.bool,
        color: PropTypes.string,
        methodName: PropTypes.string,

        onMethodNameChange: PropTypes.func,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        color: 'red',
        isFinished: false,
        methodName: null,
        onMethodNameChange: () => {},
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
        const { routeInstanceName, color, onRemove } = this.props;

        if (!methodName) {
            return (
                <Segment raised={ true } color={ color }>
                    <Header as='h2' block={ true }>
                        <Header.Content>
                            <Button
                                color='orange' icon='remove' size='huge'
                                onClick={ onRemove }
                            />
                        </Header.Content>
                        <Header.Content>{ routeInstanceName }.?</Header.Content>
                    </Header>
                    { this.renderMethodDropdown() }
                </Segment>
            );
        }
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
                        { routeInstanceName }.{ methodName }
                        { reprMethodArgs(methodProps.parameters) }
                    </Header.Content>
                    <Header.Subheader>
                        { reprMethodDoc(methodProps.doc) }
                    </Header.Subheader>
                </Header>


                <Grid>
                    <Grid.Column width={ 6 }>
                        <ReactJson
                            src={ parametersToJson(methodProps.parameters) }
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

    handleMethodNameChange = (e, { value }) => {
        const { inspections, onMethodNameChange } = this.props;
        this.setState({
            methodName: value,
            methodProps: inspections[value]
        });
        onMethodNameChange(value);
    };

    handleJsonChanged = ({ updated_src }) => {
        this.log('handleJsonChanged', updated_src);
    };

    renderMethodDropdown() {
        const { ddMethodsOptions } = this.props;
        return <Dropdown
            options={ ddMethodsOptions }
            placeholder='Find command'
            search={ true }
            fluid={ true }
            selection={ true }
            onChange={ this.handleMethodNameChange }
        />;
    }

}
