import React, { Suspense } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Registration from "../pages/Registration/Registration";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import PrivateRoutes from "./PrivateRoutes";
import DisplayAdmissionApplication from "../components/DisplayAdmissionApplications";
import DisplayStudentProfile from '../pages/Dashboard/Contents/Reports/StudentProfile/DisplayStudentProfile';
import R59ReportsAttendanceSheet from '../pages/Dashboard/Contents/Forms/R59ReportsAttendanceSheet';
import R68ReportsAttendanceRecordSheet from '../pages/Dashboard/Contents/Forms/R68ReportsAttendanceRecordSheet';
import R71ReportsAttendanceRecordSheet from '../pages/Dashboard/Contents/Forms/R71ReportsAttendanceRecordSheet';

const CheckLogin = () => {
  const uclAdminToken = localStorage.getItem("uclAdminToken");
  if (uclAdminToken) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Login />;
  }
};

const AppRoute = () => {

  return (
    <>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path="/login" component={CheckLogin} />
            <Route exact path="/registration" component={Registration} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <PrivateRoutes exact path="/view-application/:id" component={DisplayAdmissionApplication} />
            <PrivateRoutes exact path="/view-student-profile/:id" component={DisplayStudentProfile} />
            <PrivateRoutes exact path="/R59ReportsAttendanceSheet/:id" component={R59ReportsAttendanceSheet} />
            <PrivateRoutes exact path="/R68ReportsAttendanceRecordSheet/:id" component={R68ReportsAttendanceRecordSheet} />
            <PrivateRoutes exact path="/R71ReportsAttendanceRecordSheet/:id" component={R71ReportsAttendanceRecordSheet} />
            <PrivateRoutes exact path="*" component={Dashboard} />
          </Switch>
        </Suspense>
      </Router>
    </>
  );
};


export default AppRoute;
