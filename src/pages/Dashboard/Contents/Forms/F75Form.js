import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/styles";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Collapse, Fab, } from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import FilterIcon from "mdi-material-ui/FilterOutline";
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F75FormPopupComponent from "./F75FormPopupComponent";
import F75FormTableComponent from "./F75FormTableComponent";
import InputBase from '@material-ui/core/InputBase';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AddIcon from "@material-ui/icons/Add";

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

class F75Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showSearchFilter: true,
      showTableFilter: true,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      tableData: [],
      f75FormPopupIsOpen: false,
      f75FormPopupData: {
        accountId: "", 
        studentDetail: ""
      }
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
    if (reason === "clickaway") {  return; }
    this.setState({ isOpenSnackbar: false });
  };

  loadData = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C75GuardianRegisterationApprovalView`;
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

            for (let i=0; i<dataLength; i++) {

              let studentDetail = data[i].studentDetail;
              
              data[i].childrans = ( 
                studentDetail.map((data, index) => 
                  index!=0 ? 
                    <Fragment 
                      key={"studentDetail"+data.studentId+index}
                    >
                      <br/>
                      {data.student}
                    </Fragment> 
                    : 
                    data.student
              ));

              let f75FormPopupData = {
                accountId:data[i].email,
                studentDetail: data[i].studentDetail
              };

              let recordId = data[i].id;
              let approvalStatus = data[i].approvalStatus;

              data[i].approvalStatusLabel = approvalStatus ? (approvalStatus==1 ? "Approved":"Rejected" ): "Pending" ;

              data[i].action = (
                !approvalStatus ?
                <Fragment>
                  <Button 
                    variant="contained" 
                    size="small"
                    color="primary" 
                    onClick={()=>this.changeApprovalStatus(i, recordId, 1)}
                    style={{
                      backgroundColor: "#4caf50",
                      marginBottom:8,
                      width:75
                    }}
                  >
                    Approve
                  </Button>
                  <br/>
                  <Button 
                    variant="contained" 
                    size="small" 
                    color="secondary"
                    onClick={()=>this.changeApprovalStatus(i ,recordId, 2)}
                    style={{
                      width:75
                    }}
                  >
                    Reject
                  </Button>
                </Fragment>
                :
                ""
                // <IconButton
                //   color="primary"
                //   aria-label="Add"
                //   onClick={()=>this.f75FormPopupSetData(f75FormPopupData)}
                //   variant="outlined"
                //   component="span"
                //   style={{padding:5}}
                // >
                //   <Tooltip title="Add / Change">
                //     <Fab 
                //       color="primary" 
                //       aria-label="add" 
                //       size="small"
                //     >
                //       <AddIcon fontSize="small"/>
                //     </Fab>
                //   </Tooltip>
                // </IconButton>
              );

            }
            this.setState({tableData: data});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadData", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
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

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
        case "academicSessionId":
        break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };
    
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  f75FormPopupOpen = () => {
    this.setState({f75FormPopupIsOpen: true});
  }

  f75FormPopupClose = () => {
    this.setState({f75FormPopupIsOpen: false});
  }

  f75FormPopupSetData = (data) => {
    this.setState({
      f75FormPopupData: {
        accountId: data.accountId, 
        studentDetail: data.studentDetail
      }
    });
    this.f75FormPopupOpen();
  }

  changeApprovalStatus = async(rowIndex, id=0, statusId=0) => {
    let data = new FormData();
    data.append("id", id);
    data.append("statusId", statusId);
    this.setState({ isLoading: true  });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C75GuardianRegisterationChangeApprovalStatus`;
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
    .then((json) => {
        if (json.CODE === 1) {
          // let tableData = [...this.state.tableData];
          // tableData.splice(rowIndex, 1);
          // this.setState({ tableData: tableData });
          this.handleOpenSnackbar(json.USER_MESSAGE, "success");
          this.loadData();
        } else {
          this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
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

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadData();
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
        <div style={{padding:20}}>
          <Grid container justify="space-between">
            <F75FormPopupComponent
              isOpen={this.state.f75FormPopupIsOpen}
              data={this.state.f75FormPopupData}
              isLoading={this.state.isLoading}
              onFormSubmit ={() => this.onStudentAchievementFormSubmit}
              handleOpenSnackbar={this.handleOpenSnackbar}
              f75FormPopupClose={this.f75FormPopupClose}
            />
            <Grid item xs={12}>
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                variant="h5"
              >
                Guardian Registeration Approval
                <span style={{ 
                    float: "right",
                    marginBottom: -6,
                    marginTop: -12
                }}>
                  <Tooltip title="Table Filter">
                    <IconButton 
                      onClick={this.handleToggleTableFilter} 
                      style={{padding:5,marginTop:10}}
                    >
                      <FilterIcon fontSize="default" color="primary" />
                    </IconButton>
                  </Tooltip>
                </span>
              </Typography>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                }}
              />
              <br/>
            </Grid>
            <Grid item xs={12}>
              <F75FormTableComponent
                rows={this.state.tableData}
                showFilter={this.state.showTableFilter}
              />
            </Grid>
          </Grid>
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

export default  withStyles(styles)(F75Form);
