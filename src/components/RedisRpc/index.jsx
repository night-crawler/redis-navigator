import debug from 'debug';
import { isEmpty, compact } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Grid, Header, Segment } from 'semantic-ui-react';
import ReactJSONEditor from '../JsonEditor';


DropdownRpcMethod.propTypes = {
    // return_type: PropTypes.oneOfType([PropTypes.string, null]),
    name: PropTypes.string.isRequired,
    return_type: PropTypes.any,
    doc: PropTypes.any,
    parameters: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        kind: PropTypes.string.isRequired,
        default: PropTypes.any,
        type: PropTypes.any,
    })),
};

function DropdownRpcMethod(props) {
    const { name, return_type, doc, parameters } = props;
    return (
        <div className='ui mini buttons'>
            <div className='ui blue button'>{ name }</div>

            {
                parameters.length &&
                <div className='ui blue basic button' style={ { padding: 2 } }>
                    { reprMethodArgs(parameters) }
                </div>
            }

            { return_type && <div className='ui red basic button'>{ return_type }</div> }
            { doc && <div className='ui blue basic button'>{ doc }</div> }
        </div>

    );
}

function reprMethodArgs(parameters) {
    return parameters.map(({ name, kind, default: default_, type }, i) => {
        const color = kind === 'KEYWORD_ONLY' ? 'red' : '';
        const varPositional = kind === 'VAR_POSITIONAL' ? '*' : '';
        const varKeyword = kind === 'VAR_KEYWORD' ? '**' : '';
        return (
            <span className={ `ui basic ${color} label` } key={ i }>
                { varPositional || varKeyword }{ name }{ type && `:${type}` }
                { default_ && `=${default_}` }
            </span>
        );
    });
}

function parametersToJson(parameters) {
    const mappedParams = {};
    parameters.forEach(({ name, kind, default: default_, type }) => {
        let val = default_ || '';
        if (kind === 'VAR_POSITIONAL')
            val = default_ || [];
        if (kind === 'VAR_KEYWORD')
            val = default_ || {};

        console.log(name, kind, default_, type, '?', val);
        mappedParams[name] = val;
    });
    console.log(mappedParams);
    return mappedParams;
}


class RedisRpcMethodCall extends React.Component {
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
                        <pre style={ { 'lineHeight': 1 } }>{ methodProps.doc.trim() }</pre>
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


export default class RedisRpc extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        routeInstanceName: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('RedisRpc');
        this.log('initialized', props);
        this.state = {
            cmd: null,
            ddMethodsOptions: [],
        };
    }

    componentDidMount() {
        this.prepareOptions();
    }

    prepareOptions() {
        const { inspections } = this.props;
        const ddMethodsOptions = Object.entries(inspections).map(([fName, fOptions]) => {
            return {
                key: fName,
                text: fName,
                value: fName,
                content: <DropdownRpcMethod { ...fOptions } name={ fName } />
            };
        });
        this.setState({ ddMethodsOptions });
    }

    render() {
        this.log('render');
        const { inspections, routeInstanceName } = this.props;
        const { ddMethodsOptions } = this.state;

        if (isEmpty(ddMethodsOptions))
            return false;

        return (
            <Segment.Group>
                <RedisRpcMethodCall
                    routeInstanceName={ routeInstanceName }
                    inspections={ inspections }
                    ddMethodsOptions={ ddMethodsOptions }
                />
            </Segment.Group>
        );
    }
}
