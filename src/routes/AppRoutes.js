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
import R74ReportsAttendanceRecordSheet from '../pages/Dashboard/Contents/Forms/R74ReportsAttendanceRecordSheet';
import R210StudentProgressReport from '../pages/Dashboard/Contents/Forms/R210StudentProgressReport';
import R301StudentProgressReport from '../pages/Dashboard/Contents/Forms/R301StudentProgressReport';
import R301StudentProgressApprovedReport from '../pages/Dashboard/Contents/Forms/R301StudentProgressApprovedReport';
import R307ApprovedStudentProgressReports from '../pages/Dashboard/Contents/Forms/ApprovedStudentsProgressReports/R307ApprovedStudentProgressReports';
import R217FeedbackReports from '../pages/Dashboard/Contents/Forms/R217FeedbackReports';
import R216Reports from '../pages/Dashboard/Contents/Forms/R216Reports';
import R218StudentProgressReport from '../pages/Dashboard/Contents/Forms/R218StudentProgressReport';
import R232StudentProgressReport from '../pages/Dashboard/Contents/Forms/R232StudentProgressReport';
import R220StudentProgressReport from '../pages/Dashboard/Contents/Forms/R220StudentProgressReport';
import PayrollDashboard from "../pages/PayrollModule/PayrollDashboard";
import F357Reports from '../pages/Dashboard/Contents/Forms/F357Form/F357Reports';


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
            <PrivateRoutes exact path="/R74ReportsAttendanceRecordSheet/:id" component={R74ReportsAttendanceRecordSheet} />
            <PrivateRoutes exact path="/R210StudentProgressReport/:id" component={R210StudentProgressReport} />
            <PrivateRoutes exact path="/R301StudentProgressReport/:id" component={R301StudentProgressReport} />
            <PrivateRoutes exact path="/R301StudentProgressApprovedReport/:id" component={R301StudentProgressApprovedReport} />
            <PrivateRoutes exact path="/R216Reports/:id" component={R216Reports} />
            <PrivateRoutes exact path="/R217FeedbackReports/:id" component={R217FeedbackReports} />
            <PrivateRoutes exact path="/R218StudentProgressReport/:id" component={R218StudentProgressReport} />
            <PrivateRoutes exact path="/R220StudentProgressReport/:id" component={R220StudentProgressReport} />
            <PrivateRoutes exact path="/R307ApprovedStudentProgressReports/:id" component={R307ApprovedStudentProgressReports} />
            <PrivateRoutes exact path="/R232StudentProgressReport/:id" component={R232StudentProgressReport} />
            <PrivateRoutes exact path="/PayrollDashboard" component={PayrollDashboard} />
            <PrivateRoutes exact path="/F357Reports/:academicSessionId/:fromDate/:toDate" component={F357Reports} />
            <PrivateRoutes exact path="*" component={Dashboard} />
          </Switch>
        </Suspense>
      </Router>
    </>
  );
};


export default AppRoute;
