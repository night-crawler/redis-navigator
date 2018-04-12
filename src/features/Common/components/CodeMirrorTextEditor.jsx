import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import Measure from 'react-measure';
import './FixCodeMirrorStyles.css';


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
            initialText: text,
        };
    }

    render() {
        return (
            <Measure
                bounds={ true }
                onResize={
                    (contentRect) => {
                        const { top } = contentRect.bounds;
                        const { offsetHeight } = document.body;
                        this.setState({ height: offsetHeight - top - 50 });
                    }
                }
            >
                { ({ measureRef }) =>
                    <div ref={ measureRef } style={ { height: this.state.height } }>
                        <CodeMirror
                            options={ {
                                lineWrapping: true,
                                matchBrackets: true,
                                autoCloseBrackets: true,
                                lineNumbers: true,
                            } }
                            autoScroll={ false }
                            autoFocus={ true }
                            value={ this.state.text }
                            onChange={ (editor, data, value) => {
                                this.handleOnChange(value);
                            } }
                        />
                    </div>
                }
            </Measure>
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { text: newText } = nextProps;
        const { text: prevText } = prevState;

        if (newText !== prevText)
            return { text: newText };

        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { text: newText } = nextProps;
        const { text: prevText } = this.state;

        return newText !== prevText;
    }

    handleOnChange = (value) => {
        const { onChange } = this.props;

        this.setState(
            { text: value },
            () => onChange(value)
        );
    };
}
