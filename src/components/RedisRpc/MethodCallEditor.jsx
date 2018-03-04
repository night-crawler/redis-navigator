import debug from 'debug';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Grid, Header, Segment } from 'semantic-ui-react';
import ReactJSONEditor from '../JsonEditor';
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
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('RedisRpcMethodCall');
        this.log('initialized', props);
        this.state = {
            methodName: null,
            methodProps: {},
        };
    }

    handleMethodNameChange = (e, { value }) => {
        const { inspections } = this.props;
        this.log('handleMethodNameChange', value, inspections[value]);
        this.setState({
            methodName: value,
            methodProps: inspections[value]
        });
    };

    handleClearSelectedMethodClick = () => {
        this.setState({
            methodName: null,
            methodProps: {}
        });
    };

    handleJsonChanged = (newVal) => {
        this.log(newVal);
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

    render() {
        this.log('render');
        const { methodName, methodProps } = this.state;
        const { routeInstanceName } = this.props;

        if (!methodName) {
            return <Segment content={ this.renderMethodDropdown() } />;
        }

        return (
            <Segment raised={ true } color='red'>
                <Header as='h2' block={ true }>
                    <Header.Content>
                        <Button
                            color='orange' icon='remove' size='huge'
                            onClick={ this.handleClearSelectedMethodClick } />
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
                        <ReactJSONEditor
                            json={ parametersToJson(methodProps.parameters) }
                            onChange={ this.handleJsonChanged }
                        />
                    </Grid.Column>

                    <Grid.Column width={ 1 }>
                        <Button fluid={ true }>Run</Button>
                    </Grid.Column>
                </Grid>


            </Segment>
        );
    }
}
