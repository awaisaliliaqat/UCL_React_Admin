/* eslint-disable react/prop-types */
import React, { Fragment, useState, Suspense } from 'react';
import clsx from 'clsx';
import { HashRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import NavBar from '../../components/NavBar/NavBar';
import Logo from '../../assets/Images/logo.png';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import WelcomePage from './Contents/WelcomePage';
import Leaf from '../../assets/Images/svg/leaf.svg';
import AdmissionApplicationReports from './Contents/Reports/AdmissionApplicationReports/AdmissionApplicationReports';
// import ApplicantRegistrationAnalytics from './Contents/Analytics/ApplicantRegistrationAnalytics';
import AdmissionDecision from './Contents/Decision/AdmissionDecision/AddmissionDecision';
import RegistrationFeeApprovel from './Contents/Decision/RegistrationFeeApproval/RegistrationFeeApprovel';
import OfferLetter from './Contents/Decision/OfferLetter/OfferLetter';
import AssignAcccountId from './Contents/Decision/AssignAccountId/AssignAcccountId';
import UploadTutionFees from './Contents/Decision/UploadTutionFee/UploadTutionFees';
import TutionFeeApproval from './Contents/Decision/TutionFeeApproval/TutionFeeApproval';
import UploadDocuments from './Contents/Decision/DocumentRequest/DocumentRequest';
import DocumentRequestAction from './Contents/Decision/DocumentRequest/Chunks/DocumentRequestAction';
import EditStudentInformation from './Contents/Decision/EditStudentInformation/EditStudentInformation';
import EditStudentInformationAction from './Contents/Decision/EditStudentInformation/Chunks/EditStudentInformationAction';
import F06Form from './Contents/Forms/F06Form';
import F06Reports from './Contents/Forms/F06Reports';
import F07Form from './Contents/Forms/F07Form';
import F07Reports from './Contents/Forms/F07Reports';
import F08Form from './Contents/Forms/F08Form';
import F08Reports from './Contents/Forms/F08Reports';
import F09Form from './Contents/Forms/F09Form';
import F09Reports from './Contents/Forms/F09Reports';


const drawerWidth = 283;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuTitle: {
    backgroundColor: "#103C6E",
    fontFamily: 'sans-serif',
    display: 'flex',
    cursor: "default",
    fontSize: 16,
    fontWeight: 600,
    padding: 5,
    marginTop: 15
  },
  menuItemPadding: {
    padding: '0 !important',
    cursor: "pointer",
  },
  menuTitleIcon: {
    height: 25,
    width: 25,
    marginRight: 10,
    marginLeft: 15
  },
  menuItemText: {
    textAlign: 'left',
    paddingTop: 3,
    paddingBottom: 3,
    color: 'white',
    width: drawerWidth - 20,
    marginLeft: 40
  },
  active: {
    backgroundColor: "#103C6E",
    paddingRight: 10,
    width: drawerWidth - 20,
    height: 30
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth - 10,
  },
  drawerPaper: {
    width: drawerWidth,
    color: '#F5F5F5',
    backgroundColor: '#174A84',
  },
  drawerContainer: {
    overflow: 'auto',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  regular: {
    minHeight: 0
  },
  menuListContainer: {
    borderLeft: '3px solid'
  }
}));

const SetRoute = ({ name, setValue, ...rest }) => {
  setValue(name);
  return (
    <Route {...rest} />
  );
}

const NoFound = () => {
  return (
    <Redirect to="/dashboard" />
  )
}

const Dashboard = props => {
  const classes = useStyles();
  const [viewValue, setViewValue] = useState(props.match.params.value || "");
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const adminData = localStorage.getItem('adminData') ? JSON.parse(localStorage.getItem('adminData')) : {};
  const { featureList = [] } = adminData;

  const handleValueChange = value => {
    setViewValue(value);
  }

  const setOpenMenu = (e) => {
    e.preventDefault();
    const prevFlag = isDrawerOpen;
    setDrawerOpen(!prevFlag);
  }

  return (
    <Fragment>
      <NavBar setOpenMenu={(e) => setOpenMenu(e)} isOpenMenu={isDrawerOpen} logo={Logo} title="University College London" isAuthorize userName={adminData.displayName} />
      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper
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
                            <MenuItem key={option.id} className={`${classes.menuItemPadding} ${viewValue === `${option.action}` && classes.active}`}>
                              <Link style={{ textDecoration: 'none' }} to={option.webUrl}>
                                <Typography className={classes.menuItemText}
                                  noWrap variant="body2">{option.label}</Typography>
                              </Link>
                            </MenuItem>
                          );
                        })
                      }
                    </MenuList>
                  </div>
                );
              })

            }

          </div>
          <div style={{ maxWidth: drawerWidth - 15, paddingBottom: 10, paddingTop: 20 }}>
            <Typography variant="body2" style={{ fontSize: 12, color: 'white' }} align="center">
              Copyright © {new Date().getFullYear()}. University College Lahore<br></br>(UCL), Pakistan - All Rights Reserved
              </Typography>
          </div>

        </div>

      </Drawer>
      <main className={clsx(classes.content, {
        [classes.contentShift]: isDrawerOpen,
      })}>
        <div className={classes.toolbar} />
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <SetRoute setValue={value => handleValueChange(value)} name="home" exact path="/dashboard" component={WelcomePage} />
              <SetRoute setValue={value => handleValueChange(value)} name="admission-application-reports" exact path="/dashboard/admission-application-reports" component={AdmissionApplicationReports} />
              {/* <SetRoute setValue={value => handleValueChange(value)} name="applicant-registration-analytics" exact path="/dashboard/applicant-registration-analytics" component={ApplicantRegistrationAnalytics} /> */}
              <SetRoute setValue={value => handleValueChange(value)} name="admission-decision" exact path="/dashboard/admission-decision" component={AdmissionDecision} />
              <SetRoute setValue={value => handleValueChange(value)} name="registration-fee-approval" exact path="/dashboard/registration-fee-approval" component={RegistrationFeeApprovel} />
              <SetRoute setValue={value => handleValueChange(value)} name="raise-document-requests" exact path="/dashboard/raise-document-requests" component={UploadDocuments} />
              <SetRoute setValue={value => handleValueChange(value)} name="raise-document-requests" exact path="/dashboard/raise-document-requests/:id" component={DocumentRequestAction} />
              <SetRoute setValue={value => handleValueChange(value)} name="offer-letter" exact path="/dashboard/offer-letter" component={OfferLetter} />

              <SetRoute setValue={value => handleValueChange(value)} name="F06Form" exact path="/dashboard/F06Form/:recordId" render={(props) => {
                return (
                  <F06Form {...props} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
                )
              }} />
              <SetRoute setValue={value => handleValueChange(value)} name="F06Reports" exact path="/dashboard/F06Reports" component={F06Reports} />
              <SetRoute setValue={value => handleValueChange(value)} name="F07Form" exact path="/dashboard/F07Form/:recordId" render={(props) => {
                return (
                  <F07Form {...props} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
                )
              }} />
              <SetRoute setValue={value => handleValueChange(value)} name="F07Reports" exact path="/dashboard/F07Reports" component={F07Reports} />
              <SetRoute setValue={value => handleValueChange(value)} name="F08Form" exact path="/dashboard/F08Form/:recordId" render={(props) => {
                return (
                  <F08Form {...props} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
                )
              }} />
              <SetRoute setValue={value => handleValueChange(value)} name="F08Reports" exact path="/dashboard/F08Reports" component={F08Reports} />
              <SetRoute setValue={value => handleValueChange(value)} name="F09Form" exact path="/dashboard/F09Form/:recordId" render={(props) => {
                return (
                  <F09Form {...props} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
                )
              }} />
              <SetRoute setValue={value => handleValueChange(value)} name="F09Reports" exact path="/dashboard/F09Reports" component={F09Reports} />


              <SetRoute setValue={value => handleValueChange(value)} name="assign-account-id" exact path="/dashboard/assign-account-id" component={AssignAcccountId} />
              <SetRoute setValue={value => handleValueChange(value)} name="upload-tuition-fees" exact path="/dashboard/upload-tuition-fees" component={UploadTutionFees} />
              <SetRoute setValue={value => handleValueChange(value)} name="tuition-fee-approval" exact path="/dashboard/tuition-fee-approval" component={TutionFeeApproval} />
              <SetRoute setValue={value => handleValueChange(value)} name="edit-student-information" exact path="/dashboard/edit-student-information" component={EditStudentInformation} />
              <SetRoute setValue={value => handleValueChange(value)} name="edit-student-information" exact path="/dashboard/edit-student-information/:id" component={EditStudentInformationAction} />
              <SetRoute setValue={value => handleValueChange(value)} name="home" exact path="*" component={NoFound} />
            </Switch>
          </Suspense>
        </Router>
      </main>
    </Fragment>
  );
}

export default Dashboard;
