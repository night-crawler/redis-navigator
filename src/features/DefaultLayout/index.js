import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import {
    setActiveInstance,
    fetchInspections,
    fetchInstances,
    initStoreWithUrls,
    fetchEndpoints,
} from '../actions';
import {
    instances,
    activeInstanceName,
    instancesData,
    inspections,
    activeInstance,
    urls,

    isReady,
    shouldFetchEndpoints, shouldFetchInspections, shouldFetchInstances,
} from '../selectors';

import DefaultLayout from './components';



function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        actions: {
            initStoreWithUrls: (baseUrl, endpointsUrl) => dispatch(initStoreWithUrls({
                base: baseUrl,
                endpoints: endpointsUrl
            })),
            fetchEndpoints: url => dispatch(fetchEndpoints(url)),
            fetchInstances: url => dispatch(fetchInstances(url)),
            fetchInspections: url => dispatch(fetchInspections(url)),

            setActiveInstance: name => dispatch(setActiveInstance(name)),
        }
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
        shouldFetchEndpoints, shouldFetchInspections, shouldFetchInstances,
        urls,
    }),
    mapDispatchToProps,
)(DefaultLayout));
