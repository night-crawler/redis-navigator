import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import './MethodParamsEditor.css';
import yaml from 'js-yaml';
import PropTypes from 'prop-types';
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';



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
            dumpedParams: this.dump(params),
            error: null,
        };
    }

    componentWillReceiveProps(newProps) {
        const { params } = newProps;
        this.setState({ dumpedParams: this.dump(params), params });
    }

    render() {
        const { error } = this.state;

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
                    value={ this.state.dumpedParams }
                    onBeforeChange={ (editor, data, value) => {
                        this.setState({ dumpedParams: value, error: false });
                    } }

                    onBlur={ this.handleOnChange }
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

    handleOnChange = () => {
        const { onChange } = this.props;
        const { dumpedParams } = this.state;
        try {
            onChange(this.load(dumpedParams));
        } catch (e) {
            this.setState({ error: e });
        }
    };
}
