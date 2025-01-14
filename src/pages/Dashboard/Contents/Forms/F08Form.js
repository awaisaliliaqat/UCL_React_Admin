import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp } from "../../../../utils/regularExpression";
import { TextField, Grid, Button, CircularProgress } from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import MenuItem from "@material-ui/core/MenuItem";

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

class F08Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      label: "",
      labelError: "",
      shortLabel: "",
      shortLabelError: "",
      ProgrammeGroups: [],
      programmeGroupsId: "",
      programmeGroupsIdError: "",
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

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammesView`;
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
              this.setState({
                label: json.DATA[0].label,
                shortLabel: json.DATA[0].shortLabel,
                programmeGroupsId: json.DATA[0].programmeGroupsId,
              });
            }else{
              window.location = "#/dashboard/F08Form/0";
            }
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

  islabelValid = () => {
    let isValid = true;
    if (!this.state.label) {
      this.setState({ labelError: "Please enter Programmes." });
      document.getElementById("label").focus();
      isValid = false;
    } else {
      this.setState({ labelError: "" });
    }
    return isValid;
  };

  isshortLabelValid = () => {
    let isValid = true;
    if (!this.state.shortLabel) {
      this.setState({ shortLabelError: "Please enter Short Name." });
      document.getElementById("shortLabel").focus();
      isValid = false;
    } else {
      this.setState({ shortLabelError: "" });
    }
    return isValid;
  };

  isLinkProgrammeGroupValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupsId) {
      this.setState({
        programmeGroupsIdError: "Please select link programme groups.",
      });
      document.getElementById("programmeGroupsId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupsIdError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "label":
      case "shortLabel":
        regex = new RegExp(numberFreeExp);
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
      !this.islabelValid() ||
      !this.isshortLabelValid() ||
      !this.isLinkProgrammeGroupValid()
    ) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammesSave`;
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
                window.location = "#/dashboard/F08Reports";
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

  getProgrammesGroupData = async () => {
    const data = new FormData();
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammeGroupsView`;
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
            // this.handleOpenSnackbar(json.USER_MESSAGE,"success");
            this.setState({
              ProgrammeGroups: json.DATA,
            });
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
    window.location = "#/dashboard/F08Reports";
  };

  componentDidMount() {
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
    this.getProgrammesGroupData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
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
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid #d2d2d2",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              Define Programmes
            </Typography>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={6}>
                <TextField
                  id="label"
                  name="label"
                  label="Programme Name"
                  required
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.StopEnter}
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={!!this.state.labelError}
                  helperText={this.state.labelError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="shortLabel"
                  name="shortLabel"
                  label="Short Name"
                  required
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.StopEnter}
                  onChange={this.onHandleChange}
                  value={this.state.shortLabel}
                  error={!!this.state.shortLabelError}
                  helperText={this.state.shortLabelError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="programmeGroupsId"
                  name="programmeGroupsId"
                  required
                  fullWidth
                  select
                  // size="small"
                  label="Programme Group"
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.programmeGroupsId}
                  error={this.state.programmeGroupsIdError}
                  helperText={this.state.programmeGroupsIdError}
                >
                  {this.state.ProgrammeGroups.map((item) => (
                    <MenuItem key={item.ID} value={item.ID}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <BottomBar
          leftButtonText="View"
          leftButtonHide={false}
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
export default withStyles(styles)(F08Form);
