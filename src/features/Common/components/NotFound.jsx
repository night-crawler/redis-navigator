import PropTypes from 'prop-types';
import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

import { FormattedMessage } from 'react-intl';
import messages from '../messages';

const MsgNotFound = <FormattedMessage { ...messages.notFound } />;


NotFound.propTypes = {
    message: PropTypes.string
};
export default function NotFound(props) {
    const { message = MsgNotFound } = props;

    return (
        <Segment>
            <Header as='h1' textAlign='center'>
                <Icon.Group size='large'>
                    <Icon loading={ true } size='big' name='target' color='red' />
                    <Icon corner={ true } size='big' name='detective' />

                    <Icon.Group size='big'>
                        <Icon loading={ true } size='big' name='target' color='red' />
                        <Icon corner={ true } loading={ true } size='tiny' name='find' color='green' />

                        <Icon.Group size='small'>
                            <Icon loading={ true } size='big' name='target' color='red' />
                            <Icon name='detective' />
                        </Icon.Group>

                    </Icon.Group>
                </Icon.Group>
                <Header.Content>
                    404. { message }
                </Header.Content>

            </Header>


        </Segment>
    );
}
