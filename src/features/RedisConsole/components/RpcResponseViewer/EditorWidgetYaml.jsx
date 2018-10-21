import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

EditorWidgetYaml.propTypes = {
  result: PropTypes.string,
};
export function EditorWidgetYaml(props) {
  return (
    <CodeMirror
      value={ props.result }
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
