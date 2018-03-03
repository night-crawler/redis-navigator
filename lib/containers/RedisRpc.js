import { connect } from 'react-redux';
import RedisRpc from '../components/RedisRpc';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    inspections,
    routeInstanceRequests,
    routeInstanceResponses,
} from '../selectors';


export default connect(
    createStructuredSelector({
        routeInstanceName,
        inspections,
        routeInstanceRequests,
        routeInstanceResponses,
    })
)(RedisRpc);
