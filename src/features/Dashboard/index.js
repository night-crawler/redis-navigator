import { connect } from 'react-redux';
import Dashboard from './components';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeInstanceInfo,
    routeInstanceDataExists,
} from '../selectors';


export default connect(
    createStructuredSelector({
        routeInstanceName,
        routeInstanceInfo,
        routeInstanceDataExists,
    })
)(Dashboard);
