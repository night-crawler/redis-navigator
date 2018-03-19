import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';

import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Button, Grid, Header, Segment, Icon } from 'semantic-ui-react';
import { isJson, isYaml } from '../../../utils';
import { isArray, isPlainObject, every } from 'lodash';
import yaml from 'js-yaml';


const checkCommandsValid = (commands) => {
    if (!isArray(commands))
        return false;

    const allCommandsHaveMethodName = every(commands.map(
        command => isPlainObject(command) && typeof command.methodName === 'string'
    ));

    if (!allCommandsHaveMethodName)
        return false;

    const allCommandsHaveValidParams = every(commands.map(
        command => command.methodParams === undefined || isPlainObject(command.methodParams)
    ));

    if (!allCommandsHaveValidParams)
        return false;

    return true;
};


export default class CommandImporter extends React.Component {
    static propTypes = {
        text: PropTypes.any,
    };

    constructor(props) {
        super(props);

        this.state = {
            textValue: '',
            isValid: false,
            mode: undefined,
            type: undefined,
            value: undefined,
        };
    }

    render() {
        const { isValid, mode, value, textValue } = this.state;
        return (
            <Segment>
                <Header as='h2'>
                    Import commands { !isValid && '(invalid)' } { isValid && `[${value.length}]`  }
                </Header>
                <Grid stackable={ true }>
                    <Grid.Column width={ 4 } verticalAlign='bottom'>

                        <Button basic={ true } color='green' fluid={ true } disabled={ !isValid }>
                            <Icon name='checkmark' />
                            Import
                        </Button>

                    </Grid.Column>

                    <Grid.Column width={ 12 }>
                        <CodeMirror
                            value={ textValue }
                            options={ {
                                theme: 'default',
                                matchBrackets: true,
                                autoCloseBrackets: true,
                                mode: mode || 'application/json',
                                lineNumbers: true
                            } }
                            onChange={ (editor, data, value) => this.handleChange(value) }
                        />

                    </Grid.Column>


                </Grid>
            </Segment>
        );
    }

    handleChange = textValue => {
        let mode, type, value, isValid = false;

        if (isJson(textValue, [checkCommandsValid])) {
            mode = 'application/json';
            type = 'json';
            value = JSON.parse(textValue);
            isValid = true;
        }

        if (isYaml(textValue, [checkCommandsValid])) {
            mode = 'yaml';
            type = 'yaml';
            value = yaml.load(textValue);
            isValid = true;
        }

        this.setState({ mode, type, value, isValid });
    };

}
