import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchInstances, setActiveInstance, toggleProgressBarVisible } from '../actions';
import {
    activeInstanceName,
    instances,
    urls,
    progressIsVisible,
    progressPercent,
} from '../selectors';
import { Navbar } from './components';


function mapDispatchToProps(dispatch) {
    return {
        actions: {
            setActiveInstance: name => dispatch(setActiveInstance(name)),
            toggleProgressBarVisible: isVisible => dispatch(toggleProgressBarVisible(isVisible)),
        }
    };
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls: { statusUrl } } = stateProps;
    const { dispatch } = dispatchProps;

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            ...dispatchProps.actions,
            fetchInstances: () => dispatch(fetchInstances(statusUrl)),
        },
        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        instances,
        activeInstanceName,
        urls,
        progressIsVisible,
        progressPercent,
    }),
    mapDispatchToProps,
    mergeProps
)(Navbar);
