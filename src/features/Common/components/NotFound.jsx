import PropTypes from 'prop-types';
import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from '../messages';


NotFound.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const i18nNotFound = <Tr { ...messages.notFound } />;

export function NotFound(props) {
  return (
    <Segment className='NotFound'>
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
          404. { props.message || i18nNotFound }
        </Header.Content>
      </Header>
    </Segment>
  );
}
