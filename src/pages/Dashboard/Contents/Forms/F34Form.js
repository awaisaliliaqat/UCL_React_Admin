import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
//import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberExp } from "../../../../utils/regularExpression";
import { TextField, Grid, Button, CircularProgress } from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import MenuItem from "@material-ui/core/MenuItem";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";

const styles = () => ({
  root: {
    padding: 20,
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  },
});

class F34Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      totalMarks: "",
      totalMarksError: "",
      instruction: "",
      instructionError: "",
      startDate: [],
      startDateError: "",
      dueDate: this.getTomorrowDate(),
      dueDateError:"",
      subjectId:"",
      subjectIdError:"",
      subjectIdMenuItems:[]
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
    this.setState({
      isOpenSnackbar: false,
    });
  };

  getTomorrowDate = () => {
    let a = new Date();
    a.setDate(a.getDate() + 1);
    return a;
  }

  getDateInString = (todayDate) => {
    let today = todayDate;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = dd + "-" + mm + "-" + yyyy;
    return today;
  };

  getSubjectsData = async() => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C07CommonSchoolsView`;
    await fetch(url, {
      method: "POST",
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
            let subjectIdMenuItems = json.DATA;
            this.setState({subjectIdMenuItems: json.DATA});
            console.log("getSubjectsData", subjectIdMenuItems)
          } else {
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C07CommonProgrammeGroupsView`;
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
            if(json.DATA.length){
              // alert("json.DATA[0].schoolId"+json.DATA[0].schoolId);
              this.setState({
                label: json.DATA[0].label,
                shortLabel: json.DATA[0].shortLabel,
                schoolId: json.DATA[0].schoolId,
              });
            }else{
              window.location = "#/dashboard/F34Form/0";
            }
          } else {
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isTotalMarksValid = () => {
    let isValid = true;
    if (!this.state.totalMarks) {
      this.setState({ totalMarksError: "Please enter Total Marks." });
      document.getElementById("totalMarks").focus();
      isValid = false;
    } else {
      this.setState({ totalMarksError: "" });
    }
    return isValid;
  };

  isInstructionValid = () => {
    let isValid = true;
    if (!this.state.instruction) {
      this.setState({ instructionError: "Please enter instruction." });
      document.getElementById("instruction").focus();
      isValid = false;
    } else {
      this.setState({ instructionError: "" });
    }
    return isValid;
  };

  isStartDateValid = () => {
    let isValid = true;
    if (!this.state.startDate) {
      this.setState({ startDateError: "Please select start date." });
      document.getElementById("startDate").focus();
      isValid = false;
    } else {
      this.setState({ startDateError: "" });
    }
    return isValid;
  };

  isDueDateValid = () => {
    let isValid = true;
    if (!this.state.dueDate) {
      this.setState({ dueDateError: "Please select due date." });
      document.getElementById("dueDate").focus();
      isValid = false;
    } else {
      this.setState({ dueDateError: "" });
    }
    return isValid;
  };

  isSubjectIdValid = () => {
    let isValid = true;
    if (!this.state.subjectId) {
      this.setState({ subjectIdError: "Please select subject." });
      document.getElementById("subjectId").focus();
      isValid = false;
    } else {
      this.setState({ subjectIdError: "" });
    }
    return isValid;
  };

  handleChangeStartDate = (date) => {
    this.setState({startDate: date});
  };

  handleChangeDueDate = (date) => {
    this.setState({dueDate: date});
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "totalMarks":
        regex = new RegExp(numberExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    //e.preventDefault();
    if (
      !this.isTotalMarksValid() ||
      !this.isInstructionValid() ||
      !this.isStartDateValid() ||
      !this.isDueDateValid() ||
      !this.isSubjectIdValid()
    ) {
      return;
    }
    return;
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C07CommonProgrammeGroupsSave`;
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
            this.handleOpenSnackbar(json.USER_MESSAGE, "success");
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F07Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F34Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
    this.getSubjectsData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
      } else {
        window.location.reload();
      }
    }
  }

  render() {

    const { classes } = this.props;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField
            type="hidden"
            name="recordId"
            value={this.state.recordId}
          />
          <Grid 
            container 
            component="main"
            className={classes.root}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              Assignments
            </Typography>
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={12} md={6}>
                <TextField
                  id="totalMarks"
                  name="totalMarks"
                  label="Total Marks"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.totalMarks}
                  error={!!this.state.totalMarksError}
                  helperText={this.state.totalMarksError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="instruction"
                  name="instruction"
                  label="Instruction"
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  onChange={this.onHandleChange}
                  value={this.state.instruction}
                  error={!!this.state.instructionError}
                  helperText={this.state.instructionError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  autoOk
                  name="startDate"
                  id="startDate"
                  label="Start Date"
                  invalidDateMessage=""
                  disablePast
                  //minDate={this.getTomorrowDate()}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  //style={{ float: "right", width: 115 }}
                  value={this.state.startDate}
                  onChange={this.handleChangeStartDate}
                  error={!!this.state.preDateError}
                  helperText={this.state.startDateError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  autoOk
                  name="dueDate"
                  id="dueDate"
                  label="Due Date"
                  invalidDateMessage=""
                  disablePast
                  minDate={this.getTomorrowDate()}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  //style={{ float: "right", width: 115 }}
                  value={this.state.dueDate}
                  onChange={this.handleChangeDueDate}
                  error={!!this.state.dueDateError}
                  helperText={this.state.dueDateError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="subjectId"
                  name="subjectId"
                  variant="outlined"
                  label="Subject"
                  onChange={this.onHandleChange}
                  value={this.state.subjectId}
                  error={!!this.state.subjectIdError}
                  helperText={this.state.subjectIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.subjectIdMenuItems ? 
                    this.state.subjectIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"subjectIdMenuItems"+dt.ID}
                        value={dt.ID}
                      >
                        {dt.Label}
                      </MenuItem>
                    ))
                  :
                    this.state.isLoading && <Grid container justify="center"><CircularProgress /></Grid>
                  }
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading}
          isDrawerOpen={this.props.isDrawerOpen}
        />
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(F34Form);
