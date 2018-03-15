import { isArray, isBoolean, isPlainObject, isString, size } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ReactJson from 'react-json-view';
import { Card, Header, Segment } from 'semantic-ui-react';
import { isBase64, isJson } from '../../../utils';


const Textarea = styled.textarea`
    width: 100%;
`;



class TextareaSpoiler extends React.Component{
    static propTypes = {
        result: PropTypes.any.isRequired,
        show: PropTypes.bool,
    };
    static defaultProps = { show: false };
    state = { isShown: false };

    componentDidMount() {
        const { show } = this.props;
        this.handleSetShown(show);
    }

    handleSetShown = isShown => this.setState({ isShown });
    handleShow = () => this.handleSetShown(true);
    handleHide = () => this.handleSetShown(false);

    render() {
        const { result } = this.props;
        const { isShown } = this.state;

        if (!isShown) {
            return <div onClick={ this.handleShow }>Show</div>;
        }

        return (
            <div>
                <div onClick={ this.handleHide }>Hide</div>
                <Textarea rows={ 6 }>{ result }</Textarea>
            </div>
        );
    }
}


function BooleanCard(props) {
    const { result } = props;
    return <Card header='Boolean' description={ `${result}` } />;
}



function ReactJsonCard(props) {
    const { result, groupArraysAfterLength = 20 } = props;
    return (
        <Card fluid={ true }>
            <Card.Content header='Object' />
            <Card.Description>
                <ReactJson
                    src={ result }
                    groupArraysAfterLength={ groupArraysAfterLength }
                    name={ false }
                />
            </Card.Description>
        </Card>
    );
}


function StringCard(props) {
    const { result } = props;

    let innerResult = false, type = '';

    if (isBase64(result)) {
        innerResult = atob(result);
        type = 'base64';
    } else if (isJson(result)) {
        innerResult = JSON.parse(result);
        type = 'json';
    }

    if (innerResult) {
        return (
            <Segment basic={ true }>
                <Header as='h5'>String[{ result.length }], { type }</Header>
                <TextareaSpoiler className='left floated' result={ result } />
                { <RpcResult result={ innerResult } /> }
            </Segment>
        );
    }

    return (
        <Card fluid={ true }>
            <Card.Content>
                <Card.Header>String[{ result.length }]{ type ? ', ' : '' }{ type }</Card.Header>
                <Card.Description>
                    { result }
                </Card.Description>
            </Card.Content>
        </Card>
    );
}


RpcResult.propTypes = {
    result: PropTypes.any,
};

function RpcResult(props) {
    const { result } = props;

    if (isBoolean(result))
        return <BooleanCard result={ result } />;

    if (isString(result))
        return <StringCard result={ result } />;

    if (isArray(result))
        return <ReactJsonCard result={ result } />;

    if (isPlainObject(result))
        return <ReactJsonCard result={ result } />;

    return <div>{ result }</div>;
}

RpcError.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string,
        data: PropTypes.any,
    }),
};

function RpcError(props) {
    const { error } = props;
    const errorRepr = isArray(error.data) || isPlainObject(error.data)
        ? <ReactJson src={ error.data } name={ false } />
        : <div>{ error.data }</div>;

    return (
        <div>
            <Header as='h4'>
                <Header.Content>{ error.message }</Header.Content>
                <Header.Subheader>Code: { error.code }</Header.Subheader>
            </Header>
            { errorRepr }
        </div>
    );
}


RpcResponse.propTypes = {
    response: PropTypes.shape({
        error: PropTypes.any,
        result: PropTypes.any,
    })
};
export default function RpcResponse(props) {
    const { response: { result, error } } = props;
    if (result !== undefined) {
        return <RpcResult result={ result } />;
    }
    if (error !== undefined) {
        return <RpcError error={ error } />;
    }
    return <div>Command is not executed yet...</div>;
}