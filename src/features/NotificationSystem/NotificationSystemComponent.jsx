import React from 'react';
import PropTypes from 'prop-types';
import Notifications from 'react-notification-system-redux';


export class NotificationSystemComponent extends React.Component {
    static propTypes = {
      notifications: PropTypes.array
    };

    render() {
      //Optional styling
      const style = {
        NotificationItem: { // Override the notification item
          DefaultStyle: { // Applied to every notification, regardless of the notification level
            margin: '10px 5px 2px 1px'
          },

          success: { // Applied only to the success notification item
            color: 'green'
          }
        }
      };

      return (
        <Notifications
          notifications={ this.props.notifications }
          style={ style }
        />
      );
    }
}
