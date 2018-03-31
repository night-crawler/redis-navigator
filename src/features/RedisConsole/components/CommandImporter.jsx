import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
import { FormattedMessage as Tr } from 'react-intl';
import yaml from 'js-yaml';

import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { isJson, isYaml } from '../../../utils';
import { checkCommandsValid } from '../utils';
import ImportingCommandListPreview from './ImportingCommandListPreview';

import messages from '../messages';


export default class CommandImporter extends React.Component {
    static propTypes = {
        inspections: PropTypes.object,
        onImport: PropTypes.func,
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
        const { onImport } = this.props;

        return (
            <Segment>
                <Header as='h2'>
                    Import commands { !isValid && '(invalid)' } { isValid && `[${value.length}]` }
                </Header>
                <Grid stackable={ true }>
                    <Grid.Column width={ 4 } verticalAlign='bottom'>

                        { isValid && <ImportingCommandListPreview commands={ value } /> }

                        <Button
                            basic={ true } fluid={ true } disabled={ !isValid } color='green'
                            onClick={ () => onImport(value) }>
                            <Icon name='checkmark' />
                            <Tr { ...messages.import } />
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
