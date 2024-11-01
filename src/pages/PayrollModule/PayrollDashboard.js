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
// import WelcomePage from "./Contents/WelcomePage";
import Leaf from "../../assets/Images/svg/leaf.svg";
import ControlledDialog from "../../components/ControlledDialog/ControlledDialog";
// import HomePage from "./Contents/LMS/HomePage/HomePage";
import F1000Form from "./Forms/F1000Form";

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
    color: "white",
    width: drawerWidth - 70,
    textOverflow: "clip",
    whiteSpace: "break-spaces",
  },
  active: {
    backgroundColor: "#103C6E",
    paddingTop: 5,
    paddingBottom: 5,
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
  return <Redirect to="/PayrollDashboard" />;
};

const PayrollDashboard = (props) => {
  const classes = useStyles();
  const [viewValue, setViewValue] = useState(props.match.params.value || "");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const adminData = localStorage.getItem("adminData")
    ? JSON.parse(localStorage.getItem("adminData"))
    : {};
  const { featureList = [] } = adminData;

  useEffect(() => {
    const check =
      adminData.isZoomVerified === 0 &&
      adminData.userTypeId === 3 &&
      window.localStorage.getItem("isViewDialog") == 0;
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
      {/* <ControlledDialog
        open={isDialogOpen}
        handleClose={() => {
          setDialogOpen(false);
          localStorage.setItem("isViewDialog", 1);
        }}
        title={"Error"}
        content={
          "Please accept zoom invitation sent on your registered email id "
        }
      /> */}
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
            {featureList.map((feature) => {
              const { items = [] } = feature;
              return (
                <div key={feature.typeId} className={classes.menuListContainer}>
                  <Typography className={classes.menuTitle} noWrap variant="h6">
                    <img alt="" className={classes.menuTitleIcon} src={Leaf} />{" "}
                    <div>{feature.typeLabel}</div>
                  </Typography>
                  <MenuList
                    style={{
                      outline: "none",
                    }}
                  >
                    {items.map((option) => {
                      return (
                        <MenuItem
                          key={option.id}
                          className={`${classes.menuItemPadding}`}
                        >
                          <Link
                            style={{ textDecoration: "none" }}
                            to={option.webUrl}
                          >
                            <Typography
                              className={`${classes.menuItemText} ${
                                viewValue === `${option.action}` &&
                                classes.active
                              }`}
                              noWrap
                              variant="body2"
                            >
                              {option.label}
                            </Typography>
                          </Link>
                        </MenuItem>
                      );
                    })}
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
              Copyright © {new Date().getFullYear()}. Universal College Lahore
              <br></br>(UCL), Pakistan - All Rights Reserved
            </Typography>
          </div>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isDrawerOpen && viewValue != "Payroll",
        })}
      >
        <div className={classes.toolbar} />
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="Payroll"
                exact
                path="/PayrollDashboard"
                // component={HomePage}
                component={F1000Form}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="F1000Form"
                exact
                path="/PayrollDashboard/F1000Form"
                component={F1000Form}
              />
              <SetRoute
                setValue={(value) => handleValueChange(value)}
                name="Payroll"
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

export default PayrollDashboard;
