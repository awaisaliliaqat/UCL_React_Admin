import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  Divider,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F319DefineEmployeeSalaryAllowancesLabelTableComponent from "./chunks/F319DefineEmployeeSalaryAllowancesLabelTableComponent";
import { Delete } from "@material-ui/icons";

const styles = () => ({
  root: {
    padding: 20,
  },
  pageTitle: {
    color: "#1d5f98",
    fontWeight: 600,
    borderBottom: "1px solid #d2d2d2",
    width: "98%",
    marginBottom: 25,
    fontSize: 20,
  },
  divider: {
    backgroundColor: "rgb(58, 127, 187)",
    opacity: "0.3",
  },
  container: {
    marginLeft: 5,
    marginRight: 10,
  },
  reportsContainer: {
    marginLeft: 5,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  circularProgress: {
    color: "white",
  },
  button: {
    padding: 13,
  },
});

class F319DefineEmployeeSalaryAllowancesLabelFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTableFilter: false,
      employeeAllowancesLabelsData: [],

      recordId: this.props.match.params.recordId,
      label: "",
      labelError: "",

      isLoading: false,
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

  getEmployeesAllowancesLabelsData = async (id) => {
    const data = new FormData();
    data.append("id", id);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C319CommonEmployeesSalaryAllowancesLabelView`;
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
            this.setState({
              employeeAllowancesLabelsData: json.DATA || [],
            });
          } else {
            this.handleSnackbar(true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleSnackbar(true,
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    let isValid = true;
    let { labelError, employeeAllowancesLabelsData=[] } = this.state;

    if (!this.state.label) {
      isValid = false;
      labelError = "Please add allowance label";
    } else {
      labelError = "";
      let isIndexExists =  employeeAllowancesLabelsData.findIndex(item => item.label == this.state.label);
      if(isIndexExists >= 0){
        isValid = false;
        labelError = "Label already exists";
      }
    }

    this.setState({
      labelError,
    });
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    const errMsg = "";

    this.setState({
      [name]: value,
      [errName]: errMsg,
    });
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("F319FormSubmitBtn").click();
    }
  };

  resetForm = () => {
    this.setState({
      recordId: 0,
      label: "",
      labelError: "",
    });
  };

  onFormSubmit = async (e) => {
    e.preventDefault();
    if (this.isFormValid) {
      let myForm = document.getElementById("myForm");
      const data = new FormData(myForm);
      this.setState({ isLoading: true });
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C319CommonEmployeesSalaryAllowancesLabelSave`;
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
              this.getEmployeesAllowancesLabelsData();
              this.handleSnackbar(true, json.USER_MESSAGE, "success");
              this.resetForm();
            } else {
              this.handleSnackbar(true,
                json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                "error"
              );
            }
          },
          (error) => {
            if (error.status == 401) {
              this.setState({
                isLoginMenu: true,
                isReload: false,
              });
            } else {
              console.log(error);
              this.handleSnackbar( true, 
                "Failed to Save ! Please try Again later.",
                "error"
              );
            }
          }
        );
      this.setState({ isLoading: false });
    }
  };

  onDeleteRecord = async (e, id) => {
    e.preventDefault();
      const data = new FormData();
      data.append("id", id);
      this.setState({ isLoading: true });
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C319CommonEmployeesSalaryAllowancesLabelDelete`;
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
              this.getEmployeesAllowancesLabelsData();
              this.handleSnackbar(true, "Deleted", "success");
            } else {
              this.handleSnackbar(true, 
                json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                "error"
              );
            }
          },
          (error) => {
            if (error.status == 401) {
              this.setState({
                isLoginMenu: true,
                isReload: false,
              });
            } else {
              console.log(error);
              this.handleSnackbar(true,
                "Failed to Save ! Please try Again later.",
                "error"
              );
            }
          }
        );
      this.setState({ isLoading: false });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getEmployeesAllowancesLabelsData();
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "id", title: "ID" },
      { name: "label", title: "Allowance Label" },
      {
        name: "action",
        title: "Action",
        getCellValue: (rowData) => {
          return (
            <IconButton onClick={e => this.onDeleteRecord(e, rowData.id)} color="secondary">
              <Delete fontSize="small" key={rowData.id} />
            </IconButton>
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
        <form id="myForm" onSubmit={this.onFormSubmit}>
          <TextField
            type="hidden"
            name="recordId"
            value={this.state.recordId}
          />
          <Button id="F319FormSubmitBtn" type="submit" style={{ display: "none"}}>Submit Form</Button>
          <Grid container component="main" className={classes.root}>
            <Typography className={classes.pageTitle} variant="h5">
              Define Employee Salary Allowance Label
            </Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2} className={classes.container}>
              <Grid item xs={11}>
                <TextField
                  id="label"
                  name="label"
                  label="Allowance Label"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={!!this.state.labelError}
                  helperText={this.state.labelError}
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  className={classes.button}
                  disabled={this.state.isLoading}
                  color="primary"
                  variant="contained"
                  onClick={(e) => this.clickOnFormSubmit(e)}
                  fullWidth
                >
                  {this.state.isLoading ? (
                    <CircularProgress
                      className={classes.circularProgress}
                      size={24}
                    />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.reportsContainer}>
              <Grid item xs={12}>
                <Divider />
                <F319DefineEmployeeSalaryAllowancesLabelTableComponent
                  rows={this.state.employeeAllowancesLabelsData || []}
                  columns={columns}
                  showFilter={this.state.showTableFilter}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>

        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
        />
      </Fragment>
    );
  }
}

F319DefineEmployeeSalaryAllowancesLabelFrom.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F319DefineEmployeeSalaryAllowancesLabelFrom.defaultProps = {
  isDrawerOpen: true,
  setDrawerOpen: (fn) => fn,
  match: {
    params: {
      recordId: 0,
    },
  },
};
export default withStyles(styles)(F319DefineEmployeeSalaryAllowancesLabelFrom);
