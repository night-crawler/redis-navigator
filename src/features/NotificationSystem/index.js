import { connect } from 'react-redux';

import { NotificationSystemComponent } from './NotificationSystemComponent';


export default connect(
  state => ( { notifications: state.notifications } )
)(NotificationSystemComponent);
