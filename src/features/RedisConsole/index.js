import { connect } from 'react-redux';
import RedisConsole from './components/index';
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
)(RedisConsole);
