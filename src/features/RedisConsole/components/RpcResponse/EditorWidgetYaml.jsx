import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import PropTypes from 'prop-types';

import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

EditorWidgetYaml.propTypes = {
    result: PropTypes.string,
};
export default function EditorWidgetYaml(props) {
    const { result } = props;

    return (
        <CodeMirror
            value={ result }
            options={ {
                theme: 'default',
                matchBrackets: true,
                autoCloseBrackets: true,
                mode: 'yaml',
                lineNumbers: true
            } }
        />
    );
}
