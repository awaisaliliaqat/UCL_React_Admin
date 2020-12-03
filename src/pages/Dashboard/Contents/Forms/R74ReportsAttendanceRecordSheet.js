import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Logo from "../../../../assets/Images/logo.png";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton, Typography, CircularProgress } from "@material-ui/core";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

const styles = (theme) => ({
  mainDiv: {
    margin: "10px 10px 0px 10px",
    "@media print": {
      minWidth: "7.5in",
      maxWidth: "11in",
    },
  },
  closeButton: {
    top: theme.spacing(1),
    right: theme.spacing(2),
    zIndex: 1,
    border: "1px solid #ff4040",
    borderRadius: 5,
    position: "fixed",
    padding: 3,
    "@media print": {
      display: "none",
    },
  },
  bottomSpace: {
    marginBottom: 40,
    "@media print": {
      display: "none",
    },
  },
  overlay: {
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 2,
    marginTop: -10
  },
  overlayContent: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "300px",
    color: "white",
    fontSize: 48,
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
  },
  titleContainer: {
    display: "black",
    marginLeft: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bolder",
    fontFamily: "sans-serif",
    color: "#2f57a5",
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#2f57a5",
  },
  subTitle2: {
    fontSize: 18,
    fontWeight: 600,
    color: "#2f57a5",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  table: {
    minWidth: 700,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(47, 87, 165)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: "1px solid white",
  },
  body: {
    fontSize: 14,
    border: "1px solid rgb(29, 95, 152)",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

class R74ReportsAttendanceRecordSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      data: {},
      isLoading: false,
      isLoginMenu: false,
      isReload: false,
      fromDateLabel: "",
      toDateLabel: "",
      tableData: [],
      academicSessionLabel: "",
      sectionLabel: "",
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isOpenSnackbar: false });
  };

  getDateInString = (todayDate = 0) => {
    let today = new Date(parseInt(todayDate));
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = dd + "/" + mm + "/" + yyyy;
    return today;
  };

  getData = async (sessionId = 0, sectionId = 0, fromDate = 0, toDate = 0) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", sessionId);
    data.append("sectionId", sectionId);
    data.append("fromDate", this.getDateInString(fromDate));
    data.append("toDate", this.getDateInString(toDate));
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C74StudentsSectionAttandance`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          if (json.CODE === 1) {
            this.setState({ tableData: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getData", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    const { id = "0&0&0&0" } = this.props.match.params;
    let ids = id.split("&");
    console.log(ids[0] + " - " + ids[1] + " - " + ids[2] + " - " + ids[3]+"-"+ids[4]);
    this.getDateInString(ids[2]);
    this.getData(ids[0], ids[1], ids[2], ids[3]);
    this.setState({
      fromDateLabel: this.getDateInString(ids[2]),
      toDateLabel: this.getDateInString(ids[3]),
      sectionLabel: ids[4],
      academicSessionLabel: ids[5],
    });
  }

  render() {
    const { classes } = this.props;
    const { tableData } = this.state;
    const { sessionLabel = "" } = tableData;
    return (
      <Fragment>
        {this.state.isLoading && (
          <div className={classes.overlay}>
            <div className={classes.overlayContent}>
              <CircularProgress
                style={{ marginBottom: 10, color: "white" }}
                size={36}
              />
              <span>Loading...</span>
            </div>
          </div>
        )}
        <div className={classes.mainDiv}>
          <IconButton
            onClick={() => window.close()}
            aria-label="close"
            className={classes.closeButton}
          >
            <CloseIcon color="secondary" />
          </IconButton>
          <div className={classes.headerContainer}>
            <div className={classes.titleContainer}>
              <span className={classes.title}>
                University College Lahore&emsp;&emsp;&emsp;&emsp;
                {sessionLabel}
              </span>
              <br />
              <span className={classes.subTitle}>
                Attendance Record &nbsp;&nbsp;
                <small>
                  {this.state.fromDateLabel + " - " + this.state.toDateLabel}
                </small>
                <br />
                <small>
                  {this.state.academicSessionLabel +
                    " - " +
                    this.state.sectionLabel}
                </small>
              </span>
            </div>
          </div>
          <div className={classes.flexColumn}>
            <br />
            <TableContainer component={Paper} style={{ overflowX: "inherit" }}>
              <Table
                size="small"
                className={classes.table}
                aria-label="customized table"
              >
                <TableHead>
                  {/* <TableRow>
                    <StyledTableCell rowSpan="2" style={{borderLeft: "1px solid rgb(47, 87, 165)" }}>Course</StyledTableCell>
                    <StyledTableCell align="center" colSpan="2">Lectures</StyledTableCell>
                    <StyledTableCell align="center" colSpan="2">Tutorials</StyledTableCell>
                    <StyledTableCell align="center" colSpan="2">Total</StyledTableCell>
                    <StyledTableCell rowSpan="2" align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>%</StyledTableCell>
                  </TableRow> */}
                  <TableRow>
                    {/* <StyledTableCell style={{ borderLeft: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                    <StyledTableCell rowSpan="2" style={{borderLeft: "1px solid rgb(47, 87, 165)" }}>STUDENTS</StyledTableCell>
                    <StyledTableCell align="center">Schedule</StyledTableCell>
                    <StyledTableCell align="center">Attended</StyledTableCell>
                    <StyledTableCell rowSpan="2" align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>%</StyledTableCell>
                    {/* <StyledTableCell align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.tableData.length > 0 ? (
                    this.state.tableData.map((row, index) => (
                      <Fragment key={"row" + row.studentId + index}>
                        <TableRow>
                          <StyledTableCell align="left" style={{ backgroundColor: "#e1e3e8" }}><b>{row.studentLabel}</b></StyledTableCell>
                          <StyledTableCell align="center">{row.scheduled}</StyledTableCell>
                          <StyledTableCell align="center">{row.attandance}</StyledTableCell>
                          <StyledTableCell align="center">{row.attandancePercentage}</StyledTableCell>
                          
                        </TableRow>
                        {/* {row.teacherCourseData.map((row2, index2) => 
                         <TableRow>
                            <StyledTableCell colSpan="8">&nbsp;</StyledTableCell>
                         </TableRow>
                          // <TableRow key={"row" + row2.courseId + index2}>
                          //   <StyledTableCell style={{borderLeft: "1px solid rgb(47, 87, 165)"}}>{row2.courseLabel}</StyledTableCell>
                          //   <StyledTableCell align="center">{row2.attandanceCountScheduledLectures}</StyledTableCell>
                          //   <StyledTableCell align="center">{row2.attandanceCountAttendedLectures}</StyledTableCell>
                          //   <StyledTableCell align="center">{row2.attandanceCountScheduledTutorials}</StyledTableCell>
                          //   <StyledTableCell align="center">{row2.attandanceCountAttendedTutorials}</StyledTableCell>
                          //   <StyledTableCell align="center">{row2.attandanceCountScheduledLectures + row2.attandanceCountScheduledTutorials}</StyledTableCell>
                          //   <StyledTableCell align="center">{row2.attandanceCountAttendedLectures + row2.attandanceCountAttendedTutorials}</StyledTableCell>
                          //   <StyledTableCell align="center" style={{borderRight: "1px solid rgb(47, 87, 165)"}}>{row2.attandancePercentage}</StyledTableCell>
                          // </TableRow>
                        )} */}
                      </Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableCell colSpan="3">&nbsp;</StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className={classes.bottomSpace}></div>
        </div>
      </Fragment>
    );
  }
}

R74ReportsAttendanceRecordSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(R74ReportsAttendanceRecordSheet);
