import { connect } from 'react-redux';
import Navbar from './components';
import { createStructuredSelector } from 'reselect';
import {
    instances,
    activeInstanceName,
} from '../../selectors';


export default connect(
    createStructuredSelector({
        instances,
        activeInstanceName
    })
)(Navbar);
