import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {Typography, TextField, MenuItem, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';


import red from '@material-ui/core/colors/red';
import PreviewIcon from '@material-ui/icons/ViewModule';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import { Pageview, Report } from "@material-ui/icons";
import Button from '@material-ui/core/Button';
import { DatePicker } from "@material-ui/pickers";


const styles = {};

class F302Form extends Component {
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
      sessionTermMenuItems: [],
      sessionTermId: "",
      sessionTermIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeGroupLabel: "",
      programmeIdError: "",
      studentMenuItems: [],
      studentObj: "",
      studentObjError: "",
      endData: "",
      dense: false,
      secondary: false,
      studentReportItems: [],
      anouncementDate: null,
      anouncementDateError: "",
      recordId:this.props.match.params.recordId,
    };
  }


  handleDateChange = (name, date) => {
    const errorName = `${name}Error`;
    this.setState({
      [name]: date,
      [errorName]: ""
    });
  };
  getDateInString = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = dd + "/" + mm + "/" + yyyy;
    return today;
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

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonAcademicSessionsView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonAcademicsSessionsTermsView`;
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
            this.setState({sessionTermMenuItems: json.DATA || [] });
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonAcademicsSessionsOfferedProgrammesView`;
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

  loadData = async(index) => {
    const data = new FormData();
    data.append("id",index);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C302CommonGradebookReportDatesView`;
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
        .then(
            json => {
                if (json.CODE === 1) {
                    if(json.DATA.length){
                        this.setState({
                          academicSessionId:json.DATA[0].sessionId,
                          programmeId:json.DATA[0].programmeId,
                          sessionTermId:json.DATA[0].termId,
                          anouncementDate:json.DATA[0].dateToShow
                        });
                    }else{
                        window.location = "#/dashboard/F302Form/0";
                    }
                } else {
                    //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                    this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
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
                   // alert("Failed to Save ! Please try Again later.");
                    this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                }
            });
    this.setState({isLoading: false})
}


  


  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          programmeIdMenuItems: [],
          programmeId:"",
          termId:"",
          termMenuItems:[],
        });
        this.loadTerms(value);
        this.loadProgrammes(value);
        break;
      case "programmeId":
       
      break;
      case "sessionTermId":
        let termMenuItems = this.state.sessionTermMenuItems;
        let res = termMenuItems.find((obj) => obj.id === value);
        if(res){
          this.setState({endDate:res.endDate});
        }
      break;
      
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };




  onFormSubmit = async(e) => {
    // if(
    //     !this.isAcademicSessionValid() && false
    //     //|| !this.isshortLabelValid()
    // ){ return; }
    let myForm = document.getElementById('myForm');
    const data = new FormData(myForm);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C302CommonGradebookReportDatesSave`;
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
                            window.location="#/dashboard/R302Reports";
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
  viewReport = () => {
    window.location = "#/dashboard/R302Reports";
 }

  render() {

    const { classes } = this.props;
    const { dense, secondary } = this.state;
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
          <form id="myForm">
          <Grid 
            container 
            justify="space-between"
            spacing={2}
          >
            <input name="recordId" type="hidden"  value={this.state.recordId}/>
              <Grid item xs={12}>
                <Typography
                  style={{
                    color: "#1d5f98",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                  variant="h5"
                >
                  Date To Show Students (Student Progress Report) 
                </Typography>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
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
                        key={"programmeIdMenuItems" + dt.ID}
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
              <Grid item xs={12} md={6}>
                <TextField
                  id="sessionTermId"
                  name="sessionTermId"
                  variant="outlined"
                  label="Term"
                  onChange={this.onHandleChange}
                  value={this.state.sessionTermId}
                  error={!!this.state.sessionTermIdError}
                  helperText={this.state.sessionTermIdError}
                  disabled={!this.state.academicSessionId || !this.state.programmeId}
                  required
                  fullWidth
                  select
                >
                  {this.state.sessionTermMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"sessionTermMenuItems"+ dt.id}
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
                  name="anouncementDate"
                  id="anouncementDate"
                  label="Show To Student On"
                  invalidDateMessage=""
                  disablePast
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  required
                  fullWidth
                  value={this.state.anouncementDate}
                  onChange={date => this.handleDateChange("anouncementDate",date)}
                  error={!!this.state.anouncementDateError}
                  helperText={this.state.anouncementDateError ? this.state.anouncementDateError : " "}
                />
              
              
              </Grid>
             
           
          </Grid>
          </form>
          <BottomBar
            leftButtonText="View"
            leftButtonHide={false}
            bottomLeftButtonAction={this.viewReport}  
            right_button_text="Save"
            bottomRightButtonAction={this.onFormSubmit}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.anouncementDate}
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

export default withStyles(styles)(F302Form);