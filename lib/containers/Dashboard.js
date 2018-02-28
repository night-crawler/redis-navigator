import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { createStructuredSelector } from 'reselect';
import {
    routeMatchParams,
    routeInstance,
    routeInstanceName,
    routeInstanceInfo,
} from '../selectors';


export default connect(
    createStructuredSelector({
        routeMatchParams,
        routeInstance,
        routeInstanceName,
        routeInstanceInfo,
    })
)(Dashboard);
