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

const styles = {};

class R210Reports extends Component {
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

  loadUsers = async (programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", this.state.academicSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonStudentsView`;
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
            this.setState({ studentMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadUsers", json);
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


  loadPreviousReports = async (academicSessionId,programmeId,studentId,termId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    data.append("programmeId", programmeId);
    data.append("studentId", studentId);
    data.append("termId", termId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonStudentsApprovedReportsView`;
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
            this.setState({ studentReportItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadUsers", json);
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

  handleSetUserId = (value) => {
   // alert(value)
    this.setState({
      studentObj: value,
      studentObjError: "",
    });
    this.loadPreviousReports(this.state.academicSessionId,this.state.programmeId,value.id,this.state.sessionTermId);
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
        this.loadUsers(value);
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


  handleGenerateApprovedReport = (id) => {
  
    window.open(`#/R301StudentProgressApprovedReport/${id}`,"_blank");
  };

  handleGenerate = () => {
    let academicSessionId = this.state.academicSessionId;
    let programmeId = this.state.programmeId;
    let sessionTermId = this.state.sessionTermId;
    let studentId = this.state.studentObj.id;
    window.open(`#/R210StudentProgressReport/${academicSessionId+"&"+programmeId+"&"+sessionTermId+"&"+studentId+"&"+this.state.endDate}`,"_blank");
  };

  handleGenerateAndApprove = () => {
    let academicSessionId = this.state.academicSessionId;
    let programmeId = this.state.programmeId;
    let sessionTermId = this.state.sessionTermId;
    let studentId = this.state.studentObj.id;
    window.open(`#/R301StudentProgressReport/${academicSessionId+"&"+programmeId+"&"+sessionTermId+"&"+studentId+"&"+this.state.endDate}`,"_blank");
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
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
          <Grid 
            container 
            justify="space-between"
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
                Student Progress Report
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
              <Autocomplete
                fullWidth
                id="studentObj"
                options={this.state.studentMenuItems}
                value={this.state.studentObj}
                onChange={(event, value) =>
                  this.handleSetUserId(value)
                }
                disabled={!this.state.programmeId}
                getOptionLabel={(option) =>  typeof option.label === "string" ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Students"
                    placeholder="Search and Select"
                    error={!!this.state.studentObjError}
                    helperText={this.state.studentObjError}
                  />
                )}
              />
            </Grid>

           
              
                
                <div style={{width:"95%",marginTop:"2%"}}>
                  
                  {this.state.studentReportItems.map((dt, i) => (
                 
                      <>
                      <Card  style={{marginTop:"2%"}} fullWidth className={classes.card}>
                        <CardHeader
                          title="Progress Report"
                          
                          
                        />
                        
                        <CardContent>
                        <Typography component="p">
                           <b>Approved on :</b>{dt.createdOn}
                          </Typography>
                        <Typography component="p">
                        <b>Show to student on :</b>{  dt.dateToShow}
                          </Typography>
                        <Typography component="h">
                        <b> Comments :</b>
                          </Typography>
                          <Typography component="p">
                            {dt.comments}
                          </Typography>
                        </CardContent>
                        <CardActions className={classes.actions}>
                        <Grid container
                          direction="row"
                          justify="flex-end"
                          alignItems="baseline">
                          <Button  style={{textAlign:"right"}} onClick={event =>{this.handleGenerateApprovedReport(dt.reportId)}}  color="primary" className={classes.button}>
                            View
                          </Button>
                        </Grid>
                         
                        </CardActions>
                        
                      
                      </Card>   
                       
                      </>
                 
                   ))}
                    
                
                </div>
             
           



          </Grid>
          <BottomBar
            left_button_text="Genrate & Approve"
            left_button_hide={false}
            bottomLeftButtonAction={this.handleGenerateAndApprove}
            right_button_text="Genrate & Approve"
            bottomRightButtonAction={this.handleGenerateAndApprove}
           // bottomRightButtonAction={this.handleGenerate}
           hideRightButton={true}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.studentObj}
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

export default withStyles(styles)(R210Reports);