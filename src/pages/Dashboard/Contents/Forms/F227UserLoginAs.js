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

  

  const onFormSubmit = async e => {
   
    // e.preventDefault();
    const data = new FormData();
    data.append("loginById",rowData.userId);
    data.append("loginAsId",rowData.userLoginAsId);
    
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/authentication/C05AuthenticateLoginAs`;
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
          if (json.success === 1 && json.isActive === 1) {
            window.localStorage.setItem("adminData", JSON.stringify(json));
            window.localStorage.setItem("uclAdminToken", json.jwttoken);
            window.localStorage.setItem("isViewDialog", 0);
            window.localStorage.setItem("userTypeId", json.userTypeId);
            window.location.replace("#/dashboard");
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
          {rowData.userLoginAsId}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.userLabel}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.userType}
          
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.userEmail}
          
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.userIsActive}
          
        </StyledTableCell>
        <StyledTableCell align="center">
        <Button
            variant="contained"
            color="primary"
            onClick={() => onFormSubmit()}
            disabled={rowData.userIsActive=="In-Active"}
          >
            Login
          </Button>
          
        </StyledTableCell>
       
       
      </StyledTableRow>
  );
}

class F227UserLoginAs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isLoadingData: false,
      isReload: false,
      label: "",
     
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C227CommonUsersDetailView`;
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

  

  

 
  

  viewReport = () => {
    window.location = "#/dashboard/F211Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadData();
   
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
              User's Login As
            </Typography>
            
            <Grid
              container
              spacing={2}
            >
              
              
              
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)', width:"10%"}}>SR#</StyledTableCell>
                      <StyledTableCell align="center">User ID</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, }}>Name</StyledTableCell>
                      <StyledTableCell align="center" style={{ minWidth:120, }}>User Type</StyledTableCell>
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
          leftButtonText="View"
          leftButtonHide={true}
        
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
export default withStyles(styles)(F227UserLoginAs);
