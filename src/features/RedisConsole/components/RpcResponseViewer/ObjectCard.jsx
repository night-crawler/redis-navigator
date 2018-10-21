import PropTypes from 'prop-types';
import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import { upperFirst } from 'lodash';
import yaml from 'js-yaml';

import { EditorWidgetJson } from './EditorWidgetJson';
import { ObjectTreeViewWidget } from './ObjectTreeViewWidget';
import { EditorWidgetYaml } from './EditorWidgetYaml';


export class ObjectCard extends React.Component {
    static propTypes = {
      widget: PropTypes.oneOf(['editor', 'object']),
      mode: PropTypes.oneOf(['json', 'yaml']).isRequired,
      result: PropTypes.any,
    };

    static defaultProps = {
      widget: 'editor',
    };

    constructor(props) {
      super(props);
      this.state = { widget: this.props.widget };
    }

    render() {
      return (
        <Card className='ObjectCard' fluid={ true }>
          <Card.Content>
            <Card.Header>
              { upperFirst(this.props.mode) }
              <Button
                size='mini' icon='tree' floated='right' active={ this.state.widget === 'object' }
                onClick={ this.handleSetObjectWidget }
              />
              <Button
                size='mini' icon='edit' floated='right' active={ this.state.widget === 'editor' }
                onClick={ this.handleSetEditorWidget }
              />
            </Card.Header>
            <Card.Meta>

            </Card.Meta>
            <Card.Description>
              { this.state.widget === 'editor'
                ? this.renderJsonEditor()
                : this.renderJsonView()
              }
            </Card.Description>
          </Card.Content>
        </Card>
      );
    }

    renderJsonEditor() {
      if (this.props.mode === 'json')
        return <EditorWidgetJson result={ this.props.result } />;
      if (this.props.mode === 'yaml')
        return <EditorWidgetYaml result={ this.props.result } />;
    }

    renderJsonView() {
      if (this.props.mode === 'json') {
        const resultObject = JSON.parse(this.props.result);
        return <ObjectTreeViewWidget result={ resultObject } />;
      }
      if (this.props.mode === 'yaml') {
        const resultObject = yaml.safeLoad(this.props.result);
        return <ObjectTreeViewWidget result={ resultObject } />;
      }

    }
    
    // eslint-disable-next-line
    handleSetWidget = widget => this.setState({ widget });
    handleSetObjectWidget = () => this.handleSetWidget('object');
    handleSetEditorWidget = () => this.handleSetWidget('editor');
}
