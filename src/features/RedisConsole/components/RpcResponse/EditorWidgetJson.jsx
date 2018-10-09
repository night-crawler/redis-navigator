import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

EditorWidgetJson.propTypes = {
  result: PropTypes.string,
};
export function EditorWidgetJson(props) {
  const { result } = props;

  return (
    <CodeMirror
      value={ result }
      options={ {
        theme: 'default',
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: 'application/json',
        lineNumbers: true
      } }
    />
  );
}
