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
            <Measure bounds={ true } onResize={ this.handleResize } key={ this.state.height }>
                { ({ measureRef }) =>
                    <div ref={ measureRef } style={ { height: this.state.height } } className='CodeMirrorTextEditor'>
                        <CodeMirror
                            className='CodeMirrorTextEditor-CodeMirror'
                            editorDidMount={ editor => this.CodeMirror = editor }
                            options={ {
                                lineWrapping: true,
                                lineNumbers: true,
                                matchBrackets: true,
                                autoCloseBrackets: true,
                                height: this.state.height
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

    shouldComponentUpdate(nextProps) {
        const { text: newText } = nextProps;
        const { text: prevText } = this.state;

        return newText !== prevText;
    }

    handleResize = contentRect => {
        const { top } = contentRect.bounds;
        this.setState({ height: window.innerHeight - top - 50 });

        this.forceUpdate();
        this.CodeMirror && this.CodeMirror.refresh();
    };

    handleOnChange = (value) => {
        const { onChange } = this.props;

        this.setState(
            { text: value },
            () => onChange(value)
        );
    };
}
