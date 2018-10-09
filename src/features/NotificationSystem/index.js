import { connect } from 'react-redux';

import { NotificationSystem } from './components';


export default connect(
  state => ( { notifications: state.notifications } )
)(NotificationSystem);
