import React, { Component, Fragment, useState } from "react";
import { withStyles } from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup,
  Card,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F18FormPopupComponent from "./F18FormPopupComponent";

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

function ProgrammesCheckBox(props) {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  const handleChecked = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Grid item md={3}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleChecked}
            name="programmesId"
            color="primary"
            value={props.id}
          />
        }
        label={props.label}
        style={{
          color: "#1d5f98",
          fontWeight: 600,
          marginBottom: 5,
          fontSize: 12,
          wordBreak: "break-word",
        }}
      />
    </Grid>
  );
}

function ProgrammeGroup(props) {
  const { classes, programmesGroupData, selectedProgrammesArray, ...rest } =
    props;

  const data = programmesGroupData;

  const checkIsSelected = (val) => {
    if (
      selectedProgrammesArray != null &&
      selectedProgrammesArray.length > 0 &&
      val != null &&
      val != ""
    ) {
      return selectedProgrammesArray.some((arrVal) => val === arrVal);
    } else {
      return false;
    }
  };

  return (
    <Fragment>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel
          component="legend"
          style={{
            fontSize: 18,
            marginBottom: "1em",
          }}
        >
          {data.programmeGroupLabel}
        </FormLabel>
        <FormGroup>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {data.programmes.map((dt, i) =>
              data.programmes ? (
                <ProgrammesCheckBox
                  key={"programmes" + i}
                  id={dt.id}
                  label={dt.label}
                  isChecked={checkIsSelected(dt.id)}
                />
              ) : (
                ""
              )
            )}
          </Grid>
        </FormGroup>
      </FormControl>
      <br />
      <br />
      <br />
    </Fragment>
  );
}

class F18Form extends Component {
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
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSession: "",
      academicSessionError: "",
      programmesGroup: [],
      selectedProgrammesArray: [],

      fromSessionData: [],
      toSessionData: [],
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

  getProgrammesGroupData = async (index) => {
    const data = new FormData();
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C18CommonProgrammeGroupsView`;
    await fetch(url, {
      method: "POST",
      // body: data,
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
              programmesGroup: json.DATA,
            });
          } else {
            this.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
          }
          //console.log(json);
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
              "Failed to Fetch ! Please try Again later.",
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C18CommonAcademicSessionsView`;
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
            if (json.DATA.length) {
              this.setState({
                academicSession: json.DATA[0].academicSession,
                selectedProgrammesArray: json.DATA[0].programmesId,
              });
            } else {
              window.location = "#/dashboard/F18Form/0";
            }
          } else {
            this.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
          }
          console.log("loadData", json);
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
              "Failed to Fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSession) {
      this.setState({ academicSessionError: "Please enter academic session." });
      document.getElementById("academicSession").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionError: "" });
    }
    return isValid;
  };

  isProgrammesValid = () => {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checkedOne = Array.prototype.slice
      .call(checkboxes)
      .some((x) => x.checked);
    let isValid = true;
    if (!checkedOne) {
      this.handleOpenSnackbar(
        "Please select at least one offer programme.",
        "error"
      );
      isValid = false;
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    if (!this.isAcademicSessionValid() || !this.isProgrammesValid()) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C18CommonAcademicSessionsSave`;
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
                window.location = "#/dashboard/F18Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
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
    window.location = "#/dashboard/F18Reports";
  };
  getFromSessionsData = async () => {
    this.setState({ academicSessionsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsFromView`;
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
            this.setState((prevState) => ({
              ...prevState,
              fromSessionData: [json.DATA[0]],
            }));
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
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
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ academicSessionsDataLoading: false });
  };

  getToSessionsData = async () => {
    this.setState({ academicSessionsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsToView`;
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
            console.log(json.DATA);
            this.setState((prevState) => ({
              ...prevState,
              toSessionData: json.DATA,
            }));
            console.log(json);
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
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
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ academicSessionsDataLoading: false });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getProgrammesGroupData();
    this.getFromSessionsData();
    this.getToSessionsData();
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
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
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid #d2d2d2",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
              variant="h5"
            >
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  fontSize: 20,
                }}
              >
                Define Session & Offer Programmes
              </Typography>
              {this.state?.fromSessionData?.length > 0 &&
                this.state?.toSessionData?.length > 0 && (
                  <F18FormPopupComponent
                    noDataMessage={this.state.sectionDataError}
                    handleOpenSnackbar={this.handleOpenSnackbar}
                    fromSessionData={this.state.fromSessionData}
                    toSessionData={this.state.toSessionData}
                  />
                )}
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
              <Grid item xs={12}>
                <TextField
                  id="academicSession"
                  name="academicSession"
                  required
                  fullWidth
                  label="Academics Session"
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.academicSession}
                  error={!!this.state.academicSessionError}
                  helperText={
                    this.state.academicSessionError ? (
                      this.state.academicSessionError
                    ) : (
                      <Typography color="primary" variant="caption">
                        e.g.: 2020 - 2021
                      </Typography>
                    )
                  }
                />
              </Grid>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                  marginTop: 100,
                }}
              />
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  width: "98%",
                  marginBottom: 5,
                  fontSize: 18,
                }}
                variant="h6"
              >
                Offer Programme *
              </Typography>
              <Grid item xs={12}>
                <Card className={classes.root}>
                  <CardContent>
                    {this.state.isLoading ? (
                      <CircularProgress />
                    ) : (
                      this.state.programmesGroup.map((dt, i) =>
                        this.state.selectedProgrammesArray.length > 0 ? (
                          <ProgrammeGroup
                            key={"PGWD" + i}
                            programmesGroupData={dt}
                            selectedProgrammesArray={
                              this.state.selectedProgrammesArray
                            }
                            classes={classes}
                          />
                        ) : (
                          <ProgrammeGroup
                            key={"PGWOD" + i}
                            programmesGroupData={dt}
                            classes={classes}
                          />
                        )
                      )
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  paddingBottom: 20,
                  paddingTop: 20,
                  display: "flex",
                }}
              ></Grid>
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
export default withStyles(styles)(F18Form);
