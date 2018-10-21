import { isEqual, isFunction, pickBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { injectIntl, intlShape } from 'react-intl';
import { Button, Dropdown, Grid, Header, Label, Segment } from 'semantic-ui-react';

import { CodeMirrorYamlObjectEditor } from '~/features/Common/components';

import messages from '../messages';
import { parametersToJson, reprMethodDoc } from '../utils';

import { MethodParametersList } from './MethodParametersList';
import { RpcResponseViewer } from './RpcResponseViewer';


class _MethodCallEditor extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
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

  keyMap = {
    execute: 'ctrl+enter',
  };

  state = {};

  constructor(props) {
    super(props);

    this.keyMapHandlers = {
      execute: this.props.onRetry,
    };
  }

  render() {
    const {
      methodName, methodParams, response, dirty,
      instanceName, color, inspections,
      onRemove, onRetry
    } = this.props;

    if (!methodName)
      return this.renderMethodSelector();

    const methodProps = inspections[ methodName ];

    if (!methodParams)
      return false;

    return (
      <Segment
        className='MethodCallEditor' basic={ true } color={ color }
        as={ HotKeys } keyMap={ this.keyMap } handlers={ this.keyMapHandlers } focused={ true }
      >
        <Header as='h2' color={ this.isSuccess() && !dirty ? 'green' : undefined }>
          <Header.Content>
            <Button
              basic={ true } color='orange' icon='remove' size='huge'
              onClick={ onRemove }
            />
          </Header.Content>
          <Header.Content>
            { instanceName }.{ methodName }
            { <MethodParametersList parameters={ methodProps.parameters } /> }
            <Button
              as={ Label } icon='repeat' color='orange'
              basic={ true } circular={ true }
              onClick={ onRetry }
            />
          </Header.Content>
          <Header.Subheader>
            { reprMethodDoc(methodProps.doc) }
          </Header.Subheader>

        </Header>

        <Grid stackable={ true }>
          <Grid.Column width={ 6 }>
            <CodeMirrorYamlObjectEditor
              showInlineError={ true }
              params={ methodParams }
              onChange={ this.handleJsonChanged }
              constantHeight={ 'auto' }
            />
          </Grid.Column>
          { response &&
          <Grid.Column width={ 10 }>
            <RpcResponseViewer response={ response } />
          </Grid.Column>
          }
        </Grid>

      </Segment>
    );
  }

  shouldComponentUpdate(nextProps) {
    // don't worry about changed on*-signatures, since all of them are bound to uuid
    return !isEqual(
      pickBy(nextProps, val => !isFunction(val)),
      pickBy(this.props, val => !isFunction(val)),
    );
  }

  static getDerivedStateFromProps(newProps) {
    const { methodName, methodParams, inspections, onMethodParamsChange } = newProps;
    const methodProps = inspections[ methodName ];

    if (methodProps && methodName && !methodParams) {
      onMethodParamsChange(parametersToJson(methodProps.parameters));
    }
    return null;
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

  handleMethodNameChanged = (e, { value }) => {
    const { onMethodNameChange } = this.props;
    onMethodNameChange(value);
  };

  handleJsonChanged = newObject => {
    const { onMethodParamsChange } = this.props;
    onMethodParamsChange(newObject);
  };

  renderMethodSelector() {
    const { instanceName, color, onRemove } = this.props;

    return (
      <Segment basic={ true } color={ color }>
        <Header as='h2'>
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
    const { ddMethodsOptions, intl } = this.props;
    return <Dropdown
      options={ ddMethodsOptions }
      placeholder={ intl.formatMessage({ ...messages.findCommand }) }
      search={ true }
      fluid={ true }
      selection={ true }
      onChange={ this.handleMethodNameChanged }
      selectOnNavigation={ false }
    />;
  }

}


export const MethodCallEditor = injectIntl(_MethodCallEditor);
