import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {Typography, TextField, MenuItem, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
import BottomBar from "../../../../components/BottomBar/BottomBar";

const styles = {};

class F219Form extends Component {
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
      termMenuItems: [],
      termId: "",
      termIdError: "",
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupLabel: "",
      programmeGroupIdError: "",
      studentMenuItems: [],
      fromDateMindTerm: [],
      fromDateMindTermError: "",
      toDateMindTerm: "",
      toDateMindTermError:"",
      recordId: this.props.match.params.recordId
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C219CommonAcademicsSessionView`;
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
            let dataLength =  data.length || 0;
            let res = data.find( (option) => option.isActive == 1);
            if(res){
              this.setState({academicSessionLabel:data.Label});
              this.loadProgrammes(res.ID);
              this.loadTerms(res.ID);
              this.setState({academicSessionId:res.ID});
            }
            this.setState({ academicSessionIdMenuItems:data});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadAcademicSession", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadTerms = async (academicsSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C219CommonAcademicsSessionsTermsView`;
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
            this.setState({termMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getTerms", json);
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

  loadProgrammes = async (academicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C219CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
            this.setState({ programmeGroupIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammes", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleChangeFromDateMindTerm = (date) => {
    this.setState({fromDateMindTerm: date});
  };
  
  handleChangeToDateMidTerm = (date) => {
    this.setState({toDateMindTerm: date});
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          programmeGroupIdMenuItems: [],
          programmeGroupId:"",
          termId:"",
          termMenuItems:[],
        });
        this.loadTerms(value);
        this.loadProgrammes(value);
        break;
      case "programmeGroupId":
        // this.loadTerms(value);
      break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  loadData = async(index) => {
    const data = new FormData();
    data.append("id",index);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C219CommonFeedbackSetupView`;
    await fetch(url, {
        method: "POST",
        body: data, 
        headers: new Headers({
            Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
        })
    })
      .then(res => {
        if (!res.ok) {
            throw res;
        }
        return res.json();
      })
        .then(json => {
          if (json.CODE === 1) {
            let data = json.DATA || [];
            let dataLength = data.length;
            if(dataLength){
              this.setState({academicSessionId: data[0].academicsSessionId});
              this.setState({programmeGroupId: data[0].programmeGroupId});
              this.setState({termId: data[0].termId});
              // this.setState({fromDateMindTerm: data[0].fromDateMindTerm});
              // this.setState({toDateMindTerm: data[0].toDateMindTerm});
              // let termInfo = data[0].termInfo || [];
              // let termInfoLength = termInfo.length;
              // for(let i=0; i<termInfoLength; i++){
              //   if(termInfo[i].termId==1){
              //     this.setState({
              //       fromDateMindTerm: termInfo[i].fromDate,
              //       toDateMindTerm: termInfo[i].toDate,
              //     });
              //   }
              //   if(termInfo[i].termId==2){
              //     this.setState({
              //       fromDateFinalTerm: termInfo[i].fromDate,
              //       toDateFinalTerm: termInfo[i].toDate,
              //     });
              //   }
              // }
          } else {
            window.location = "#/dashboard/F219Form/0";
          }
        } else {
          //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
          this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
        }
          console.log("loadData", json);
      },
      error => {
          if (error.status == 401) {
              this.setState({
                  isLoginMenu: true,
                  isReload: false
              })
          } else {
              console.log(error);
              // alert("Failed to Save ! Please try Again later.");
              this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.","error");
          }
      });
    this.setState({isLoading: false})
}

  
  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSessionId) {
      this.setState({
        academicSessionIdError: "Please select Academic Session.",
      });
      document.getElementById("academicSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionIdError: "" });
    }
    return isValid;
  };

  clickOnFormSubmit=()=>{
    this.onFormSubmit();
}

 onFormSubmit = async(e) => {
    if(
        !this.isAcademicSessionValid() && false
        //|| !this.isshortLabelValid()
    ){ return; }
    let myForm = document.getElementById('myForm');
    const data = new FormData(myForm);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C219CommonFeedbackSetupSave`;
    await fetch(url, {
        method: "POST", 
        body: data, 
        headers: new Headers({
            Authorization: " Bearer "+localStorage.getItem("uclAdminToken")
        })
    })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.json();
        })
        .then(
            json => {
                if (json.CODE === 1) {
                    //alert(json.USER_MESSAGE);
                    this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                    setTimeout(()=>{
                        if(this.state.recordId!=0){
                            window.location="#/dashboard/F219Reports";
                        }else{
                            window.location.reload();
                        }
                    }, 2000);
                } else {
                    //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
                }
                console.log(json);
            },
            error => {
                if (error.status == 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: false
                    })
                } else {
                    console.log(error);
                    //alert("Failed to Save ! Please try Again later.");
                    this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                }
            });
    this.setState({isLoading: false})
}
  viewReport = () => {
    window.location = "#/dashboard/F219Reports";
}

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
			if(this.state.recordId!=0){
					this.loadData(this.state.recordId);
			}
  }

  componentWillReceiveProps(nextProps){
    if(this.props.match.params.recordId!=nextProps.match.params.recordId){
        if(nextProps.match.params.recordId!=0){
            this.props.setDrawerOpen(false);
            this.loadData(nextProps.match.params.recordId);
        }else{
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
        <div
          style={{
            padding: 20,
          }}
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
                Feedback Setup
              </Typography>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                  marginBottom: 20
                }}
              />
            </Grid>
            <form id="myForm">
          <Grid 
            container 
            justifyContent="space-between"
            spacing={2}
          >
            
            
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <TextField
                id="programmeGroupId"
                name="programmeGroupId"
                variant="outlined"
                label="Programme Group"
                onChange={this.onHandleChange}
                value={this.state.programmeGroupId}
                error={!!this.state.programmeGroupIdError}
                helperText={this.state.programmeGroupIdError}
                disabled={!this.state.academicSessionId}
                required
                fullWidth
                select
              >
                {this.state.programmeGroupIdMenuItems ? (
                  this.state.programmeGroupIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programmeGroupIdMenuItems" + dt.Id}
                      value={dt.Id}
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
            <Grid item xs={4}>
              <TextField
                id="termId"
                name="termId"
                variant="outlined"
                label="Term"
                onChange={this.onHandleChange}
                value={this.state.termId}
                error={!!this.state.termIdError}
                helperText={this.state.termIdError}
                disabled={!this.state.academicSessionId || !this.state.programmeGroupId}
                required
                fullWidth
                select
              >
                {this.state.termMenuItems.map((dt, i) => (
                  <MenuItem
                    key={"termMenuItems"+ dt.id}
                    value={dt.id}
                  >
                    {dt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
													<DatePicker
														autoOk
														name="fromDate"
														id="fromDate"
														label="Start Date"
														invalidDateMessage=""
														minDate="2020-01-01"
														placeholder=""
														variant="inline"
														inputVariant="outlined"
														format="dd-MM-yyyy"
														fullWidth
														required
														value={this.state.fromDateMindTerm}
														onChange={this.handleChangeFromDateMindTerm}
														error={!!this.state.fromDateMindTermError}
														helperText={this.state.fromDateMindTermError}
													/>
												</Grid>
                        <Grid item xs={12} md={6}>
													<DatePicker
														autoOk
														name="toDate"
														id="toDate"
														label="End Date"
														invalidDateMessage=""
														//disablePast
														minDate="2020-01-01"
														placeholder=""
														variant="inline"
														inputVariant="outlined"
														format="dd-MM-yyyy"
														fullWidth
														required
														value={this.state.toDateMindTerm}
														onChange={this.handleChangeToDateMidTerm}
														error={!!this.state.toDateMindTermError}
														helperText={this.state.toDateMindTermError}
													/>
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
                    isDrawerOpen={ this.props.isDrawerOpen}
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

export default withStyles(styles)(F219Form);