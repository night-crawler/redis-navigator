import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loadInstances, setActiveInstance } from '../actions';
import { activeInstanceName, instances, urls, } from '../selectors';
import { Navbar } from './components';


function mapDispatchToProps(dispatch) {
    return {
        actions: {
            setActiveInstance: name => dispatch(setActiveInstance(name)),
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
            loadInstances: () => dispatch(loadInstances(statusUrl)),
        },
        dispatch: undefined,
    };
}


export default connect(
    createStructuredSelector({
        instances,
        activeInstanceName,
        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(Navbar);
