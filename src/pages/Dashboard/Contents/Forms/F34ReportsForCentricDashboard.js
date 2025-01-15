import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import {
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import F34ReportsTableComponentForCentricDashboard from "./F34ReportsTableComponentForCentricDashboard";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const styles = () => ({
  root: {
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15
  },
  imageContainer: {
    height: 60,
    width: 60,
    border: "1px solid #ccc3c3",
    marginBottom: 5,
    marginTop: 20,
    marginLeft: 17,
    marginRight: 15,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
});

class F34ReportsForCentricDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      studentId: 0,
      studentDetails: {},
      assignmentsData: [],
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getStudentAssignmentsData = async (id) => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/lms/C34CommonStudentsViewForCentricDashboard?studentId=${
      id || this.state.studentId
    }`;
    await fetch(url, {
      method: "GET",
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
            let jsonData = json.DATA || [];
            let studentDetails = jsonData[0] || {};
            let assignmentsData = studentDetails.assignmentsList || [];

            for (var i = 0; i < assignmentsData.length; i++) {
              let isAssignmentGraded = assignmentsData[i].isAssignmentGraded;
              let gradedAssignmentUrl = assignmentsData[i].gradedAssignmentUrl;
              let fileName = assignmentsData[i].assignmentUrl;

              assignmentsData[i].fileDownload = (
                <Fragment>
                  <Tooltip title="Download Assignemt">
                    <IconButton
                      onClick={(e) => this.downloadFile(e, fileName)}
                      aria-label="download"
                      color="primary"
                      disabled={!fileName}
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  {isAssignmentGraded == 1 && (
                    <Tooltip title="Download Graded Assignemt">
                      <IconButton
                        onClick={(e) =>
                          this.downloadFile(e, gradedAssignmentUrl)
                        }
                        aria-label="download"
                        style={
                          gradedAssignmentUrl
                            ? { color: "rgb(76, 175, 80)" }
                            : { color: "primary" }
                        }
                        disabled={!gradedAssignmentUrl}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Fragment>
              );
            }

            this.setState({
              assignmentsData,
              studentDetails,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleSnackbar(
              true,
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  downloadMultipleFiles = (e, helpingMaterialFileName) => {
    console.log(e, helpingMaterialFileName);
    helpingMaterialFileName.map((dt) => this.DownloadFile(e, dt));
  };

  downloadFile = (e, fileName) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fileName", fileName);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
    fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else if (res.status === 401) {
          this.setState({
            isLoginMenu: true,
            isReload: false,
          });
          return {};
        } else {
          this.handleSnackbar(
            true,
            "Operation Failed, Please try again later.",
            "error"
          );
          return {};
        }
      })
      .then((result) => {
        var csvURL = window.URL.createObjectURL(result);
        var tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", fileName);
        tempLink.click();
        console.log(csvURL);
        if (result.CODE === 1) {
          //Code
        } else if (result.CODE === 2) {
          alert(
            "SQL Error (" +
              result.CODE +
              "): " +
              result.USER_MESSAGE +
              "\n" +
              result.SYSTEM_MESSAGE
          );
        } else if (result.CODE === 3) {
          alert(
            "Other Error (" +
              result.CODE +
              "): " +
              result.USER_MESSAGE +
              "\n" +
              result.SYSTEM_MESSAGE
          );
        } else if (result.error === 1) {
          alert(result.error_message);
        } else if (result.success === 0 && result.redirect_url !== "") {
          window.location = result.redirect_url;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    const { id = 0 } = this.props.match.params;
    this.setState({
      studentId: id,
    });
    this.getStudentAssignmentsData(id);
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "sectionLabel", title: "Section" },
      { name: "courseLabel", title: "Course" },
      { name: "label", title: "Assignment" },
      { name: "startDateReport", title: "Start\xa0Date" },
      { name: "dueDateReport", title: "Due\xa0Date" },
      { name: "totalMarks", title: "Total Marks" },
      { name: "fileDownload", title: "Download" },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div className={classes.root}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
                marginBottom: 5,
              }}
              variant="h5"
            >
              Student&apos;s Assignments
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 10
            }}
          />
          <Grid
            container
            spacing={2}
            style={{
              marginLeft: 5,
              marginRight: 15,
            }}
          >
            {/* <Grid
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              item
              xs={12}
            >
              <div
                className={classes.imageContainer}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${this.state.studentDetails.fileName})`,
                }}
              />
            </Grid> */}
            <Grid
              style={{
                marginBottom: 10,
                display: "flex",
                justifyContent: "center",
              }}
              item
              xs={12}
            >
              {/* <div
                className={classes.imageContainer}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${this.state.studentDetails.fileName})`,
                }}
              /> */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textTransform: "capitalize",
                textAlign: "center",
              }}>
                <Typography component="h5" variant="h5">
                  {`${this.state.studentDetails.studentId || "N/A"} - ${
                    this.state.studentDetails.displayName || "N/A"
                  }`}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {`${
                    this.state.studentDetails.academicSessionLabel || "N/A"
                  },  ${this.state.studentDetails.programmeLabel || "N/A"}`}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Divider
            style={{
              marginTop: 10,
              opacity: "0.8",
              width: "99%",
            }}
          />
          {this.state.assignmentsData ? (
            <F34ReportsTableComponentForCentricDashboard
              data={this.state.assignmentsData}
              columns={columns}
            />
          ) : (
            <Grid container justifyContent="center" alignItems="center">
              <CircularProgress />
            </Grid>
          )}
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
          />
        </div>
      </Fragment>
    );
  }
}

F34ReportsForCentricDashboard.propTypes = {
  setDrawerOpen: PropTypes.func,
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

F34ReportsForCentricDashboard.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
  setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F34ReportsForCentricDashboard);
