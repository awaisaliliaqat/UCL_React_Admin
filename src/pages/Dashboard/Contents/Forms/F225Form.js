import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Card, CardContent,Switch,FormGroup, FormControlLabel} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';




const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid '+theme.palette.common.white
  },
  body: {
    fontSize: 14,
    border: '1px solid '+theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover":{
      backgroundColor:"#D3D3D3"
      //backgroundColor:"#f6f8fa"
    }
  },
}))(TableRow);

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
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
  table: {
    //minWidth: 750,
  }
});



function TableRowWithData(props) {

  const {rowIndex, rowData={}, onChange, isLoading, ...rest} = props;
 
  
  
 
  

  useEffect(() => {});

  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          {rowIndex + 1}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.studentId}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.name}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.degreeLabel}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.pathwayLabel}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.mobileNo}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.fatherMobileNo}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.MotherMobileNo}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.GuardianMobileNo}
          
        </StyledTableCell>
       
      </StyledTableRow>
  );
}

class F225Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isLoadingData: false,
      isReload: false,
      label: "",
      labelError: "",
      shortLabel: "",
      shortLabelError: "",
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeId: "",
      programmeIdError: "",
      programmeMenuItems: [],
      tableData:[],
      isEditMode: false
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

  getAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C225CommonAcademicSessionsView`;
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
            this.setState({ academicSessionIdMenuItems: json.DATA });
            let array = json.DATA || [];
            let arrayLength = array.length;
            for (let i=0; i<arrayLength; i++) {
              if (array[i].isActive == "1") {
                this.setState({academicSessionId:array[i].ID});
                this.loadProgrammeGroups(array[i].ID);
               
              }
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getAcademicSessions", json);
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

  loadProgrammeGroups = async (academicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C225CommonProgrammeGroupsView`;
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
          console.log("loadProgrammeGroups", json);
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

  loadProgrammes = async (programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C225CommonProgrammesView`;
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
            this.setState({programmeMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammes", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
            console.log(error);
          }
        }
      );
    this.setState({isLoading: false});
  };

  loadData = async ( id=0) => {
    const data = new FormData();
    data.append("id", id);
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("programmeId",  this.state.programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C225CommonStudentsView`;
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
              let data =  json.DATA || [];
              console.log("LOAD DATE",data);
              this.setState({tableData: data});
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

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

  isProgrammeGroupValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupId) {
      this.setState({ programmeGroupIdError: "Please select programme group." });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  };

  isTermValid = () => {
    let isValid = true;
    if (!this.state.termId) {
      this.setState({ termIdError: "Please select Term." });
      document.getElementById("termId").focus();
      isValid = false;
    } else {
      this.setState({ termIdError: "" });
    }
    return isValid;
  };
  
  isSectionValid = () => {
    let isValid = true;
    if (!this.state.sectionId) {
      this.setState({ sectionIdError: "Please select Section." });
      document.getElementById("sectionId").focus();
      isValid = false;
    } else {
      this.setState({ sectionIdError: "" });
    }
    return isValid;
  };

  isTableDataValid = () => {
    let isValid = true;
    let studentIds = document.getElementsByName("studentId");
    let marks = document.getElementsByName("marks");
    let recordCount  = studentIds.length || 0;
    let statusN=document.getElementsByName("statusN");
    let statusNa=document.getElementsByName("statusNA");
    if(!recordCount){
      isValid = false;
      this.handleOpenSnackbar("No data exist.","error");
    }else{
      for(let i=0; i<recordCount; i++){
        let eleValue = marks[i].value;
        let eleId = marks[i].id;
        let N=statusN[i].checked;
        let NA=statusNa[i].checked;
        if(eleValue==null || eleValue==""){
          if(N!=true && NA!=true){
            isValid = false;
            document.getElementById(eleId).focus();
            this.handleOpenSnackbar("Please enter marks for all students.","error");
            break;
          }else{
            marks[i].value=0;
          }
          
        }
      }
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        this.setState({
          academicSessionId:value,
          programmeGroupId:"",
          programmeGroupIdMenuItems:[],
          programmeId :"",
          programmeMenuItems:[],
          tableData:[]
        });
        this.loadProgrammeGroups(value);
        
      break;
      case "programmeGroupId":
        this.setState({
          programmeGroupId :value,
          programmeId :"",
          programmeMenuItems:[],
          tableData:[]
        });
        this.loadProgrammes(value);
      break;
      case "programmeId":
        this.setState({
          programmeId :value,
          tableData:[]
        });
        
      break;
     
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async () => {
    if (
      !this.isAcademicSessionValid()
      || !this.isProgrammeGroupValid()
      || !this.isTermValid()
      || !this.isSectionValid()
      || !this.isTableDataValid()
    ) { return; }
    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);
    data.append("statusN","0");
    data.append("statusNA","0");
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C211CommonAcademicsSessionsAssignmentsEvaluationSave`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({Authorization:"Bearer "+localStorage.getItem("uclAdminToken")}),
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
                window.location = "#/dashboard/F211Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F211Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
    if (this.state.recordId != 0) {
      this.setState({isEditMode:true});
    
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.setState({isEditMode:true});
        this.loadData(0,nextProps.match.params.recordId);
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
        <form id="myForm">
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "100%",
                marginTop:-10,
                marginBottom: 24,
                fontSize: "1.5rem"
              }}
            >
              Student's Parent Contact
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
            >
              
              <Grid item xs={12} md={2}>
                <TextField
                  id="academicSessionId"
                  name="academicSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChange}
                  value={this.state.academicSessionId}
                  error={!!this.state.academicSessionIdError}
                  helperText={this.state.academicSessionIdError}
                  disabled={this.state.isEditMode}
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
              <Grid item xs={12} md={3}>
                <TextField
                  id="programmeGroupId"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  onChange={this.onHandleChange}
                  value={this.state.programmeGroupId}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  disabled={!this.state.academicSessionId || this.state.isEditMode}
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
              
              <Grid item xs={12} md={4}>
                    <TextField
                      id="programmeId"
                      name="programmeId"
                      variant="outlined"
                      label="Programme"
                      onChange={this.onHandleChange}
                      value={this.state.programmeId}
                      error={!!this.state.programmeIdError}
                      helperText={this.state.programmeIdError}
                      fullWidth
                      select
                    >
                      {this.state.programmeMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"programmeMenuItems"+dt.ID}
                            value={dt.ID}
                          >
                            {dt.Label}
                          </MenuItem>
                      ))}
                    </TextField>
                   
              </Grid>
              <Grid item xs={12} md={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={this.state.isLoading || (!this.state.programmeId)}
                      onClick={() => this.loadData()}
                      style={{width:"100%", height:54, marginBottom:24}}
                    > 
                      {this.state.isLoading ? <CircularProgress style={{color:'white'}} size={36}/> : "Search"}
                    </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)', width:"10%"}}>SR#</StyledTableCell>
                      <StyledTableCell align="center">Nucleus ID</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, width:"10%"}}>Name</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, width:"10%"}}>Programme</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, width:"10%"}}>Pathway</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, width:"10%"}}>Student Phone</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, width:"10%"}}>Father Phone</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, width:"10%"}}>Mother Phone</StyledTableCell>
                      <StyledTableCell align="center" style={{borderRight: '1px solid rgb(29, 95, 152)', minWidth:120, width:"10%"}}>Guardian Phone</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                 
                  {this.state.tableData.length > 0 ? (
                    this.state.tableData.map((row, index) => (
                      <TableRowWithData
                        key={"CRDA"+row+index}
                        rowIndex={index}
                        rowData={row}
                        isLoading={this.state.isLoading}
                      />
                    ))
                  ) : 
                  this.state.isLoading ? 
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={9}><center><CircularProgress disableShrink/></center></StyledTableCell>
                    </StyledTableRow>
                    :
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={9}><center><b>No Data</b></center></StyledTableCell>
                    </StyledTableRow>
                  }
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid item xs={12}>
                <br />
                <br />
              </Grid>
            </Grid>
          </Grid>
        </form>
        {/* <BottomBar
          left_button_text="View"
          left_button_hide={true}
        
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading}
          disableRightButton={this.state.tableData.length<1}
          isDrawerOpen={this.props.isDrawerOpen}
          right_button_hide={true}
        />  */}
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
export default withStyles(styles)(F225Form);
