import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Container, Dropdown, Grid, Header, Label, Segment } from 'semantic-ui-react';


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
                    { reprCallArgs(parameters) }
                </div>
            }

            { return_type && <div className='ui red basic button'>{ return_type }</div> }
            { doc && <div className='ui blue basic button'>{ doc }</div> }
        </div>

    );
}

function reprCallArgs(parameters) {
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


class RedisRpcMethodCall extends React.Component {
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

    renderMethodDropdown() {
        const { ddMethodProps } = this.props;

        return <Dropdown
            options={ ddMethodProps }
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
            <Segment>
                <Header as='h1'>
                    <div className='ui button' onClick={ this.handleClearSelectedMethodClick }>
                        <i className='icon remove' />
                    </div>

                    { routeInstanceName }.{ methodName }
                    { reprCallArgs(methodProps.parameters) }
                </Header>

                <Button fluid={ true }>Run</Button>
            </Segment>
        );
    }
}


export default class RedisRpc extends React.Component {
    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('RedisRpc');
        this.log('initialized', props);
        this.state = {
            cmd: null,
            ddMethodProps: [],
        };
    }

    componentDidMount() {
        this.prepareOptions();
    }

    prepareOptions() {
        const { inspections } = this.props;
        const ddMethodProps = Object.entries(inspections).map(([fName, fOptions]) => {
            return {
                key: fName,
                text: fName,
                value: fName,
                content: <DropdownRpcMethod { ...fOptions } name={ fName } />
            };
        });
        this.setState({ ddMethodProps });
    }

    render() {
        this.log('render');
        const { inspections, routeInstanceName } = this.props;
        const { ddMethodProps } = this.state;

        if (isEmpty(ddMethodProps))
            return false;

        return (
            <Container fluid={ true }>
                <Grid width={ 16 }>
                    <Grid.Column width={ 16 }>

                        <RedisRpcMethodCall
                            routeInstanceName={ routeInstanceName }
                            inspections={ inspections }
                            ddMethodProps={ ddMethodProps }
                        />

                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
