import debug from 'debug';
import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { REDIS_TYPE_ICON_MAP } from 'constants';


export default class KeyEditor extends React.Component {
    static propTypes = {
        keyType: PropTypes.string.isRequired,
        activeKey: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyEditor');
        this.log('initialized', props);
    }

    render() {
        const { keyType, activeKey } = this.props;

        const iconName = (REDIS_TYPE_ICON_MAP[keyType] || { name: 'spinner' }).name;

        return (
            <Segment>
                <Header as='h2' content={ `[${keyType}] ${activeKey}` } icon={ iconName } />
            </Segment>
        );
    }
}
