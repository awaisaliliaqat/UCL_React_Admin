/* eslint-disable react/prop-types */
import React, { Fragment, useState, Suspense } from 'react';
import clsx from 'clsx';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
import AdmissionApplicationReports from './Contents/Reports/AdmissionApplicationReports';
// import ApplicantRegistrationAnalytics from './Contents/Analytics/ApplicantRegistrationAnalytics';
import AdmissionDecision from './Contents/Decision/AddmissionDecision';
import RegistrationFeeApprovel from './Contents/Decision/RegistrationFeeApprovel';
import OfferLetter from './Contents/Decision/OfferLetter';
import AssignAcccountId from './Contents/Decision/AssignAcccountId';
import UploadTutionFees from './Contents/Decision/UploadTutionFees';
import TutionFeeApproval from './Contents/Decision/TutionFeeApproval';
// import UploadDocuments from './Contents/Decision/DocumentRequest';
// import DocumentRequestAction from './Contents/Decision/Chunks/DocumentRequestAction';

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
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    color: 'white',
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

const Dashboard = props => {
  const classes = useStyles();
  const [viewValue, setViewValue] = useState(props.match.params.value || "");
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const adminData = JSON.parse(localStorage.getItem('adminData'));

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
            {/* <div className={classes.menuListContainer}>
            <Typography className={classes.menuTitle} noWrap variant="h6">
              <img alt="" className={classes.menuTitleIcon} src={Leaf} /> <div>Analytics</div>
            </Typography>
            <MenuList>
              <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "applicant-registration-analytics" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/applicant-registration-analytics'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Applicant Registration</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "addmission-application-analytics" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/addmission-application-analytics'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Addmission Application</Typography>
                </Link>
              </MenuItem>
            </MenuList>
          </div> */}

            <div className={classes.menuListContainer}>
              <Typography className={classes.menuTitle} noWrap variant="h6">
                <img alt="" className={classes.menuTitleIcon} src={Leaf} /> <div>Reports</div>
              </Typography>
              <MenuList>
                {/* <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "applicant-registration-reports" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/applicant-registration-reports'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Applicant Registration</Typography>
                </Link>
              </MenuItem> */}
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "admission-application-reports" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/admission-application-reports'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2">Addmission Application</Typography>
                  </Link>
                </MenuItem>
                {/* <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "registration-fee-payment-reports" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/registration-fee-payment-reports'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Registration Fee Payments</Typography>
                </Link>
              </MenuItem> */}
                {/* <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "addmission-decision-reports" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/addmission-decision-reports'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Addmission Decision</Typography>
                </Link>
              </MenuItem> */}
                {/* <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "tution-fee-payment-reports" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/tution-fee-payment-reports'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Tution Fee Payments</Typography>
                </Link>
              </MenuItem> */}
              </MenuList>
            </div>

            <div className={classes.menuListContainer}>
              <Typography className={classes.menuTitle} noWrap variant="h6">
                <img alt="" className={classes.menuTitleIcon} src={Leaf} /> <div>Dashboards</div>
              </Typography>
              <MenuList>
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "registration-fee-approval" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/registration-fee-approval'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2"> Registration Fee Approval</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "admission-decision" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/admission-decision'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2">Admission Decision</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "offer-letter" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/offer-letter'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2">Offer Letter</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "assign-account-id" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/assign-account-id'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2">Assign Accounts Id</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "upload-tution-fees" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/upload-tution-fees'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2">Upload Tution Fee Vochers</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "tution-fee-approval" && classes.active}`}>
                  <Link style={{ textDecoration: 'none' }} to='/dashboard/tution-fee-approval'>
                    <Typography className={classes.menuItemText}
                      noWrap variant="body2">Tution Fee Approval</Typography>
                  </Link>
                </MenuItem>
                {/* <MenuItem onClick={() => setDrawerOpen(false)} className={`${classes.menuItemPadding} ${viewValue === "document-requests" && classes.active}`}>
                <Link style={{ textDecoration: 'none' }} to='/dashboard/document-requests'>
                  <Typography className={classes.menuItemText}
                    noWrap variant="body2">Document Requests</Typography>
                </Link>
              </MenuItem> */}
              </MenuList>
            </div>
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
              {/* <SetRoute setValue={value => handleValueChange(value)} name="document-requests" exact path="/dashboard/document-requests" component={UploadDocuments} /> */}
              {/* <SetRoute setValue={value => handleValueChange(value)} name="document-requests" exact path="/dashboard/document-requests/:id" component={DocumentRequestAction} /> */}
              <SetRoute setValue={value => handleValueChange(value)} name="offer-letter" exact path="/dashboard/offer-letter" component={OfferLetter} />
              <SetRoute setValue={value => handleValueChange(value)} name="assign-account-id" exact path="/dashboard/assign-account-id" component={AssignAcccountId} />
              <SetRoute setValue={value => handleValueChange(value)} name="upload-tution-fees" exact path="/dashboard/upload-tution-fees" component={UploadTutionFees} />
              <SetRoute setValue={value => handleValueChange(value)} name="tution-fee-approval" exact path="/dashboard/tution-fee-approval" component={TutionFeeApproval} />
            </Switch>
          </Suspense>
        </Router>
      </main>
    </Fragment>
  );
}

export default Dashboard;
