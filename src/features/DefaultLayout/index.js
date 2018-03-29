import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    setActiveInstance,
    fetchInspections,
    fetchInstances,
    initStoreWithUrls,
    fetchEndpoints,
} from '../actions';
import { createStructuredSelector } from 'reselect';
import DefaultLayout from './components';
import {
    instances,
    activeInstanceName,
    instancesData,
    inspections,
    activeInstance,
    urls,

    isReady,
    hasLoadedEndpoints,
    hasLoadedInspections,
    hasLoadedInstances,
} from '../selectors';


function mapDispatchToProps(dispatch, ownProps) {
    return {
        dispatch,
        actions: {
            initStoreWithUrls: urls => dispatch(initStoreWithUrls(urls)),
            setActiveInstance: name => dispatch(setActiveInstance(name)),
        }
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { urls } = stateProps;
    const { dispatch } = dispatchProps;

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        actions: {
            ...dispatchProps.actions,

            fetchEndpoints: () => dispatch(fetchEndpoints(urls.endpoints)),
            loadInstances: () => dispatch(fetchInstances(urls.status)),
            loadInspections: () => dispatch(fetchInspections(urls.inspections)),
        },
        dispatch: undefined,
    };
}

export default withRouter(connect(
    createStructuredSelector({
        instances,
        activeInstanceName,
        instancesData,
        inspections,
        activeInstance,

        isReady,
        hasLoadedEndpoints,
        hasLoadedInspections,
        hasLoadedInstances,

        urls,
    }),
    mapDispatchToProps,
    mergeProps
)(DefaultLayout));
