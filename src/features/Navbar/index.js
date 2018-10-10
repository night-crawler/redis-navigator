import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchInstances, setActiveInstance, toggleProgressBarVisible } from '../actions';
import {
  activeInstanceName,
  instances,
  urls,
  progressIsVisible,
  progressPercent,
  location,
} from '../selectors';

import { NavbarComponent } from './NavbarComponent';


function mapDispatchToProps(dispatch) {
  return {
    actions: {
      setActiveInstance: name => dispatch(setActiveInstance(name)),
      toggleProgressBarVisible: isVisible => dispatch(toggleProgressBarVisible(isVisible)),
      fetchInstances: (statusUrl) => dispatch(fetchInstances(statusUrl)),
    }
  };
}


export default connect(
  createStructuredSelector({
    instances,
    activeInstanceName,
    urls,
    progressIsVisible,
    progressPercent,
    location
  }),
  mapDispatchToProps,
)(NavbarComponent);
