import { connect } from 'react-redux';
import RedisRpc from '../components/RedisRpc';
import { createStructuredSelector } from 'reselect';
import {
    routeInstanceName,
    inspections,
} from '../selectors';


export default connect(
    createStructuredSelector({
        routeInstanceName,
        inspections,
    })
)(RedisRpc);
