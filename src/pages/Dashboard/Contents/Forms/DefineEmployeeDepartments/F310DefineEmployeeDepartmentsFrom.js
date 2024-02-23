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
import DefineEmployeeEntitiesTableComponent from "./chunks/DefineEmployeeDepartmentsTableComponent";
import { Delete } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

class F310DefineEmployeeDepartmentsFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTableFilter: false,
      employeeRolesTypesData: [],
      employeeRolesTypesDataLoading: false,
      employeesRolesObject: {},
      employeesRolesObjectError: "",
      employeeEntitiesTypesData: [],
      employeeEntitiesTypesDataLoading: false,
      employeesEntitiesObject: {},
      employeesEntitiesObjectError: "",

      employeesDepartmentsData: [],

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

  getEmployeeRolesTypesData = async (id) => {
    const data = new FormData();
    data.append("id", id);
    this.setState({ employeeRolesTypesDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C310CommonEmployeesRolesTypesView`;
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
              employeeRolesTypesData: json.DATA || [],
            });
          } else {
            //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
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
            // alert("Failed to Save ! Please try Again later.");
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ employeeRolesTypesDataLoading: false });
  };

  getEmployeesEntitiesData = async (roleObject) => {
    this.setState({ employeeEntitiesTypesDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C310CommonEmployeesEntitiesTypesView`;
    let data = new FormData();
    data.append("roleId", roleObject.id);
    await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
      body: data,
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
              employeeEntitiesTypesData: json.DATA || [],
            });
          } else {
            this.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Get Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ employeeEntitiesTypesDataLoading: false });
  };

  getEmployeesDepartmentsData = async (entityObject) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C310CommonEmployeesEntitiesDepartmentsTypesView`;
    let data = new FormData();
    data.append("entityId", entityObject.id);
    await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
      body: data,
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
              employeesDepartmentsData: json.DATA || [],
            });
          } else {
            this.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Get Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    let isValid = true;
    let { labelError, employeesRolesObjectError, employeesEntitiesObjectError } = this.state;

    if(!this.state.employeesRolesObject.id){
      isValid = false;
      employeesRolesObjectError = "Please select a role";
    } else {
      employeesRolesObjectError = "";
    }

    if(!this.state.employeesEntitiesObject.id){
      isValid = false;
      employeesEntitiesObjectError = "Please select a entity";
    } else {
      employeesEntitiesObjectError = "";
    }

    if (!this.state.label) {
      isValid = false;
      labelError = "Please add role label";
    } else {
      labelError = "";
    }

    this.setState({
      labelError,
      employeesRolesObjectError,
      employeesEntitiesObjectError
    });
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    const errMsg = "";

    switch (name) {
      case "employeesRolesObject":
        this.setState({
          employeesDepartmentsData: [],
          employeesEntitiesObject: {},
          employeesEntitiesObjectError: ""
        })
        if(value?.id){
        this.getEmployeesEntitiesData(value || []);
        } else {
          this.setState({
            employeeEntitiesTypesData: []
          })
        }
        break;
        case "employeesEntitiesObject":
          if(value?.id){
        this.getEmployeesDepartmentsData(value || []);} else {
          this.setState({
            employeesDepartmentsData: []
          })
        }
        break;
      default:
        break;
    }

    this.setState({
      [name]: value,
      [errName]: errMsg,
    });
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("F308FormSubmitBtn").click();
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
      data.append("roleTypeId", this.state.employeesRolesObject.id);
      data.append("entityTypeId", this.state.employeesEntitiesObject.id);
      this.setState({ isLoading: true });
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C310CommonEmployeesEntitiesDepartmentsTypesSave`;
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
              //alert(json.USER_MESSAGE);
              this.getEmployeesDepartmentsData(this.state.employeesEntitiesObject);
              this.handleOpenSnackbar(json.USER_MESSAGE, "success");
              this.resetForm();
            } else {
              //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
              this.handleOpenSnackbar(
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
              //alert("Failed to Save ! Please try Again later.");
              this.handleOpenSnackbar(
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C310CommonEmployeesEntitiesDepartmentsTypesDeleteById`;
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
            //alert(json.USER_MESSAGE);
            this.getEmployeesDepartmentsData(this.state.employeesEntitiesObject);
            this.handleOpenSnackbar("Deleted", "success");
          } else {
            //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
            this.handleOpenSnackbar(
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
            //alert("Failed to Save ! Please try Again later.");
            this.handleOpenSnackbar(
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
    this.getEmployeeRolesTypesData();
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "id", title: "ID" },
      { name: "label", title: "Entity Name" },
      {
        name: "action",
        title: "Action",
        getCellValue: (rowData) => {
          return (
            <IconButton
              onClick={(e) => this.onDeleteRecord(e, rowData.id)}
              color="secondary"
            >
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
          <Button
            id="F308FormSubmitBtn"
            type="submit"
            style={{ display: "none" }}
          >
            Submit Form
          </Button>
          <Grid container component="main" className={classes.root}>
            <Typography className={classes.pageTitle} variant="h5">
              Define Employee Departments
            </Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2} className={classes.container}>
              <Grid item xs={6}>
                <Autocomplete
                  id="employeesRolesObject"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.employeeRolesTypesData}
                  loading={this.state.employeeRolesTypesDataLoading}
                  value={this.state.employeesRolesObject}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesRolesObject", value },
                    })
                  }
                  
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        error={!!this.state.employeesRolesObjectError}
                        helperText={this.state.employeesRolesObjectError}
                        inputProps={inputProps}
                        label="Roles *"
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="employeesEntitiesObject"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.employeeEntitiesTypesData}
                  loading={this.state.employeeEntitiesTypesDataLoading}
                  value={this.state.employeesEntitiesObject}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesEntitiesObject", value },
                    })
                  }
                  
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        error={!!this.state.employeesEntitiesObjectError}
                        helperText={this.state.employeesEntitiesObjectError}
                        inputProps={inputProps}
                        label="Entities *"
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="label"
                  name="label"
                  label="Department Label"
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
                <DefineEmployeeEntitiesTableComponent
                  rows={this.state.employeesDepartmentsData || []}
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
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}

F310DefineEmployeeDepartmentsFrom.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F310DefineEmployeeDepartmentsFrom.defaultProps = {
  isDrawerOpen: true,
  setDrawerOpen: (fn) => fn,
  match: {
    params: {
      recordId: 0,
    },
  },
};
export default withStyles(styles)(F310DefineEmployeeDepartmentsFrom);
