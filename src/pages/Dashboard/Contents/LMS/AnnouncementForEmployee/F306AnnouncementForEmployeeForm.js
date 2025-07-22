import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Chip, Checkbox } from "@material-ui/core";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const styles = () => ({
  root: {
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
  },
  title: {
    color: "#1d5f98",
    fontWeight: 600,
    borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
    width: "98%",
    marginBottom: 25,
    fontSize: 20,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    whiteSpace: "break-spaces",
    paddingRight: 22,
    paddingLeft: 5,
  },
  chip: {
    margin: 2,
  },
  foundedEmployeesLabel: {
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    height: "90%",
    marginLeft: 10,
  },
});

class F306AnnouncementForEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isLoginMenu: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      label: "",
      labelError: "",
      announcementDetails: "",
      announcementDetailsError: "",
      announcementDate: null,
      announcementDateError: "",

      employeesRolesData: [],
      employeesRolesDataLoading: false,
      employeesRolesArray: [],
      employeesRolesArrayError: "",

      employeesEntitiesData: [],
      employeesEntitiesDataLoading: false,
      employeesEntitiesArray: [],
      employeesEntitiesArrayError: "",

      employeesDepartmentsData: [],
      employeesDepartmentsDataLoading: false,
      employeesDepartmentsArray: [],
      employeesDepartmentsArrayError: "",

      employeesSubDepartmentsData: [],
      employeesSubDepartmentsDataLoading: false,
      employeesSubDepartmentsArray: [],
      employeesSubDepartmentsArrayError: "",

      employeesDesignationsData: [],
      employeesDesignationsDataLoading: false,
      employeesDesignationsArray: [],
      employeesDesignationsArrayError: "",

      totalUsersCount: 0,
    };
  }

  getEmployeesRolesData = async () => {
    this.setState({ employeesRolesDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonEmployeesRolesTypesView`;
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
            this.setState({
              employeesRolesData: json.DATA || [],
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
    this.setState({ employeesRolesDataLoading: false });
  };

  getEmployeesCounterData = async (
    roleIds,
    entityIds,
    departmentIds,
    subDepartmentIds,
    designationsIds
  ) => {
    let data = new FormData();
    const roleIdsArray = roleIds || [];
    for (let i = 0; i < roleIdsArray.length; i++) {
      data.append("roleIds", roleIdsArray[i]["id"]);
    }

    const entityIdsArray = entityIds || [];
    for (let i = 0; i < entityIdsArray.length; i++) {
      data.append("entityIds", entityIdsArray[i]["id"]);
    }

    const departmentIdsArray = departmentIds || [];
    for (let i = 0; i < departmentIdsArray.length; i++) {
      data.append("departmentIds", departmentIdsArray[i]["id"]);
    }

    const subDepartmentIdsArray = subDepartmentIds || [];
    for (let i = 0; i < subDepartmentIdsArray.length; i++) {
      data.append("subDepartmentIds", subDepartmentIdsArray[i]["id"]);
    }

    const designationIdsArray = designationsIds || [];
    for (let i = 0; i < designationIdsArray.length; i++) {
      data.append("designationsIds", designationIdsArray[i]["id"]);
    }
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonAcademicsAnnouncementsForEmployeesCountView`;
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
            const data = json.DATA || [];
            const { totalUsersCount = 0 } = data[0] || {};

            this.setState({
              totalUsersCount,
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
          }
        }
      );
    this.setState({ employeesRolesDataLoading: false });
  };

  getEmployeesDesignationsData = async (
    entityIds,
    departmentIds,
    subDepartmentIds
  ) => {
    this.setState({ employeesDesignationsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonEmployeesEntitiesDesignationsTypesView`;
    let data = new FormData();
    data.append("entityId", entityIds);
    data.append("departmentId", departmentIds);
    data.append("subDepartmentId", subDepartmentIds);
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
              employeesDesignationsData: json.DATA || [],
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
    this.setState({ employeesDesignationsDataLoading: false });
  };

  getEmployeesEntitiesData = async (roleIds) => {
    this.setState({ employeesEntitiesDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonEmployeesEntitiesTypesView`;
    let data = new FormData();
    if (roleIds != null && roleIds.length > 0) {
      for (let i = 0; i < roleIds.length; i++) {
        data.append("roleId", roleIds[i].id);
      }
    }
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
              employeesEntitiesData: json.DATA || [],
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
    this.setState({ employeesEntitiesDataLoading: false });
  };

  getEmployeesDepartmentsData = async (entityIds) => {
    this.setState({ employeesDepartmentsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonEmployeesEntitiesDepartmentsTypesView`;
    let data = new FormData();
    if (entityIds != null && entityIds.length > 0) {
      for (let i = 0; i < entityIds.length; i++) {
        data.append("entityId", entityIds[i].id);
      }
    }
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
    this.setState({ employeesDepartmentsDataLoading: false });
  };

  getEmployeesSubDepartmentsData = async (entityIds, departmentIds) => {
    this.setState({ employeesSubDepartmentsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonEmployeesEntitiesSubDepartmentsTypesView`;
    let data = new FormData();
    if (entityIds != null && entityIds.length > 0) {
      for (let i = 0; i < entityIds.length; i++) {
        data.append("entityId", entityIds[i].id);
      }
    }
    if (departmentIds != null && departmentIds.length > 0) {
      for (let i = 0; i < departmentIds.length; i++) {
        data.append("departmentId", departmentIds[i].id);
      }
    }
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
              employeesSubDepartmentsData: json.DATA || [],
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
    this.setState({ employeesSubDepartmentsDataLoading: false });
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
    this.setState({
      isOpenSnackbar: false,
    });
  };

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonAcademicsAnnouncementsForEmployeesView`;
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
            const data = json.DATA || [];
            if (data.length > 0) {
              const {
                label,
                announcementDetails,
                announcementDate,
                employeesRolesArray = [],
                employeesEntitiesArray = [],
                employeesDepartmentsArray = [],
                employeesSubDepartmentsArray = [],
                employeesDesignationsArray = [],
              } = data[0] || {};

              this.getEmployeesEntitiesData(employeesRolesArray);
              this.getEmployeesDepartmentsData(employeesEntitiesArray);
              this.getEmployeesSubDepartmentsData(
                employeesEntitiesArray,
                employeesDepartmentsArray
              );
              this.getEmployeesCounterData(
                employeesRolesArray,
                employeesEntitiesArray,
                employeesDepartmentsArray,
                employeesSubDepartmentsArray,
                employeesDesignationsArray
              );

              this.setState({
                label,
                announcementDetails,
                announcementDate,
                employeesRolesArray,
                employeesEntitiesArray,
                employeesDepartmentsArray,
                employeesSubDepartmentsArray,
                employeesDesignationsArray,
              });
            } else {
              window.location = "#/dashboard/announcements";
            }
          } else {
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
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to load announcements data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    let isValid = true;
    let {
      labelError,
      announcementDateError,
      announcementDetailsError,
      employeesRolesArrayError,
    } = this.state;

    if (!(this.state.employeesRolesArray?.length > 0)) {
      isValid = false;
      employeesRolesArrayError = "Please select roles";
    } else {
      employeesRolesArrayError = "";
    }

    if (!this.state.announcementDate) {
      announcementDateError = "Please select the announcement date";
      isValid = false;
    } else {
      announcementDateError = "";
    }

    if (!this.state.label) {
      labelError = "Please enter announcement title";
      isValid = false;
    } else {
      labelError = "";
    }

    if (!this.state.announcementDetails) {
      announcementDetailsError = "Please enter announcement details";
      isValid = false;
    } else {
      announcementDetailsError = "";
    }

    this.setState({
      labelError,
      announcementDateError,
      announcementDetailsError,
      employeesRolesArrayError,
    });

    return isValid;
  };

  resetForm = () => {
    this.setState({
      recordId: 0,
      label: "",
      labelError: "",
      announcementDetails: "",
      announcementDetailsError: "",
      announcementDate: null,
      announcementDateError: "",
      isAnnouncementForStudents: false,
      isAnnouncementForTeachers: false,

      employeesRolesDataLoading: false,
      employeesRolesArray: [],
      employeesRolesArrayError: "",

      employeesEntitiesData: [],
      employeesEntitiesDataLoading: false,
      employeesEntitiesArray: [],
      employeesEntitiesArrayError: "",

      employeesDepartmentsData: [],
      employeesDepartmentsDataLoading: false,
      employeesDepartmentsArray: [],
      employeesDepartmentsArrayError: "",

      employeesSubDepartmentsData: [],
      employeesSubDepartmentsDataLoading: false,
      employeesSubDepartmentsArray: [],
      employeesSubDepartmentsArrayError: "",

      employeesDesignationsDataLoading: false,
      employeesDesignationsArray: [],
      employeesDesignationsArrayError: "",

      totalUsersCount: 0
    });
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("announcementSubmit").click();
    }
  };

  onFormSubmit = async (e) => {
    e.preventDefault();

    this.setState({ isLoading: true });

    const data = new FormData(e.target);

    const roleIdsArray = this.state.employeesRolesArray || [];
    for (let i = 0; i < roleIdsArray.length; i++) {
      data.append("roleIds", roleIdsArray[i]["id"]);
    }

    const entityIdsArray = this.state.employeesEntitiesArray || [];
    for (let i = 0; i < entityIdsArray.length; i++) {
      data.append("entityIds", entityIdsArray[i]["id"]);
    }

    const departmentIdsArray = this.state.employeesDepartmentsArray || [];
    for (let i = 0; i < departmentIdsArray.length; i++) {
      data.append("departmentIds", departmentIdsArray[i]["id"]);
    }

    const subDepartmentIdsArray = this.state.employeesSubDepartmentsArray || [];
    for (let i = 0; i < subDepartmentIdsArray.length; i++) {
      data.append("subDepartmentIds", subDepartmentIdsArray[i]["id"]);
    }

    const designationIdsArray = this.state.employeesDesignationsArray || [];
    for (let i = 0; i < designationIdsArray.length; i++) {
      data.append("designationsIds", designationIdsArray[i]["id"]);
    }

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C306CommonAcademicsAnnouncementsForEmployeesSave`;
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
            if (this.state.recordId == 0) {
              this.resetForm();
            } else {
              this.viewReport();
            }
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
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
    window.location = "#/dashboard/announcements-for-employee-reports";
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    switch (name) {
      case "employeesRolesArray":
        this.setState({
          employeesEntitiesArray: [],
          employeesEntitiesArrayError: "",

          employeesDepartmentsArray: [],
          employeesDepartmentsArrayError: "",
          employeesDepartmentsData: [],
          employeesDepartmentsDataLoading: false,

          employeesSubDepartmentsArray: [],
          employeesSubDepartmentsArrayError: "",
          employeesSubDepartmentsData: [],
          employeesSubDepartmentsDataLoading: false,
        });
        this.getEmployeesEntitiesData(value || []);
        this.getEmployeesCounterData(value || [], [], [], [], this.state.employeesDesignationsArray || []);
        break;
      case "employeesEntitiesArray":
        this.setState({
          employeesDepartmentsArray: [],
          employeesDepartmentsArrayError: "",

          employeesSubDepartmentsArray: [],
          employeesSubDepartmentsArrayError: "",
          employeesSubDepartmentsData: [],
          employeesSubDepartmentsDataLoading: false,
        });
        this.getEmployeesCounterData(
          this.state.employeesRolesArray || [],
          value || [],
          [],
          [],
          this.state.employeesDesignationsArray || []
        );
        this.getEmployeesDepartmentsData(value || []);
        break;
      case "employeesDepartmentsArray":
        this.setState({
          employeesSubDepartmentsArray: [],
          employeesSubDepartmentsArrayError: "",
        });
        this.getEmployeesSubDepartmentsData(
          this.state.employeesEntitiesArray || [],
          value || []
        );
        this.getEmployeesCounterData(
          this.state.employeesRolesArray || [],
          this.state.employeesEntitiesArray || [],
          value || [],
          [],
          this.state.employeesDesignationsArray || []
        );
        break;
        case "employeesSubDepartmentsArray":
          this.getEmployeesCounterData(
            this.state.employeesRolesArray || [],
            this.state.employeesEntitiesArray || [],
            this.state.employeesDepartmentsArray || [],
            value || [],
            this.state.employeesDesignationsArray || []
          );
          break;
          case "employeesDesignationsArray":
          this.getEmployeesCounterData(
            this.state.employeesRolesArray || [],
            this.state.employeesEntitiesArray || [],
            this.state.employeesDepartmentsArray || [],
            this.state.employeesSubDepartmentsArray || [],
            value || [],
          );
          break;
      default:
        break;
    }

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  componentDidMount() {
    this.getEmployeesRolesData();
    this.getEmployeesDesignationsData([], [], []);
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
        this.setState({
          recordId: nextProps.match.params.recordId,
        });
      } else {
        window.location.reload();
      }
    }
  }

  render() {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const { classes } = this.props;

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
          <Grid container component="main" className={classes.root}>
            <Typography className={classes.title} variant="h5">
              Announcement For Employee
            </Typography>
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  id="employeesRolesArray"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  getOptionSelected={(option, value) => option.id === value.id}
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.employeesRolesData}
                  loading={this.state.employeesRolesDataLoading}
                  value={this.state.employeesRolesArray}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesRolesArray", value },
                    })
                  }
                  disableCloseOnSelect
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        color="primary"
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </React.Fragment>
                  )}
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        error={!!this.state.employeesRolesArrayError}
                        helperText={this.state.employeesRolesArrayError}
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
                  multiple
                  id="employeesEntitiesArray"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  limitTags={3}
                  fullWidth
                  getOptionSelected={(option, value) => option.id === value.id}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  aria-autocomplete="none"
                  options={this.state.employeesEntitiesData}
                  loading={this.state.employeesEntitiesDataLoading}
                  value={this.state.employeesEntitiesArray}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesEntitiesArray", value },
                    })
                  }
                  disableCloseOnSelect
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        color="primary"
                        checked={selected}
                      />
                      {option.label}
                    </React.Fragment>
                  )}
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        inputProps={inputProps}
                        label="Entities"
                        error={!!this.state.employeesEntitiesArrayError}
                        helperText={this.state.employeesEntitiesArrayError}
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  limitTags={3}
                  id="employeesDepartmentsArray"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.employeesDepartmentsData}
                  loading={this.state.employeesDepartmentsDataLoading}
                  value={this.state.employeesDepartmentsArray}
                  getOptionSelected={(option, value) => option.id === value.id}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesDepartmentsArray", value },
                    })
                  }
                  disableCloseOnSelect
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        color="primary"
                        checked={selected}
                      />
                      {option.label}
                    </React.Fragment>
                  )}
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        inputProps={inputProps}
                        label="Departments"
                        error={!!this.state.employeesDepartmentsArrayError}
                        helperText={this.state.employeesDepartmentsArrayError}
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  limitTags={3}
                  id="employeesSubDepartmentsArray"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.employeesSubDepartmentsData}
                  loading={this.state.employeesSubDepartmentsDataLoading}
                  value={this.state.employeesSubDepartmentsArray}
                  getOptionSelected={(option, value) => option.id === value.id}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesSubDepartmentsArray", value },
                    })
                  }
                  disableCloseOnSelect
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        color="primary"
                        checked={selected}
                      />
                      {option.label}
                    </React.Fragment>
                  )}
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        inputProps={inputProps}
                        label="Sub Departments"
                        error={!!this.state.employeesSubDepartmentsArrayError}
                        helperText={
                          this.state.employeesSubDepartmentsArrayError
                        }
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  limitTags={3}
                  id="employeesDesignationsArray"
                  getOptionLabel={(option) =>
                    typeof option.label === "string" ? option.label : ""
                  }
                  fullWidth
                  aria-autocomplete="none"
                  disableCloseOnSelect
                  options={this.state.employeesDesignationsData}
                  loading={this.state.employeesDesignationsDataLoading}
                  value={this.state.employeesDesignationsArray}
                  getOptionSelected={(option, value) => option.id === value.id}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeesDesignationsArray", value },
                    })
                  }
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        color="primary"
                        checked={selected}
                      />
                      {option.label}
                    </React.Fragment>
                  )}
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        inputProps={inputProps}
                        label="Designations"
                        error={!!this.state.employeesDesignationsArrayError}
                        helperText={this.state.employeesDesignationsArrayError}
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  color="primary"
                  className={classes.foundedEmployeesLabel}
                >
                  Total Employees Found: {this.state.totalUsersCount}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  autoOk
                  name="announcementDate"
                  id="announcementDate"
                  label="Announcement Date"
                  invalidDateMessage=""
                  disablePast
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  value={this.state.announcementDate}
                  onChange={(date) =>
                    this.onHandleChange({
                      target: { name: "announcementDate", value: date },
                    })
                  }
                  error={!!this.state.announcementDateError}
                  helperText={
                    this.state.announcementDateError
                      ? this.state.announcementDateError
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="label"
                  name="label"
                  label="Title"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={!!this.state.labelError}
                  helperText={
                    this.state.labelError ? this.state.labelError : ""
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="announcementDetails"
                  name="announcementDetails"
                  label="Announcement Details"
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={this.onHandleChange}
                  value={this.state.announcementDetails}
                  error={!!this.state.announcementDetailsError}
                  helperText={this.state.announcementDetailsError}
                />
              </Grid>
            </Grid>
            <br />
          </Grid>
          <input
            type="submit"
            id="announcementSubmit"
            style={{ display: "none" }}
          />
        </form>
        <BottomBar
          leftButtonText="View"
          leftButtonHide={false}
          bottomLeftButtonAction={() => this.viewReport()}
          right_button_text="Save"
          bottomRightButtonAction={() => this.clickOnFormSubmit()}
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

F306AnnouncementForEmployeeForm.propTypes = {
  classes: PropTypes.object,
  isDrawerOpen: PropTypes.bool,
  setDrawerOpen: PropTypes.func,
  match: PropTypes.object,
};

F306AnnouncementForEmployeeForm.defaultProps = {
  classes: {},
  isDrawerOpen: true,
  setDrawerOpen: (fn) => fn,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withStyles(styles)(F306AnnouncementForEmployeeForm);
