import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  Divider,
  Typography,
  MenuItem,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateSectionFormTableComponent from "./Chunks/CreateSectionFormTableComponent";
import ScrollToTop from "../../../../../components/ScrollToTop/ScrollToTop";
import CreateSectionPopupComponent from "./Chunks/CreateSectionPopupComponent";

const styles = () => ({
  root: {
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  resize: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1d5f98",
  },
});

class CreateSectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      fromSessionData: [],
      toSessionData: [],
      isActive: false,

      sessionId: "",
      sessionIdError: "",
      sessionData: [],
      programmeId: "",
      programmeIdError: "",
      programmesData: [],
      offeredCoursesId: "",
      offeredCoursesIdError: "",
      coursesData: [],

      section: 1,
      isPopupOpen: false,

      name: "",
      nameError: "",

      sectionData: [],
      sectionDataError: [],

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  componentDidMount() {
    this.loadingData();
    this.getFromSessionsData();
    this.getToSessionsData();
  }

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

  loadingData = async () => {
    await this.getSessionData();
    if (this.state.recordId != 0) {
      await this.loadData(this.state.recordId);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.loadData(nextProps.match.params.recordId);
        this.setState({
          recordId: nextProps.match.params.recordId,
        });
      } else {
        window.location.reload();
      }
    }
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

  getSessionData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsView`;
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
              sessionData: json.DATA || [],
            });
            let selectedRow = json.DATA.find((data) => data.isActive == 1);
            if (selectedRow) {
              this.setState({
                sessionId: selectedRow.ID,
                programmeId: "",
                programmeIdError: "",
                offeredCoursesId: "",
                offeredCoursesIdError: "",
                sectionDataError: "",
                nameError: "",
              });
              this.getProgrammeData(selectedRow.ID);
            }
          } else {
            this.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
            this.handleOpenSnackbar(
              "Failed to Load Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getProgrammeData = async (id, pId = "") => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsOfferedProgrammesView?sessionId=${id}`;
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
              programmesData: json.DATA || [],
              programmeId: pId,
            });
          } else {
            this.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
            this.handleOpenSnackbar(
              "Failed to Load Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getCoursesData = async (id, cId = "", sId = "") => {
    this.setState({ isLoading: true });
    const sessionId = sId || this.state.sessionId;
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsOfferedCoursesView?sessionId=${sessionId}&programmeGroupId=${id}`;
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
              coursesData: json.DATA || [],
              offeredCoursesId: cId,
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
              "Failed to Load Data ! Please try Again later.",
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSectionsView?id=${index}`;
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
            if (json.DATA) {
              if (json.DATA.length > 0) {
                this.getProgrammeData(
                  json.DATA[0].sessionId,
                  json.DATA[0].programmeGroupId
                );
                this.getCoursesData(
                  json.DATA[0].programmeGroupId,
                  json.DATA[0].courseId,
                  json.DATA[0].sessionId
                );
                this.setState({
                  sessionId: json.DATA[0].sessionId,
                  section: json.DATA[0].sectionTypeId,
                  name: json.DATA[0].label,
                });
              }
            }
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
              "Failed to Load Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    switch (name) {
      case "sessionId":
        this.setState({
          programmeId: "",
          programmeIdError: "",
          offeredCoursesId: "",
          offeredCoursesIdError: "",
          sectionDataError: "",
          nameError: "",
        });
        this.getProgrammeData(value);
        break;
      case "programmeId":
        this.setState({
          offeredCoursesId: "",
          offeredCoursesIdError: "",
          sectionDataError: "",
          nameError: "",
        });
        this.getCoursesData(value);
        break;
      case "section":
        this.setState({
          sectionDataError: "",
          nameError: "",
        });
        break;
      default:
        break;
    }

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isFormValid = () => {
    let isValid = true;
    let {
      sessionIdError,
      programmeIdError,
      offeredCoursesIdError,
      sectionDataError,
      nameError,
    } = this.state;
    if (!this.state.sessionId) {
      isValid = false;
      sessionIdError = "Please select the session";
    } else {
      if (!this.state.programmeId) {
        isValid = false;
        programmeIdError = "Please select the programme";
      } else {
        if (!this.state.offeredCoursesId) {
          isValid = false;
          offeredCoursesIdError = "Please select the offered course";
        } else {
          if (this.state.recordId == 0) {
            if (!this.state.sectionData.length > 0) {
              isValid = false;
              sectionDataError = "Please add the name of section";
            }
          } else {
            if (!this.state.name) {
              isValid = false;
              nameError = "Please add the name of section";
            }
          }
        }
      }
    }

    this.setState({
      sessionIdError,
      programmeIdError,
      offeredCoursesIdError,
      sectionDataError,
      nameError,
    });

    return isValid;
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("submitSection").click();
    }
  };

  resetForm = () => {
    this.setState({
      sessionId: "",
      sessionIdError: "",
      programmeId: "",
      programmeIdError: "",
      programmesData: [],
      offeredCoursesId: "",
      offeredCoursesIdError: "",
      coursesData: [],

      section: 1,

      name: "",
      nameError: "",

      sectionData: [],
      sectionDataError: [],
    });
  };

  onFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSectionsSave`;
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
            }
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
    window.location = "#/dashboard/section-reports";
  };

  handleOpen = () => {
    console.log("Opening popup");
    this.setState({ isPopupOpen: true }); // Update state to open the popup
  };

  handleClose = () => {
    this.setState({ isPopupOpen: false }); // Update state to close the popup
  };

  onAddClick = () => {
    let { nameError, sectionData, name, section } = this.state;
    if (!name) {
      nameError = "Please enter name.";
    } else {
      const len = this.state.sectionData.length;
      const id = len < 0 ? 0 : len;
      nameError = "";
      sectionData.push({
        name,
        sr: id + 1,
        index: id,
        type: section,
      });
      name = "";
    }

    this.setState({
      nameError,
      name,
      sectionData,
      sectionDataError: "",
    });
  };

  deleteRecord = (id) => {
    let { sectionData } = this.state;
    sectionData.splice(id, 1);
    for (let i = 0; i < sectionData.length; i++) {
      sectionData[i].sr = i + 1;
      sectionData[i].index = i;
    }
    this.setState({
      sectionData,
    });
  };

  render() {
    const { classes } = this.props;
    const columns = [
      { name: "sr", title: "SR#" },
      { name: "name", title: "Section Name" },
      {
        name: "type",
        title: "Section Type",
        getCellValue: (row) => {
          return <Fragment>{row.type === 1 ? "Lecture" : "Tutorial"}</Fragment>;
        },
      },
      {
        name: "action",
        title: "Action",
        getCellValue: (row) => {
          return (
            <Tooltip title="Delete">
              <IconButton onClick={() => this.deleteRecord(row.index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ];

    const { sessionData } = this.state;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <Grid container component="main" className={classes.root}>
          <Typography
            style={{
              color: "#1d5f98",
              fontWeight: 600,
              borderBottom: "1px solid #d2d2d2",
              width: "98%",
              marginBottom: 25,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 20,
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
              Create Section
            </Typography>
            {this.state?.fromSessionData?.length > 0 &&
              this.state?.toSessionData?.length > 0 && (
                <CreateSectionPopupComponent
                  columns={columns}
                  data={sessionData}
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
              marginRight: 15,
            }}
          >
            <Grid item xs={4}>
              <TextField
                id="sessionId"
                name="sessionId"
                label="Session"
                required
                fullWidth
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.sessionId}
                helperText={this.state.sessionIdError}
                error={this.state.sessionIdError}
                select
              >
                {this.state.sessionData.map((item) => {
                  return (
                    <MenuItem key={item.ID} value={item.ID}>
                      {item.Label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                id="programmeId"
                name="programmeId"
                label="Programme Group"
                disabled={!this.state.sessionId}
                required
                fullWidth
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.programmeId}
                helperText={this.state.programmeIdError}
                error={this.state.programmeIdError}
                select
              >
                {this.state.programmesData.map((item) => {
                  return (
                    <MenuItem key={item.Id} value={item.Id}>
                      {item.Label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                id="offeredCoursesId"
                name="offeredCoursesId"
                label="Offered Courses"
                disabled={!this.state.programmeId}
                required
                fullWidth
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.offeredCoursesId}
                helperText={this.state.offeredCoursesIdError}
                error={this.state.offeredCoursesIdError}
                select
              >
                {this.state.coursesData.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.courseLabel}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>

          <Divider
            style={{
              opacity: "0.8",
              width: "98%",
              marginTop: 20,
              marginBottom: 20,
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
            <Grid item xs={3}>
              <TextField
                id="section"
                name="section"
                required
                fullWidth
                variant="outlined"
                disabled={
                  !this.state.sessionId ||
                  !this.state.programmeId ||
                  !this.state.offeredCoursesId
                }
                onChange={this.onHandleChange}
                value={this.state.section}
                select
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
              >
                <MenuItem value={1}>Lecture Section</MenuItem>
                <MenuItem value={2}>Tutorial Section</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={this.state.recordId == 0 ? 8 : 9}>
              <TextField
                id="name"
                name="name"
                disabled={
                  !this.state.sessionId ||
                  !this.state.programmeId ||
                  !this.state.offeredCoursesId
                }
                label={`${
                  this.state.section === 1 ? "Lecture" : "Tutorial"
                } Section Name`}
                required
                fullWidth
                value={this.state.name}
                variant="outlined"
                onChange={this.onHandleChange}
                helperText={this.state.nameError}
                error={this.state.nameError}
              />
            </Grid>
            {this.state.recordId == 0 && (
              <Grid item xs={1}>
                <Button
                  disabled={
                    !this.state.sessionId ||
                    !this.state.programmeId ||
                    !this.state.offeredCoursesId
                  }
                  color="primary"
                  style={{
                    padding: 10,
                    width: 85,
                    marginTop: 5,
                  }}
                  variant="outlined"
                  onClick={() => this.onAddClick()}
                >
                  <AddIcon /> Add
                </Button>
              </Grid>
            )}
          </Grid>
          <div
            style={{
              textAlign: "center",
              width: "100%",
              marginTop: 20,
              color: "#fd1f1f",
            }}
          >
            {this.state.sectionDataError}
          </div>
          <Divider
            style={{
              opacity: "0.8",
              width: "98%",
              marginTop: 10,
              marginBottom: 20,
            }}
          />
          {this.state.recordId == 0 && (
            <Grid
              style={{
                marginBottom: 40,
              }}
              item
              xs={12}
            >
              <CreateSectionFormTableComponent
                rows={this.state.sectionData}
                columns={columns}
                showFilter={false}
              />
            </Grid>
          )}
        </Grid>

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
        <form id="myForm" onSubmit={this.onFormSubmit}>
          <input type="hidden" name="id" value={this.state.recordId} />
          <input type="hidden" name="sessionId" value={this.state.sessionId} />
          <input
            type="hidden"
            name="programmeGroupId"
            value={this.state.programmeId}
          />
          <input
            type="hidden"
            name="courseId"
            value={this.state.offeredCoursesId}
          />
          {this.state.recordId != 0 ? (
            <Fragment>
              <input type="hidden" name="label" value={this.state.name} />
              <input
                type="hidden"
                name="sectionTypeId"
                value={this.state.section}
              />
            </Fragment>
          ) : (
            this.state.sectionData.map((item) => {
              return (
                <Fragment key={item.id}>
                  <input type="hidden" name="label" value={item.name} />
                  <input type="hidden" name="sectionTypeId" value={item.type} />
                </Fragment>
              );
            })
          )}
          <input type="submit" style={{ display: "none" }} id="submitSection" />
        </form>
        <ScrollToTop />
      </Fragment>
    );
  }
}

CreateSectionForm.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

CreateSectionForm.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withStyles(styles)(CreateSectionForm);
