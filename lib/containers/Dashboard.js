import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    routeInstanceInfo,
} from '../selectors';


export default connect(
    createStructuredSelector({
        routeInstanceName,
        routeInstanceInfo,
    })
)(Dashboard);
