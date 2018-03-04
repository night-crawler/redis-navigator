import debug from 'debug';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Segment } from 'semantic-ui-react';
import DropdownRpcMethodItem from './DropdownRpcMethodItem';
import RedisRpcMethodCallEditor from './MethodCallEditor';


export default class RedisRpc extends React.Component {
    static propTypes = {
        inspections: PropTypes.object.isRequired,
        routeInstanceName: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('RedisRpc');
        this.log('initialized', props);
        this.state = {
            cmd: null,
            ddMethodsOptions: [],
        };
    }

    componentDidMount() {
        this.prepareOptions();
    }

    prepareOptions() {
        const { inspections } = this.props;
        const ddMethodsOptions = Object.entries(inspections).map(([fName, fOptions]) => {
            return {
                key: fName,
                text: fName,
                value: fName,
                content: <DropdownRpcMethodItem { ...fOptions } name={ fName } />
            };
        });
        this.setState({ ddMethodsOptions });
    }

    render() {
        this.log('render');
        const { inspections, routeInstanceName } = this.props;
        const { ddMethodsOptions } = this.state;

        if (isEmpty(ddMethodsOptions))
            return false;

        return (
            <Segment.Group>
                <RedisRpcMethodCallEditor
                    routeInstanceName={ routeInstanceName }
                    inspections={ inspections }
                    ddMethodsOptions={ ddMethodsOptions }
                />
            </Segment.Group>
        );
    }
}
