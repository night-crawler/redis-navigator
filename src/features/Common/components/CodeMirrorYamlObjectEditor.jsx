import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import yaml from 'js-yaml';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import Measure from 'react-measure';
import './FixCodeMirrorStyles.css';


export default class CodeMirrorYamlObjectEditor extends React.Component {
    static propTypes = {
      params: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
      onChange: PropTypes.func.isRequired,
      onError: PropTypes.func,
      flowLevel: PropTypes.number,
      constantHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
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

      const { params, flowLevel } = this.props;

      this.state = {
        params,
        textParams: yaml.dump(params, { flowLevel }),
        error: false,
        height: 300,
        errorHeight: 0,
      };
    }

    render() {
      const { textParams, height: measuredHeight, error } = this.state;
      const { constantHeight, showInlineError } = this.props;

      const height = constantHeight === undefined ? measuredHeight : constantHeight;

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
                value={ textParams }
                onChange={ (editor, data, value) => {
                  this.handleOnChange(value);
                } }
              />

              { showInlineError && !!error && <pre>{ error }</pre> }
            </div>
          }
        </Measure>
      );
    }

    static getDerivedStateFromProps(newProps, prevState) {
      const { params: newParams, flowLevel } = newProps;
      const { params: prevParams } = prevState;

      // death from above
      if (!isEqual(newParams, prevParams))
        return {
          textParams: yaml.dump(newParams, { flowLevel }),
          params: newParams
        };

      return null;
    }

    handleResize = contentRect => {
      const { top } = contentRect.bounds;
      this.setState({ height: window.innerHeight - top - 50 });
      this.CodeMirror && this.CodeMirror.refresh();
    };

    handleOnChange = (value) => {
      const { onChange, onError } = this.props;
      try {
        const newParams = yaml.load(value);
        this.setState(
          { error: false, params: newParams },
          () => onChange(newParams)  // no race conditions
        );
      } catch (e) {
        this.setState(
          { error: e.message },
          () => onError(e.message)
        );
      }
    };
}
