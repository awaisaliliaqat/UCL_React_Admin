/* eslint-disable react/prop-types */

import React, { Fragment, useState, Suspense, useEffect } from "react";
import clsx from "clsx";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import NavBar from "../../components/NavBar/NavBar";
import Logo from "../../assets/Images/logo.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import WelcomePage from "./Contents/WelcomePage";
import Leaf from "../../assets/Images/svg/leaf.svg";
import AdmissionApplicationReports from "./Contents/Reports/AdmissionApplicationReports/AdmissionApplicationReports";
import AdmissionDecision from "./Contents/Decision/AdmissionDecision/AddmissionDecision";
import RegistrationFeeApprovel from "./Contents/Decision/RegistrationFeeApproval/RegistrationFeeApprovel";
import OfferLetter from "./Contents/Decision/OfferLetter/OfferLetter";
import AssignAcccountId from "./Contents/Decision/AssignAccountId/AssignAcccountId";
import UploadTutionFees from "./Contents/Decision/UploadTutionFee/UploadTutionFees";
import TutionFeeApproval from "./Contents/Decision/TutionFeeApproval/TutionFeeApproval";
import UploadDocuments from "./Contents/Decision/DocumentRequest/DocumentRequest";
import DocumentRequestAction from "./Contents/Decision/DocumentRequest/Chunks/DocumentRequestAction";
import EditStudentInformation from "./Contents/Decision/EditStudentInformation/EditStudentInformation";
import EditStudentInformationAction from "./Contents/Decision/EditStudentInformation/Chunks/EditStudentInformationAction";
import DefineTeacherFrom from "./Contents/Forms/DefineTeacher/DefineTeacherForm";
import DefineTeacherReports from "./Contents/Forms/DefineTeacher/DefineTeacherReports";
import CreateSectionForm from "./Contents/Forms/CreateSection/CreateSectionForm";
import CreateSectionReports from "./Contents/Forms/CreateSection/CreateSectionReports";
import AssignSectionToStudentFrom from "./Contents/Forms/AssignSectionToStudent/AssignSectionToStudentForm";
import AssignSectionToTeacherForm from "./Contents/Forms/AssignSectionToTeacher/AssignSectionToTeacherForm";
import StudentCourseSelection from "./Contents/Forms/StudentCourseSelection/StudentCourseSelection";
import AssignSectionToStudentReport from "./Contents/Forms/AssignSectionToStudent/AssignSectionToStudentReports";
import AssignSectionToTeacherReport from "./Contents/Forms/AssignSectionToTeacher/AssignSectionToTeacherReports";
import F06Form from "./Contents/Forms/F06Form";
import F06Reports from "./Contents/Forms/F06Reports";
import F07Form from "./Contents/Forms/F07Form";
import F07Reports from "./Contents/Forms/F07Reports";
import F08Form from "./Contents/Forms/F08Form";
import F08Reports from "./Contents/Forms/F08Reports";
import F09Form from "./Contents/Forms/F09Form";
import F09Reports from "./Contents/Forms/F09Reports";
import F18Form from "./Contents/Forms/F18Form";
import F18Reports from "./Contents/Forms/F18Reports";
import F19Form from "./Contents/Forms/F19Form";
import F20Form from "./Contents/Forms/F20Form";
import F20Reports from "./Contents/Forms/F20Reports";
import F24Form from "./Contents/Forms/F24Form";
import F24Reports from "./Contents/Forms/F24Reports";
import F25Form from "./Contents/Forms/F25Form";
import F27Form from "./Contents/Forms/F27Form";
import F30Form from "./Contents/Forms/F30Form";
import F31Form from "./Contents/Forms/F31Form";
import F33Form from "./Contents/Forms/F33Form";
import F34Form from "./Contents/Forms/F34Form";
import F34Reports from "./Contents/Forms/F34Reports";
import F36Form from "./Contents/Forms/F36Form";
import ControlledDialog from '../../components/ControlledDialog/ControlledDialog';
import TeacherAttendance from './Contents/LMS/TeacherAttendance/TeacherAttendance';
import StudentReports from './Contents/Reports/StudentReports/StudentReports';
import TeacherAttendanceReports from './Contents/Reports/TeacherAttendanceReports/AttendanceReports';
import StudentAttendanceReports from './Contents/Reports/StudentAttendanceReports/AttendanceReports';
import F39Form from "./Contents/Forms/F39Form";
import F39Reports from "./Contents/Forms/F39Reports";
import F40Form from './Contents/LMS/F40GradedDiscussion/F40Form';
import F40Reports from './Contents/LMS/F40GradedDiscussion/F40Reports';
import GradedDiscussionBoardList from './Contents/LMS/GradedDiscussionBoardList/GradedDiscussionBoardList';
import GradedDiscussionBoardStudentList from './Contents/LMS/GradedDiscussionBoardStudentList/GradedDiscussionBoardStudentList';
import GradedDiscussionSummary from './Contents/Reports/GradedDiscussionSummary/GradedDiscussionSummary';
import R41Reports from "./Contents/Forms/R41Reports";
import R46Reports from "./Contents/Forms/R46Reports";
import R47Reports from "./Contents/Forms/R47Reports";
import R49Reports from "./Contents/Forms/R49Reports";
import StudentProfile from './Contents/Reports/StudentProfile/StudentProfile';
import ChangeStudentStatus from './Contents/Decision/ChangeStudentStatus/ChangeStudentStatus';
import SyncTimeTable from './Contents/LMS/SyncTimeTable/SyncTimeTable';
import SyncZoomMeetings from "./Contents/LMS/SyncZoomMeetings/SyncZoomMeetings";
import CreateRoomForm from './Contents/Forms/CreateRoom/CreateRoomFrom';
import CreateRoomReports from './Contents/Forms/CreateRoom/CreateRoomReports';

const drawerWidth = 283;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuTitle: {
    backgroundColor: "#103C6E",
    fontFamily: "sans-serif",
    display: "flex",
    cursor: "default",
    fontSize: 16,
    fontWeight: 600,
    padding: 5,
    marginTop: 15,
  },
  menuItemPadding: {
    padding: "0 !important",
    cursor: "pointer",
  },
  menuTitleIcon: {
    height: 25,
    width: 25,
    marginRight: 10,
    marginLeft: 15,
  },
  menuItemText: {
    textAlign: "left",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 25,
    color: 'white',
    width: drawerWidth - 70,
    textOverflow: 'clip',
    whiteSpace: 'break-spaces'
  },
  active: {
    backgroundColor: "#103C6E",
    paddingTop: 5,
    paddingBottom: 5
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth - 10,
  },
  drawerPaper: {
    width: drawerWidth,
    color: "#F5F5F5",
    backgroundColor: "#174A84",
  },
  drawerContainer: {
    overflow: "auto",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  regular: {
    minHeight: 0,
  },
  menuListContainer: {
    borderLeft: "3px solid",
  },
}));

const SetRoute = ({ name, setValue, ...rest }) => {
  setValue(name);
  return <Route {...rest} />;
};

const NoFound = () => {
  return <Redirect to="/dashboard" />;
};

const Dashboard = (props) => {
  const classes = useStyles();
  const [viewValue, setViewValue] = useState(props.match.params.value || "");
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const adminData = localStorage.getItem("adminData")
    ? JSON.parse(localStorage.getItem("adminData"))
    : {};
  const { featureList = [] } = adminData;

  useEffect(() => {
    const check = adminData.isZoomVerified === 0 && adminData.userTypeId === 3 && window.localStorage.getItem("isViewDialog") == 0;
    setDialogOpen(check);
  }, []);

  const handleValueChange = (value) => {
    setViewValue(value);
  };

  const setOpenMenu = (e) => {
    e.preventDefault();
    const prevFlag = isDrawerOpen;
    setDrawerOpen(!prevFlag);
  };



  return (
    <Fragment>
      <ControlledDialog open={isDialogOpen} handleClose={() => { setDialogOpen(false); localStorage.setItem("isViewDialog", 1); }} title={'Error'}
        content={'Please accept zoom invitation sent on your registered email id '} />
      <NavBar
        setOpenMenu={(e) => setOpenMenu(e)}
        isOpenMenu={isDrawerOpen}
        logo={Logo}
        title="University College London"
        isAuthorize
        userName={adminData.displayName}
      />
      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <div>
            {
              featureList.map(feature => {
                const { items = [] } = feature;
                return (
                  <div key={feature.typeId} className={classes.menuListContainer}>
                    <Typography className={classes.menuTitle} noWrap variant="h6">
                      <img alt="" className={classes.menuTitleIcon} src={Leaf} /> <div>{feature.typeLabel}</div>
                    </Typography>
                    <MenuList style={{
                      outline: 'none'
                    }}>
                      {
                        items.map(option => {
                          return (
                            <MenuItem key={option.id} className={`${classes.menuItemPadding}`}>
                              <Link style={{ textDecoration: 'none' }} to={option.webUrl}>
                                <Typography className={`${classes.menuItemText} ${viewValue === `${option.action}` && classes.active}`}
                                  noWrap variant="body2">{option.label}</Typography>
                              </Link>
                            </MenuItem>
                          );
                        })
                      }
                    </MenuList>
                  </div>
                );
              })}
          </div>
          <div
            style={{
              maxWidth: drawerWidth - 15,
              paddingBottom: 10,
              paddingTop: 20,
            }}
          >
            <Typography
              variant="body2"
              style={{ fontSize: 12, color: "white" }}
              align="center"
            >
              Copyright © {new Date().getFullYear()}. University College Lahore
              <br></br>(UCL), Pakistan - All Rights Reserved
            </Typography>
          </div>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isDrawerOpen,
        })}
      >
        <div className={classes.toolbar} />
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="home"
                exact
                path="/dashboard"
                component={WelcomePage}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="admission-application-reports"
                exact
                path="/dashboard/admission-application-reports"
                component={AdmissionApplicationReports}
              />
              {/* <SetRoute setValue={value => handleValueChange(value)} name="applicant-registration-analytics" exact path="/dashboard/applicant-registration-analytics" component={ApplicantRegistrationAnalytics} /> */}
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="admission-decision"
                exact
                path="/dashboard/admission-decision"
                component={AdmissionDecision}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="registration-fee-approval"
                exact
                path="/dashboard/registration-fee-approval"
                component={RegistrationFeeApprovel}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="raise-document-requests"
                exact
                path="/dashboard/raise-document-requests"
                component={UploadDocuments}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="raise-document-requests"
                exact
                path="/dashboard/raise-document-requests/:id"
                component={DocumentRequestAction}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="offer-letter"
                exact
                path="/dashboard/offer-letter"
                component={OfferLetter}
              />

              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F06Form"
                exact
                path="/dashboard/F06Form/:recordId"
                render={(props) => {
                  return (
                    <F06Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F06Form"
                exact
                path="/dashboard/F06Reports"
                render={(props) => {
                  return (
                    <F06Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F07Form"
                exact
                path="/dashboard/F07Form/:recordId"
                render={(props) => {
                  return (
                    <F07Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F07Reports"
                exact
                path="/dashboard/F07Reports"
                component={F07Reports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F08Form"
                exact
                path="/dashboard/F08Form/:recordId"
                render={(props) => {
                  return (
                    <F08Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F08Reports"
                exact
                path="/dashboard/F08Reports"
                component={F08Reports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F09Form"
                exact
                path="/dashboard/F09Form/:recordId"
                render={(props) => {
                  return (
                    <F09Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F09Reports"
                exact
                path="/dashboard/F09Reports"
                render={(props) => {
                  return (
                    <F09Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F18Form"
                exact
                path="/dashboard/F18Form/:recordId"
                render={(props) => {
                  return (
                    <F18Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F18Reports"
                exact
                path="/dashboard/F18Reports"
                render={(props) => {
                  return (
                    <F18Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F19Form"
                exact
                path="/dashboard/F19Form/:recordId"
                render={(props) => {
                  return (
                    <F19Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F20Form"
                exact
                path="/dashboard/F20Form/:recordId"
                render={(props) => {
                  return (
                    <F20Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F20Reports"
                exact
                path="/dashboard/F20Reports"
                component={F20Reports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F24Form"
                exact
                path="/dashboard/F24Form/:recordId"
                render={(props) => {
                  return (
                    <F24Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F24Reports"
                exact
                path="/dashboard/F24Reports"
                render={(props) => {
                  return (
                    <F24Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F25Form"
                exact
                path="/dashboard/F25Form/:recordId"
                render={(props) => {
                  return (
                    <F25Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F27Form"
                exact
                path="/dashboard/F27Form/:recordId"
                render={(props) => {
                  return (
                    <F27Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F30Form"
                exact
                path="/dashboard/F30Form/:recordId"
                render={(props) => {
                  return (
                    <F30Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F31Form"
                exact
                path="/dashboard/F31Form/:recordId"
                render={(props) => {
                  return (
                    <F31Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F33Form"
                exact
                path="/dashboard/F33Form/:recordId"
                render={(props) => {
                  return (
                    <F33Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F34Form"
                exact
                path="/dashboard/F34Form/:recordId"
                render={(props) => {
                  return (
                    <F34Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F34Form"
                exact
                path="/dashboard/F34Reports"
                render={(props) => {
                  return (
                    <F34Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F36Form"
                exact
                path="/dashboard/F36Form/:recordId"
                render={(props) => {
                  return (
                    <F36Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F39Form"
                exact
                path="/dashboard/F39Form/:recordId"
                render={(props) => {
                  return (
                    <F39Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F39Reports"
                exact
                path="/dashboard/F39Reports"
                render={(props) => {
                  return (
                    <F39Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F40Form"
                exact
                path="/dashboard/F40Form/:recordId"
                render={(props) => {
                  return (
                    <F40Form
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F40Reports"
                exact
                path="/dashboard/F40Reports"
                render={(props) => {
                  return (
                    <F40Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="R41Reports"
                exact
                path="/dashboard/R41Reports"
                render={(props) => {
                  return (
                    <R41Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="R46Reports"
                exact
                path="/dashboard/R46Reports"
                render={(props) => {
                  return (
                    <R46Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="R47Reports"
                exact
                path="/dashboard/R47Reports"
                render={(props) => {
                  return (
                    <R47Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="R49Reports"
                exact
                path="/dashboard/R49Reports"
                render={(props) => {
                  return (
                    <R49Reports
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="assign-account-id"
                exact
                path="/dashboard/assign-account-id"
                component={AssignAcccountId}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="upload-tuition-fees"
                exact
                path="/dashboard/upload-tuition-fees"
                component={UploadTutionFees}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="tuition-fee-approval"
                exact
                path="/dashboard/tuition-fee-approval"
                component={TutionFeeApproval}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="edit-student-information"
                exact
                path="/dashboard/edit-student-information"
                component={EditStudentInformation}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="edit-student-information"
                exact
                path="/dashboard/edit-student-information/:id"
                component={EditStudentInformationAction}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="define-teachers"
                exact
                path="/dashboard/define-teachers/:recordId"
                render={(props) => {
                  return (
                    <DefineTeacherFrom {...props} isDrawerOpen={isDrawerOpen} />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="define-teachers"
                exact
                path="/dashboard/teacher-reports"
                component={DefineTeacherReports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="create-sections"
                exact
                path="/dashboard/create-sections/:recordId"
                render={(props) => {
                  return (
                    <CreateSectionForm {...props} isDrawerOpen={isDrawerOpen} />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="create-sections"
                exact
                path="/dashboard/section-reports"
                component={CreateSectionReports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="assign-section-to-students"
                exact
                path="/dashboard/assign-section-to-student-reports"
                component={AssignSectionToStudentReport}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="assign-section-to-students"
                exact
                path="/dashboard/assign-section-to-students/:recordId"
                render={(props) => {
                  return (
                    <AssignSectionToStudentFrom
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="assign-section-to-teacher"
                exact
                path="/dashboard/assign-section-to-teacher-reports"
                component={AssignSectionToTeacherReport}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="assign-section-to-teacher"
                exact
                path="/dashboard/assign-section-to-teacher/:recordId"
                render={(props) => {
                  return (
                    <AssignSectionToTeacherForm
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="student-course-selection"
                exact
                path="/dashboard/student-course-selection"
                component={StudentCourseSelection}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="teacher-attendance-report"
                exact
                path="/dashboard/teacher-attendance-report"
                component={TeacherAttendance}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="students-excel-report"
                exact
                path="/dashboard/students-excel-report"
                component={StudentReports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="teacher-attendance-reports-admin"
                exact
                path="/dashboard/teacher-attendance-reports-admin"
                component={TeacherAttendanceReports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="student-attendance-reports-admin"
                exact
                path="/dashboard/student-attendance-reports-admin"
                component={StudentAttendanceReports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="graded-discussion-board-list"
                exact
                path="/dashboard/graded-discussion-board-list"
                component={GradedDiscussionBoardList}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="graded-discussion-board-list"
                exact
                path="/dashboard/graded-discussion-board-list/:id"
                component={GradedDiscussionBoardStudentList}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="teacher-gdb-summary-report"
                exact
                path="/dashboard/teacher-gdb-summary-report"
                component={GradedDiscussionSummary}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="student-profile"
                exact
                path="/dashboard/student-profile"
                component={StudentProfile}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="sync-time-table"
                exact
                path="/dashboard/sync-time-table"
                component={SyncTimeTable}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="sync-zoom-meetings"
                exact
                path="/dashboard/sync-zoom-meetings"
                component={SyncZoomMeetings}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="change-student-status"
                exact
                path="/dashboard/change-student-status"
                render={(props) => {
                  return (
                    <ChangeStudentStatus
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="maintain-class-rooms"
                exact
                path="/dashboard/create-room-reports"
                component={CreateRoomReports}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="maintain-class-rooms"
                exact
                path="/dashboard/maintain-class-rooms/:recordId"
                render={(props) => {
                  return (
                    <CreateRoomForm
                      {...props}
                      isDrawerOpen={isDrawerOpen}
                    />
                  );
                }}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="home"
                exact
                path="*"
                component={NoFound}
              />
            </Switch>
          </Suspense>
        </Router>
      </main>
    </Fragment>
  );
};

export default Dashboard;
