import { REDIS_KEY_TYPE_ICON_MAP } from 'constants';
import debug from 'debug';
import CodeMirrorTextEditor from 'features/Common/components/CodeMirrorTextEditor';
import CodeMirrorYamlObjectEditor from 'features/Common/components/CodeMirrorYamlObjectEditor';
import FullPageDimmer from 'features/Common/components/FullPageDimmer';
import { isEmpty, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { FormattedMessage as Tr } from 'react-intl';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
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
        onSaveKeyDataClick: PropTypes.func,
    };

    constructor(props) {
        super(props);
        debug.enable('*');
        this.log = debug('KeyEditor');
        this.log('initialized', props);

        this.keyMapHandlers = {
            save: this.handleSaveClicked,
        };
    }

    state = {
        dirtyData: undefined,
    };

    keyMap = {
        save: 'ctrl+enter',
    };


    static getDerivedStateFromProps(nextProps, prevState) {
        const { data: nextData } = nextProps;
        const { data: prevData } = prevState;

        if (!isEqual(nextData, prevData)) {
            return { dirtyData: nextData };
        }
        return null;
    }

    render() {
        const
            { type, selectedKey, info, data } = this.props,
            { dirtyData } = this.state;


        if (!selectedKey || !type)
            return <FullPageDimmer message={ <Tr { ...messages.selectAKey } /> } />;

        if (isEmpty(info))
            return <FullPageDimmer />;

        const iconName = (REDIS_KEY_TYPE_ICON_MAP[ type ] || { name: 'spinner' }).name;

        return (
            <HotKeys keyMap={ this.keyMap } handlers={ this.keyMapHandlers } focused={ true }>
                <Segment basic={ true }>
                    <Header as='h2'>
                        <Icon name={ iconName } />
                        { `[${type}] ${selectedKey}` }
                    </Header>
                    <KeyInfo { ...info } />

                    <Button fluid={ true } onClick={ this.handleFetchKeyDataClicked }>
                        <Icon name='refresh' />
                        <Tr { ...messages.fetchKeyData } />
                    </Button>

                    { this.renderEditor() }

                    <Button
                        disabled={ isEqual(data, dirtyData) } fluid={ true } primary={ true }
                        onClick={ this.handleSaveClicked }
                    >
                        <Icon name='save' />
                        <Tr { ...messages.save } />
                    </Button>
                </Segment>
            </HotKeys>
        );
    }

    renderEditor() {
        const
            { type, data: propsData } = this.props,
            { dirtyData } = this.state,
            data = dirtyData || propsData;

        if (!type || !data)
            return false;

        switch (type.toLowerCase()) {
            case 'list':
            case 'set':
            case 'zset':
            case 'hash':
                return <CodeMirrorYamlObjectEditor params={ data } onChange={ this.handleEditorChange } />;
            case 'string':
                return <CodeMirrorTextEditor text={ data } onChange={ this.handleEditorChange } />;

            default:
                throw new Error(`Unknown type: ${type}`);
        }
    }

    handleFetchKeyDataClicked = () => {
        const { type, selectedKey, onFetchKeyDataClick } = this.props;
        onFetchKeyDataClick(selectedKey, type);
    };

    handleEditorChange = (nextValue) => {
        this.setState({ dirtyData: nextValue });
    };

    handleSaveClicked = () => {
        const { onSaveKeyDataClick, selectedKey, info, type, data } = this.props;
        const { dirtyData } = this.state;

        if (isEqual(data, dirtyData))
            return false;

        onSaveKeyDataClick(
            selectedKey,
            type,
            data,
            dirtyData,
            info.pttl
        );
    };
}
