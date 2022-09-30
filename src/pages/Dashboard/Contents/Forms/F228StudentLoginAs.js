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
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    marginTop: 10
},  item: {
  display: 'flex',
  flexDirection: 'column',
  marginRight: 10,
},
resize: {
  padding: 10
},
actions: {
  display: 'flex',
  flexDirection: 'row',
  width: '15%',
  marginTop: 29,
},
label: {
  textAlign: 'left',
  font: 'bold 14px Lato',
  letterSpacing: 0,
  color: '#174A84',
  opacity: 1,
  marginTop: 5,
  marginBottom: 5,
  inlineSize: 'max-content'
},
  table: {
    //minWidth: 750,
  }
});



function TableRowWithData(props) {

  const {rowIndex, rowData={}, onChange, isLoading, ...rest} = props;

  

  const onFormSubmit = async e => {
   
    // e.preventDefault();
    const data = new FormData();
    data.append("loginById",rowData.userId);
    data.append("loginAsId",rowData.studentId);
    
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/authentication/C06AuthenticateLoginAs`;
    await fetch(url, { method: "POST", body: data,  headers: new Headers({
      Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
  }) })
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        json => {

          console.log("json",json)
          if (json.isActive === 1) {
            
            window.localStorage.setItem("lmsData", JSON.stringify(json));
            window.localStorage.setItem("lmsToken", json.jwttoken);
            window.localStorage.setItem("lmsStudentId",rowData.studentId);
            sessionStorage.setItem("lmsFeeAnnouncementReadFlag", 0);
            sessionStorage.setItem("lmsFeedbackAnnouncementReadFlag", 0);
            sessionStorage.setItem("lmsAnnouncementReadFlag", 0);
            window.open(`${process.env.REACT_APP_Student_URL}/#/dashboard`, '_blank')
            //window.location.replace(`${process.env.REACT_APP_Student_URL}/#/dashboard`);
           
          } else {
            // setDeactiveDialog({
            //   open: true,
            //   title: "Account Deactivated",
            //   content: json.deactiveMessage
            // })
          }
        },
        error => {
          // setError('Invalid Email or Password');
          console.log(error);
        });

    
  }

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
          {rowData.displayName}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.degreeLabel}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.email}
          
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.isActiveLabel}
          
        </StyledTableCell>
        <StyledTableCell align="center">
        <Button
            variant="contained"
            color="primary"
            onClick={() => onFormSubmit()}
            disabled={rowData.isActiveLabel=="In-Active"}
          >
            Login
          </Button>
          
        </StyledTableCell>
       
       
      </StyledTableRow>
  );
}

class F228StudentLoginAs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isLoadingData: false,
      isReload: false,
      label: "",
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      degreeClassificationMenuItems: [],
      degreeClassificationId: "",
      degreeClassificationError: "",
      programmeGroupsMenuItems:[],
      programmeGroupId:"",
      programmeGroupIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeIdError: "",
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

 

  loadData = async ( id=0) => {
    const data = new FormData();
    
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C228CommonStudentsView?programmeGroupId=${this.state.programmeGroupId||0}&academicSessionId=${this.state.academicSessionId||0}&programmeId=${this.state.programmeId||0}`;
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

  onHandleChangeAS = e => {
    const { name, value } = e.target;
    this.setState({
        [name]: value
      })
      
    this.state.academicSessionId=value;
    this.state.programmeGroupId= "";
    this.state.programmeId= "";
    this.state.degreeClassificationId= "";
  }
  onHandleChangePG = e => {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    })
    this.state.programmeGroupId = value;
    this.state.programmeId= "";
    this.state.degreeClassificationId= "";
    this.loadProgrammes(this.state.programmeGroupId)
  }
  onHandleChangeProgramme = e => {
    const { name, value } = e.target;
    this.setState({
        [name]: value,
    })
  
    this.state.programmeId = value;
   this.state.degreeClassificationId= "";
  }

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C228CommonAcademicSessionsView`;
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
            let array = json.DATA || [];
            let arrayLength = array.length;
            let res = array.find( (obj) => obj.isActive === 1 );
            if(res){
              this.setState({academicSessionId:res.ID});
            }
            this.setState({ academicSessionMenuItems: array });
            
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  

  getProgrammeGroups = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C228CommonProgrammeGroupsView?academicSessionId=${this.state.academicSessionId||0}`;
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
            this.setState({programmeGroupsMenuItems: json.DATA || []});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getProgrammeGroups",json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleOpenSnackbar("Failed to load Students Data ! Please try Again later.","error");
            console.log(error);
          }
        }
      );
  };

  loadProgrammes = async (programGroup) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C228CommonProgrammesView?programmeGroupId=${this.state.programmeGroupId|| 0 ||programGroup}`;
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
            this.setState({ programmeIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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

 
  onClearFilters = () => {
    this.setState({
    
      programmeId: "",
      programmeGroupId:"",
      academicSessionId: "",
   
      // admissionData: [],
    });
  };
  

  viewReport = () => {
    window.location = "#/dashboard/F211Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSessions();
    this.getProgrammeGroups();
    this.loadProgrammes(0);
    //this.loadData();
   
  }

  componentWillReceiveProps(nextProps) {
   
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
              Student's Login As
            </Typography>
            
            <Grid
              container
              spacing={2}
            >
                    <div className={classes.container}>
              

                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Academic Session</span>
                    <TextField
                      id="academicSessionId"
                      name="academicSessionId"
                      variant="outlined"
                      value={this.state.academicSessionId}
                      InputProps={{ classes: { input: classes.resize } }}
                      onChange={e => {
                        this.onHandleChangeAS(e);
                    }}
                    //   error={!!values.academicSessionIdError}
                    //   helperText={values.academicSessionIdError}
                      select
                    >
                      {this.state.academicSessionMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"academicSessionMenuItems"+dt.ID}
                          value={dt.ID}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                </div>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Programme Group</span>
                    <TextField
                      id="programmeGroupId"
                      name="programmeGroupId"
                      variant="outlined"
                      value={this.state.programmeGroupId}
                      InputProps={{ classes: { input: classes.resize } }}
                      onChange={e => {
                        this.onHandleChangePG(e);
                    }}
                    //   error={!!values.academicSessionIdError}
                    //   helperText={values.academicSessionIdError}
                      select
                    >
                      {this.state.programmeGroupsMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"programmeGroupsMenuItems"+dt.Id}
                          value={dt.Id}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                </div>

                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Programme</span>
                    <TextField
                      id="programmeId"
                      name="programmeId"
                      variant="outlined"
                      value={this.state.programmeId}
                      InputProps={{ classes: { input: classes.resize } }}
                      onChange={e => {
                        this.onHandleChangeProgramme(e);
                    }}
                    //   error={!!values.academicSessionIdError}
                    //   helperText={values.academicSessionIdError}
                      select
                    >
                      {this.state.programmeIdMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"programmeIdMenuItems"+dt.ID}
                          value={dt.ID}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                </div>
               
                <div className={classes.actions}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        // disabled={isLoading}
                        disabled={this.state.isLoading || (!this.state.programmeId )}
                        onClick={() => this.loadData()}
                    > {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Search"}</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{
                            marginLeft: 8,
                        }}
                        onClick={() => this.state.onClearFilters()}
                    >Clear</Button>
                </div>
              
             </div>
             
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)', width:"10%"}}>SR#</StyledTableCell>
                      <StyledTableCell align="center">Nucleus ID</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, }}>Name</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, }}>Degree</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, }}>Email</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, }}>Status</StyledTableCell>
                      <StyledTableCell align="center" style={{ borderRight: '1px solid rgb(29, 95, 152)',minWidth:120}}>Login</StyledTableCell>
                      
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
export default withStyles(styles)(F228StudentLoginAs);
