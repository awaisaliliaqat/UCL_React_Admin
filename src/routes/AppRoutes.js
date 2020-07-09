import React, { Suspense } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Registration from '../pages/Registration/Registration';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import PrivateRoutes from './PrivateRoutes';
import DisplayAdmissionApplication from '../components/DisplayAdmissionApplications';

const NoMatchPage = () => {
    return (
        <Redirect to="/login" />
    );
};

const CheckLogin = () => {
    const uclAdminToken = localStorage.getItem('uclAdminToken');
    if (uclAdminToken) {
        return (
            <Redirect to="/dashboard" />
        );
    } else {
        return (
            <Login />
        );
    }
}

const AppRoute = () => {

    return (
        <>
            <Router>
                <Suspense fallback={<p>Loading...</p>}>
                    <Switch>
                        <Route exact path="/login" component={CheckLogin} />
                        <Route exact path="/registration" component={Registration} />
                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <PrivateRoutes exact path="/dashboard" component={Dashboard} />
                        <PrivateRoutes exact path="/dashboard/:id" component={Dashboard} />
                        <PrivateRoutes exact path="/dashboard/raise-document-requests/:id" component={Dashboard} />
                        <PrivateRoutes exact path="/view-application/:id" component={DisplayAdmissionApplication} />
                        <PrivateRoutes exact path="/dashboard/F06Form/:recordId" component={Dashboard} />
                        <PrivateRoutes exact path="/dashboard/F07Form/:recordId" component={Dashboard} />
                        <PrivateRoutes exact path="/dashboard/F08Form/:recordId" component={Dashboard} />
                        <PrivateRoutes exact path="/dashboard/F09Form/:recordId" component={Dashboard} />
                        <Route exact path="*" component={NoMatchPage} />
                    </Switch>
                </Suspense>
            </Router>
        </>
    );
}

export default AppRoute;
