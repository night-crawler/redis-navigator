import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './CodeMirrorYamlObjectEditor.css';


export default class CodeMirrorTextEditor extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        const { text } = this.props;
        this.state = {
            text,
        };
    }

    render() {
        const { text } = this.state;

        return (
            <div>
                <CodeMirror
                    options={ {
                        viewportMargin: Infinity,
                        lineWrapping: true,
                        matchBrackets: true,
                        autoCloseBrackets: true,
                        lineNumbers: true,
                    } }
                    autoScroll={ false }
                    autoFocus={ true }
                    value={ text }
                    onChange={ (editor, data, value) => {
                        this.handleOnChange(value);
                    } }
                />
            </div>
        );
    }

    static getDerivedStateFromProps(newProps, prevState) {
        const { text: newText } = newProps;
        const { text: prevText } = prevState;

        if (newText !== prevText)
            return { text: newText };

        return null;
    }

    handleOnChange = (value) => {
        const { onChange } = this.props;

        this.setState(
            { error: false, text: value },
            () => onChange(value)
        );
    };
}
