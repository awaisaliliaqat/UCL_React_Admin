import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const uclAdminToken = localStorage.getItem('uclAdminToken');
    return (
        <Route {...rest} render={props => {
            if (uclAdminToken) { return <Component {...props} />; }
            return <Redirect to={{ pathname: '/login' }} />;
        }} />
    );
}

PrivateRoute.propTypes = {
    component: PropTypes.elementType
};

export default PrivateRoute;
