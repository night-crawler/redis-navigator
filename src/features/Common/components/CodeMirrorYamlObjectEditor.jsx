import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import yaml from 'js-yaml';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './CodeMirrorYamlObjectEditor.css';


export default class CodeMirrorYamlObjectEditor extends React.Component {
    static propTypes = {
        params: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        onChange: PropTypes.func.isRequired,
        flowLevel: PropTypes.number,
    };

    static defaultProps = {
        flowLevel: 1
    };

    constructor(props) {
        super(props);

        const { params, flowLevel } = this.props;

        this.state = {
            params,
            textParams: yaml.dump(params, { flowLevel }),
            error: false,
        };
    }

    render() {
        const { error, textParams } = this.state;

        return (
            <div>
                <CodeMirror
                    options={ {
                        viewportMargin: Infinity,
                        mode: 'yaml',
                        matchBrackets: true,
                        autoCloseBrackets: true,
                        lineNumbers: true,
                        lineWrapping: true,
                    } }
                    autoScroll={ false }
                    autoFocus={ true }
                    value={ textParams }
                    onChange={ (editor, data, value) => {
                        this.handleOnChange(value);
                    } }
                />

                { error
                    ? <pre>{ error.message }</pre>
                    : false
                }

            </div>
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

    handleOnChange = (value) => {
        const { onChange } = this.props;
        try {
            const newParams = yaml.load(value);
            this.setState(
                { error: false, params: newParams },
                () => onChange(newParams)  // no race conditions
            );
        } catch (e) {
            this.setState({ error: e });
        }
    };
}
