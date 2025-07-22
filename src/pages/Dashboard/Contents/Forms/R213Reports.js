import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, TextField, MenuItem, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import ZipIcon from "../../../../assets/Images/zip_export_icon.png";

const styles = {};

class R213Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionLabel: "",
      academicSessionIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeIdError: ""
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

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C213CommonAcademicSessionsView`;
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
            let data = json.DATA || [];
            let dataLength = data.length || 0;
            this.setState({ academicSessionIdMenuItems: data });
            let res = data.find((obj) => obj.isActive === 1);
            if(res){
              this.setState({academicSessionId: res.ID});
              this.loadProgrammes(res.ID);
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadAcademicSession", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadProgrammes = async (AcademicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", AcademicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C213CommonAcademicsSessionsOfferedProgrammesView`;
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
            this.setState({ programmeIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammes", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        this.loadProgrammes(value);
      break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSessionId) {
      this.setState({ academicSessionIdError: "Please select academic session." });
      document.getElementById("academicSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionIdError: "" });
    }
    return isValid;
  };

  isProgrammeValid = () => {
    let isValid = true;
    if (!this.state.programmeId) {
      this.setState({ programmeIdError: "Please select programme." });
      document.getElementById("programmeId").focus();
      isValid = false;
    } else {
      this.setState({ programmeIdError: "" });
    }
    return isValid;
  };

  downloadZipFile = async () => {
    if(
      !this.isAcademicSessionValid() ||
      !this.isProgrammeValid() 
    ) {return;}
    this.setState({isLoading: true});
    let fileLabel = "Print_Envelope_Subject.zip";
    let data = new FormData();
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeId", this.state.programmeId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C213CommonAcademicsStudentsPdfDownload`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({
          Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
      })
    })
    .then(res => {
      if (res.status === 200) {
          return res.blob();
      }
      return false;
    })
    .then(json => {
      if (json) {
        var csvURL = window.URL.createObjectURL(json);
        var tempLink = document.createElement("a");
        tempLink.setAttribute("download", fileLabel);
        tempLink.href = csvURL;
        tempLink.click();
        console.log(json);
      }
    },
    error => {
      if (error.status === 401) {
        this.setState({
            isLoginMenu: true,
            isReload: false
        })
      } else {
        alert('Failed to fetch, Please try again later.');
        console.log(error);
      }
    });
    this.setState({isLoading: false});
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
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
        <div
          style={{
            padding: 20,
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                variant="h5"
              >
                Print Envelope Subject Report
              </Typography>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                }}
              />
              <br />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                label="Academic Session"
                onChange={this.onHandleChange}
                value={this.state.academicSessionId}
                error={!!this.state.academicSessionIdError}
                helperText={this.state.academicSessionIdError}
                required
                fullWidth
                select
              >
                {this.state.academicSessionIdMenuItems.map((dt, i) => (
                  <MenuItem
                    key={"academicSessionIdMenuItems" + dt.ID}
                    value={dt.ID}
                  >
                    {dt.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="programmeId"
                name="programmeId"
                variant="outlined"
                label="Programme"
                onChange={this.onHandleChange}
                value={this.state.programmeId}
                error={!!this.state.programmeIdError}
                helperText={this.state.programmeIdError}
                disabled={!this.state.academicSessionId}
                required
                fullWidth
                select
              >
                {this.state.programmeIdMenuItems ? (
                  this.state.programmeIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programmeIdMenuItems"+dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <CircularProgress size={24} />
                  </MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
          <BottomBar
            leftButtonText="View"
            leftButtonHide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text={<span><img alt="" src={ZipIcon} style={{height: 18, width: 14, verticalAlign:"text-top"}} />&nbsp;&nbsp;Download</span>}
            bottomRightButtonAction={this.downloadZipFile}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.programmeId || this.state.isLoading}
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
export default withStyles(styles)(R213Reports);
