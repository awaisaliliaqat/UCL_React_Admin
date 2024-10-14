import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AssignmentsIcon from "../../../../../../assets/Images/grade_book_assignments.png";
import { withStyles } from "@material-ui/core/styles";

import {
  Card,
  CardHeader,
  Button,
  Typography,
  Avatar,
  CardContent,
  Divider,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@material-ui/core";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import ProfilePlaceHolder from "../../../../../../assets/Images/ProfilePlaceholder.png";

const styles = () => ({
  smallAvatar: {
    width: 30,
    height: 30,
    marginTop: 12,
    marginRight: 15,
    marginLeft: "-15px",
  },
  action: {
    display: "flex",
  },
  handCursor: {
    cursor: "pointer",
    listStyleType: "square",
    fontSize: "0.9em",
    fontWeight: 500,
  },
});

const Profile = (props) => {
  const classes = props.classes;
  const adminData = localStorage.getItem("adminData")
    ? JSON.parse(localStorage.getItem("adminData"))
    : {};

  const [backendData, setBackendData] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataToGet = {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
        }),
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/CurrentEmployeeAttendanceView`,
        dataToGet
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "data is coming");
      setBackendData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader
        avatar={<Avatar aria-label="Recipe" src={ProfilePlaceHolder} />}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={adminData.displayName || "Student"}
        subheader={adminData.email || "N/A"}
      />
      <div
        style={{
          fontSize: "13px",
          marginLeft: "20%",
          color: "#757575",
        }}
      >
        Todays Check-in :{" "}
        {backendData?.DATA?.length > 0 &&
        backendData?.DATA[0]?.todaysAttendance !== 0 ? (
          <span
            style={{
              color: "#1579AB",
            }}
          >
            {backendData.DATA[0].todaysAttendance}
          </span>
        ) : (
          <span
            style={{
              color: "red",
            }}
          >
            No Check-in
          </span>
        )}
      </div>
      <CardContent style={{ paddingBottom: 0 }}>
        <Typography variant="caption">Quick Links</Typography>
        <Divider variant="fullWidth" />
        <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
          <Link
            href="#/dashboard/R61Reports"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Timetable
          </Link>
          <br />
          <Link
            href="#/dashboard/F33Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Calendar
          </Link>
          <br />
          <Link
            href="#/dashboard/teacher-attendance-report"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Attendance Report
          </Link>
          <br />
          <Link
            href="#/dashboard/R338AttendanceDailyReport"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Track My Attendance
          </Link>
          <br />
          <Link
            href="#/dashboard/F64Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Manual Attendance
          </Link>
          <br />
          <Link
            href="#/dashboard/F65Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Create Announcement
          </Link>
          <br />
          <Link
            href="#/dashboard/F67Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Sections Content
          </Link>
          <br />
          <Link
            href="#/dashboard/F77Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Assignments For Progress Report
          </Link>
          <br />
          <Link
            href="#/dashboard/R218Reports"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Students Progress For Teachers
          </Link>
          <br />
          <Link
            href="#/dashboard/R74Reports"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Students Attendance For Teachers
          </Link>
          <br />
          <Link
            href="#/dashboard/F201Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Subjective Evaluation
          </Link>
          <br />
          <Link
            href="#/dashboard/F202Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Seminar Evaluation
          </Link>
          <br />
          <Link
            href="#/dashboard/F331GeneratedSalarySlip/0"
            // target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Salary Slip
          </Link>
          {/* <br /> */}
          {/* <Link
            href="#/dashboard/F202Form/0"
            target="_blank"
            variant="body1"
            className={classes.handCursor}
          >
            Tax Certificate
          </Link> */}
          <br />
        </div>

        <br />
        <Typography variant="caption">Announcements</Typography>
        <Divider variant="fullWidth" />
        <div
          style={{
            paddingLeft: "10px",
            marginTop: "5px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.anouncementData.map((item, index) => {
            if (index < 5) {
              return (
                <Fragment key={item.label + index}>
                  <Link
                    onClick={() => props.onAnnouncementClick(item)}
                    variant="body1"
                    className={classes.handCursor}
                  >
                    <div
                      style={{
                        width: 200,
                        textOverflow: "ellipsis",
                        display: "inline-block",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {" "}
                      {item.label}
                    </div>{" "}
                    <span
                      style={{
                        fontSize: 12,
                        color: "grey",
                        float: "right",
                        marginTop: 5,
                      }}
                    >
                      {item.anouncementDate}
                    </span>
                  </Link>
                  <br />
                </Fragment>
              );
            }
          })}
        </div>
        <br />
        <Typography variant="caption">Enrolled Sections</Typography>
        <Divider variant="fullWidth" />

        <List style={{ marginLeft: "-5px" }}>
          {props.sectionsData.map((item, index) => {
            if (index < 8) {
              return (
                <ListItem
                  key={index}
                  style={{ marginBottom: "-5px" }}
                  alignItems="flex-start"
                >
                  <Avatar
                    alt="img"
                    src={AssignmentsIcon}
                    className={classes.smallAvatar}
                  />
                  <ListItemText
                    primary={
                      <Typography component="legend" color="textPrimary">
                        {item.label}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="caption" color="textSecondary">
                          {`${item.courseLabel}`}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              );
            }
          })}
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardActions className={classes.action}>
        <Button
          disabled
          color={"primary"}
          style={{ marginLeft: "auto", textTransform: "none" }}
        >
          View All
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  sectionsData: PropTypes.array,
};

Profile.defaultProps = {
  sectionsData: [],
};

export default withStyles(styles)(Profile);
