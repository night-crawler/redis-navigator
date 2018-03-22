import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    setActiveInstance,
    loadInspections,
    loadInstances,
    initStoreWithUrls,
} from '../actions';
import { createStructuredSelector } from 'reselect';
import DefaultLayout from './components';
import {
    instances,
    activeInstanceName,
    instancesData,
    inspections,
    activeInstance,
    isReady,
} from '../selectors';


function mapDispatchToProps(dispatch, ownProps) {
    const { statusUrl, inspectionsUrl } = ownProps;


    return {
        actions: {
            initStoreWithUrls: urls => dispatch(initStoreWithUrls(urls)),

            loadInstances: () => dispatch(loadInstances(statusUrl)),
            setActiveInstance: name => dispatch(setActiveInstance(name)),
            loadInspections: () => dispatch(loadInspections(inspectionsUrl)),
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
    }),
    mapDispatchToProps
)(DefaultLayout));
