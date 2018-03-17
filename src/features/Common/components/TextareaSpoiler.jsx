import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


export const Textarea = styled.textarea`
    width: 100%;
`;


export default class TextareaSpoiler extends React.Component {
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
            return <div onClick={ this.handleShow } className='show-hidden'>Show</div>;
        }

        return (
            <div>
                <div onClick={ this.handleHide } className='hide-shown'>Hide</div>
                <Textarea rows={ 6 } value={ result } readOnly={ true } />
            </div>
        );
    }
}
