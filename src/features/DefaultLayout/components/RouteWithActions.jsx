import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';


RouteWithActions.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    actions: PropTypes.object,
};
export default function RouteWithActions({ component: Component, actions, ...rest }) {
    return <Route
        { ...rest }
        render={ props => <Component { ...props } actions={ actions } /> }
    />;
}
