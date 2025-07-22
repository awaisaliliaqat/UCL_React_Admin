/* eslint-disable react/prop-types */

import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar, Drawer, Card, Button } from "@material-ui/core";
import ControlledDialog from "../ControlledDialog/ControlledDialog";

const drawerWidth = 300;

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth - 10,
  },
  drawerPaper: {
    width: drawerWidth,
    // color: "#F5F5F5",
    // backgroundColor: theme.palette.primary.main,
  },
  drawerContainer: {
    overflow: "auto",
    // justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
}));

const NotificationsBar = (props) => {
  const classes = useStyles();
  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationDialogObject, setNotificationDialogObject] = useState({});
  const { notiData = [] } = props;

  const onToggleNotificationDialog = (isOpen, object) => {
    setNotificationDialogOpen(isOpen);
    setNotificationDialogObject(object);
  };

  return (
    <Fragment>
      <ControlledDialog
        open={isNotificationDialogOpen}
        handleClose={() => onToggleNotificationDialog(false, {})}
        title={notificationDialogObject.label || ""}
        content={notificationDialogObject.anouncementDetails || ""}
      />
      <Drawer
        open={props.isNotiDrawerOpen}
        onClose={() => props.setNotiDrawerOpen(false)}
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#005fb1",
              textAlign: "center",
              textDecoration: "underline",
              padding: 10,
            }}
          >
            Notifications
          </div>
          {notiData.length > 0 ? (
            <Fragment>
              <div style={{ overflow: "auto" }}>
                {notiData.map((noti) => {
                  return (
                    <Card
                      key={noti.id}
                      style={{
                        margin: 10,
                        padding: 10,
                        border: "1px solid #dfdfdf",
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {noti.label}
                        </div>
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: 10,
                            color: "#7c7c7c",
                          }}
                        >
                          {noti.createdOn}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            fontSize: 12,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", 
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {noti.anouncementDetails}
                        </div>
                        <Button
                          style={{
                            padding: 0,
                            marginLeft: 10,
                            textTransform: "capitalize",
                            color: "white",
                            backgroundColor: "#174A84",
                            opacity: "0.8",
                            height: 25,
                          }}
                          onClick={() => onToggleNotificationDialog(true, noti)}
                          size="small"
                          variant="contained"
                        >
                          View
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Fragment>
          ) : (
            <div
              style={{
                textAlign: "center",
                margin: 30,
                color: "darkgray",
              }}
            >
              No Notifications Yet..!!
            </div>
          )}
        </div>
      </Drawer>
    </Fragment>
  );
};

NotificationsBar.propTypes = {
  isNotiDrawerOpen: PropTypes.bool,
  setNotiDrawerOpen: PropTypes.func,
  notiData: PropTypes.array,
};

NotificationsBar.defaultProps = {
  isNotiDrawerOpen: false,
  setNotiDrawerOpen: (fn) => fn,
  notiData: [],
};

export default NotificationsBar;
