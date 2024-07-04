import React, { Component, Fragment } from "react";
import {
  Divider,
  CircularProgress,
  Grid,
  Button,
  Typography,
  TextField,
} from "@material-ui/core";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import R314StudentsListTableComponent from "./chunks/R314StudentsListTableComponent";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import R314StudentCentricDashboardDialog from "./chunks/R314StudentCentricDashboardDialog";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  resize: {
    padding: 10,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  label: {
    textAlign: "left",
    font: "bold 14px Lato",
    letterSpacing: 0,
    color: "#174A84",
    opacity: 1,
    marginBottom: 5,
    inlineSize: "max-content",
  },
  button: {
    textTransform: "capitalize",
    fontSize: 14,
  },
});

class R314StudentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      studentId: "",
      studentIdError: "",
      studentName: "",
      studentNameError: "",

      tableData: [],

      selectData: {},
      isOpenDashboardDialog: false,
    };
  }

  handleDashboardDialog = (open, data) => {
    this.setState({
      isOpenDashboardDialog: open,
      selectData: data,
    });
  };

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

  getData = async () => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("studentId", this.state.studentId);
    data.append("studentName", this.state.studentName);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C314CommonStudentsView`;
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
            let jsonArray = json.DATA || [];
            if (jsonArray.length > 0) {
              for (let i = 0; i < jsonArray.length; i++) {
                let featuresData = [
                  {
                    id: 1,
                    label: "Student Profile",
                    action: `#/view-student-profile/${jsonArray[i].studentId || 0}`,
                  },
                  {
                    id: 2,
                    label: "Student Activate/Deactivate",
                    action: `#/dashboard/change-student-status?studentId=${
                      jsonArray[i].studentId || 0
                    }&academicSessionId=${jsonArray[i].academicSessionId || 0}`,
                  },
                  {
                    id: 3,
                    label: "Edit Student Profile",
                    action: `#/dashboard/edit-student-information/${
                      jsonArray[i].id || 0}`,
                  },
                  {
                    id: 5,
                    label: "Assign Section to Students",
                    action: "",
                  },
                  {
                    id: 6,
                    label: "Student Course Selection",
                    action: `#/dashboard/student-course-selection?studentId=${
                      jsonArray[i].studentId || 0
                    }&academicSessionId=${jsonArray[i].academicSessionId || 0}&programmeGroupId=${jsonArray[i].programmeGroupId || 0}`,
                  },
                  {
                    id: 7,
                    label: "Student Achievements",
                    action: "",
                  },
                  {
                    id: 8,
                    label: "Student Achievements With Programme",
                    action: "",
                  },
                  {
                    id: 9,
                    label: "Student Promotion and Exit",
                    action: "",
                  },
                  { id: 10, label: "UOL Enrolment", action: `#/dashboard/F212Form/0?studentId=${
                      jsonArray[i].studentId || 0
                    }&academicSessionId=${jsonArray[i].academicSessionId || 0}` },
                ];

                jsonArray[i]["featuresData"] = featuresData;
              }

              this.setState({ tableData: jsonArray });
            }
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
              isReload: false,
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

  onClearAllData() {
    this.setState({
      tableData: [],

      studentId: "",
      studentIdError: "",

      studentName: "",
      studentNameError: "",
    });
  }

  onHandleRightClick = (e, row) => {
    e.preventDefault();
    this.handleDashboardDialog(true, row);
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "serialNo", title: "SR#" },
      { name: "studentId", title: "NucleusID" },
      { name: "displayName", title: "Student\xa0Name" },
      { name: "programmeLabel", title: "Programme" },
      {
        name: "action",
        title: "Action",
        getCellValue: (rowData) => {
          console.log(rowData);
          return (
            <Button
              onClick={() => this.handleDashboardDialog(true, rowData || {})}
              variant="outlined"
              color="default"
              style={{ textTransform: "capitalize" }}
            >
              View
            </Button>
          );
        },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            padding: 20,
          }}
        >
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
              }}
              variant="h5"
            >
              {"Student's Centric Dashboard"}
              <br />
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br />
          <Grid container justify="left" alignItems="left" spacing={2}>
            <Grid item xs={3}>
              <span className={classes.label}>Nucleus ID</span>
              <TextField
                placeholder="ID"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{ classes: { input: classes.resize } }}
                value={this.state.studentId}
                name="studentId"
                onChange={(e) => {
                  this.onHandleChange(e);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <span className={classes.label}>Name</span>
              <TextField
                placeholder="Name"
                variant="outlined"
                fullWidth
                InputProps={{ classes: { input: classes.resize } }}
                value={this.state.studentName}
                name="studentName"
                onChange={(e) => {
                  this.onHandleChange(e);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={
                    (!this.state.studentId && !this.state.studentName) ||
                    this.state.isLoading
                  }
                  onClick={() => this.getData()}
                >
                  {" "}
                  {this.state.isLoading ? (
                    <CircularProgress style={{ color: "white" }} size={24} />
                  ) : (
                    "Search"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  disabled={this.state.isLoading}
                  onClick={() => this.onClearAllData()}
                  style={{
                    marginLeft: 8,
                  }}
                >
                  Clear
                </Button>
              </div>
            </Grid>
          </Grid>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginTop: 15,
            }}
          />

          {this.state.tableData && !this.state.isLoading ? (
            <R314StudentsListTableComponent
              data={this.state.tableData}
              columns={columns}
              showFilter={this.state.showTableFilter}
              onHandleRightClick={(e, row) => this.onHandleRightClick(e, row)}
            />
          ) : (
            <Grid container justify="center">
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <br />
                <CircularProgress disableShrink />
              </Grid>
            </Grid>
          )}
          <R314StudentCentricDashboardDialog
            open={this.state.isOpenDashboardDialog}
            handleClose={() => this.handleDashboardDialog(false, {})}
            data={this.state.selectData}
          />
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleCloseSnackbar()}
          />
        </div>
      </Fragment>
    );
  }
}

R314StudentsList.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

R314StudentsList.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};

export default withStyles(styles)(R314StudentsList);
