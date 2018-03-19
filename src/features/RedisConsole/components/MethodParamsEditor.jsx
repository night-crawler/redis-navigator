import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import './MethodParamsEditor.css';
import yaml from 'js-yaml';
import PropTypes from 'prop-types';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { isEqual } from 'lodash';


export default class MethodParamsEditor extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        const { params } = this.props;
        this.state = {
            params,
            textParams: this.dump(params),
            error: false,
        };
    }

    componentWillReceiveProps(newProps) {
        const { params: newParams } = newProps;
        const { params: oldParams } = this.state;

        // death from above
        if (!isEqual(newParams, oldParams)) {
            this.setState({ textParams: this.dump(newParams), params: newParams });
        }
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
                        lineNumbers: true
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

    dump = obj => yaml.dump(obj);
    load = rawStr => yaml.load(rawStr);

    handleOnChange = (value) => {
        const { onChange } = this.props;
        try {
            const newParams = this.load(value);
            this.setState(
                { error: false, params: newParams },
                () => onChange(newParams)  // no race conditions
            );
        } catch (e) {
            this.setState({ error: e });
        }
    };
}
