import PropTypes from 'prop-types';
import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import { upperFirst } from 'lodash';
import yaml from 'js-yaml';

import EditorWidgetJson from './EditorWidgetJson';
import ObjectTreeViewWidget from './ObjectTreeViewWidget';
import EditorWidgetYaml from './EditorWidgetYaml';


export default class ObjectCard extends React.Component {
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

        const { widget } = props;

        this.state = { widget };
    }

    render() {
        const { widget } = this.state;
        const { mode } = this.props;

        return (
            <Card className='ObjectCard' fluid={ true }>
                <Card.Content>
                    <Card.Header>
                        { upperFirst(mode) }
                        <Button
                            size='mini' icon='tree' floated='right' active={ widget === 'object' }
                            onClick={ this.handleSetObjectWidget }
                        />
                        <Button
                            size='mini' icon='edit' floated='right' active={ widget === 'editor' }
                            onClick={ this.handleSetEditorWidget }
                        />
                    </Card.Header>
                    <Card.Meta>

                    </Card.Meta>
                    <Card.Description>
                        { widget === 'editor'
                            ? this.renderJsonEditor()
                            : this.renderJsonView()
                        }
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }

    renderJsonEditor() {
        const { result, mode } = this.props;

        if (mode === 'json')
            return <EditorWidgetJson result={ result } />;
        if (mode === 'yaml')
            return <EditorWidgetYaml result={ result } />;
    }

    renderJsonView() {
        const { result, mode } = this.props;

        if (mode === 'json') {
            const resultObject = JSON.parse(result);
            return <ObjectTreeViewWidget result={ resultObject } />;
        }
        if (mode === 'yaml') {
            const resultObject = yaml.safeLoad(result);
            return <ObjectTreeViewWidget result={ resultObject } />;
        }

    }
    
    handleSetWidget = widget => this.setState({ widget });
    handleSetObjectWidget = () => this.handleSetWidget('object');
    handleSetEditorWidget = () => this.handleSetWidget('editor');
}
