import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import yaml from 'js-yaml';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import Measure from 'react-measure';
import './FixCodeMirrorStyles.css';


export class CodeMirrorYamlObjectEditor extends React.Component {
    static propTypes = {
      params: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
      onChange: PropTypes.func.isRequired,
      onError: PropTypes.func,
      flowLevel: PropTypes.number,
      constantHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
      
      // TODO: deprecated
      showInlineError: PropTypes.bool,
    };

    static defaultProps = {
      flowLevel: 1,
      showInlineError: false,
      onChange: () => {},
      onError: () => {},
    };

    constructor(props) {
      super(props);
      this.state = {
        params: this.props.params,
        textParams: yaml.dump(this.props.params, { flowLevel: this.props.flowLevel }),
        error: false,
        height: 300,
        errorHeight: 0,
      };
    }

    render() {
      const height = this.props.constantHeight === undefined 
        ? this.state.height
        : this.props.constantHeight;

      return (

        <Measure bounds={ true } onResize={ this.handleResize }>
          { ({ measureRef }) =>
            <div ref={ measureRef } style={ { height } } className='CodeMirrorYamlObjectEditor'>
              <CodeMirror
                className='CodeMirrorYamlObjectEditor-CodeMirror'
                editorDidMount={ editor => this.CodeMirror = editor }
                options={ {
                  mode: 'yaml',
                  matchBrackets: true,
                  autoCloseBrackets: true,
                  lineNumbers: true,
                  lineWrapping: true,
                  height: this.state.height
                } }
                autoScroll={ false }
                autoFocus={ true }
                value={ this.state.textParams }
                onChange={ (editor, data, value) => this.handleOnChange(value) }
              />

              { this.props.showInlineError && 
                !this.state.error && 
                <pre>{ this.state.error }</pre> }
            </div>
          }
        </Measure>
      );
    }

    shouldComponentUpdate = (nextProps, nextState) => {
      if (nextState.error !== this.state.error)
        return true;
      return false;
    }

    handleResize = contentRect => {
      const { top } = contentRect.bounds;
      // eslint-disable-next-line
      this.setState({ height: window.innerHeight - top - 50 });
      this.CodeMirror && this.CodeMirror.refresh();
    };

    handleOnChange = (value) => {
      try {
        const newParams = yaml.load(value);
        // eslint-disable-next-line
        this.setState(
          { error: null, params: newParams },
          () => this.props.onChange(newParams)
        );
      } catch (e) {
        // eslint-disable-next-line
        this.setState(
          { error: e.message },
          () => this.props.onError(e.message)
        );
      }
    };
}
