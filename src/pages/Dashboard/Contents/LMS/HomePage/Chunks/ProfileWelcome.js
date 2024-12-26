import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { Card, CardHeader, Avatar, Link } from "@material-ui/core";

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
  card: {
    height: "30vh",
    opacity: 1,
    backgroundSize: "cover",
    position: "relative",
  },
  linkButton: {
    fontSize: "14px",
    marginLeft: "20%",
    borderRadius: "5px",
    padding: "10px 25px",
    background: "#1579AB",
    color: "white",
    textDecoration: "none",
    zIndex: 2,
    position: "relative",
  },
});

const ProfileWelcome = ({ classes }) => {
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
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar aria-label="Recipe" src={ProfilePlaceHolder} />}
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
      <div
        style={{
          marginTop: "15px",
        }}
      >
        <Link
          href="#/dashboard/R338AttendanceDailyReport"
          target="_blank"
          variant="body1"
          className={classes.linkButton}
        >
          Track Gate Attendance
        </Link>
      </div>
    </Card>
  );
};

ProfileWelcome.propTypes = {
  classes: PropTypes.object.isRequired,
  sectionsData: PropTypes.array,
};

ProfileWelcome.defaultProps = {
  sectionsData: [],
};

export default withStyles(styles)(ProfileWelcome);
