import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import styled from 'styled-components';

import messages from '../messages';

import './TextareaSpoiler.css';


export const Textarea = styled.textarea`
    width: 100%;
`;
const i18nHide = <Tr { ...messages.hide } />;
const i18nShow = <Tr { ...messages.show } />;

export class TextareaSpoiler extends React.Component {
    static propTypes = {
      result: PropTypes.any.isRequired,
      show: PropTypes.bool,
    };
    static defaultProps = { show: false };
    state = { isShown: false };

    componentDidMount = () => this.handleSetShown(this.props.show);
    // eslint-disable-next-line
    handleSetShown = isShown => this.setState({ isShown });
    handleShow = () => this.handleSetShown(true);
    handleHide = () => this.handleSetShown(false);

    render() {
      return this.state.isShown
        ? this.renderData()
        : this.renderShowDataButton();
    }

    renderData = () => 
      <div className='TextareaSpoiler'>
        <div onClick={ this.handleHide } className='hide-shown'>
          { i18nHide }
        </div>
        <Textarea 
          className='response-data' 
          rows={ 6 } 
          value={ this.props.result } 
          readOnly={ true } 
        />
      </div>

    renderShowDataButton = () => 
      <div className='TextareaSpoiler'>
        <div onClick={ this.handleShow } className='show-hidden'>
          { i18nShow }
        </div>
      </div>
}
