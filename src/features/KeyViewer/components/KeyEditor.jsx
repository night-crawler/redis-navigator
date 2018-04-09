import { REDIS_KEY_TYPE_ICON_MAP } from 'constants';
import debug from 'debug';
import FullPageDimmer from 'features/Common/components/FullPageDimmer';
import CodeMirrorYamlObjectEditor from 'features/Common/components/CodeMirrorYamlObjectEditor';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage as Tr } from 'react-intl';
import { Button, Header, Segment } from 'semantic-ui-react';
import messages from '../messages';
import KeyInfo from './KeyInfo';


export default class KeyEditor extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        selectedKey: PropTypes.string,
        info: PropTypes.shape({
            memory_usage: PropTypes.number,
            ttl: PropTypes.number,
            pttl: PropTypes.number,
            object_refcount: PropTypes.number,
            object_encoding: PropTypes.string,
            object_idletime: PropTypes.number,
        }),
        data: PropTypes.any,
        onFetchKeyDataClick: PropTypes.func,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyEditor');
        this.log('initialized', props);
    }

    render() {
        const { type, selectedKey, info, onFetchKeyDataClick, data } = this.props;

        if (!selectedKey || !type)
            return <FullPageDimmer message={ <Tr { ...messages.selectAKey } /> } />;

        if (isEmpty(info))
            return <FullPageDimmer />;

        const iconName = ( REDIS_KEY_TYPE_ICON_MAP[ type ] || { name: 'spinner' } ).name;

        return (
            <Segment basic={ true }>
                <Header as='h2' content={ `[${type}] ${selectedKey}` } icon={ iconName } />
                <KeyInfo { ...info } />

                <Button fluid={ true } onClick={ () => onFetchKeyDataClick(selectedKey, type) }>
                    <Tr { ...messages.fetchKeyData } />
                </Button>

                { this.renderEditor() }

            </Segment>
        );
    }

    renderEditor() {
        const { type, selectedKey, info, onFetchKeyDataClick, data } = this.props;

        if (!type || !data)
            return false;

        switch(type.toLowerCase()) {
            case 'list':
            case 'set':
            case 'zset':
            case 'hash':
                return <CodeMirrorYamlObjectEditor params={ data } onChange={ this.handleEditorChange } />;
        }
    }

    handleEditorChange = (nextValue) => {
        console.log(nextValue);
    };
}
