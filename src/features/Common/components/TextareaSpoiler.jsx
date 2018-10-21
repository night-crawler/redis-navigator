import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import styled from 'styled-components';

import messages from '../messages';

import './TextareaSpoiler.css';


export const Textarea = styled.textarea`
    width: 100%;
`;


export class TextareaSpoiler extends React.Component {
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

    // eslint-disable-next-line
    handleSetShown = isShown => this.setState({ isShown });
    handleShow = () => this.handleSetShown(true);
    handleHide = () => this.handleSetShown(false);

    render() {
      const { isShown } = this.state;

      return isShown
        ? this.renderData()
        : this.renderShowDataButton();
    }

    renderData() {
      const { result } = this.props;
      return (
        <div className='TextareaSpoiler'>
          <div onClick={ this.handleHide } className='hide-shown'>
            <Tr { ...messages.hide } />
          </div>
          <Textarea className='response-data' rows={ 6 } value={ result } readOnly={ true } />
        </div>
      );
    }

    renderShowDataButton() {
      return (
        <div className='TextareaSpoiler'>
          <div onClick={ this.handleShow } className='show-hidden'>
            <Tr { ...messages.show } />
          </div>
        </div>
      );
    }
}
