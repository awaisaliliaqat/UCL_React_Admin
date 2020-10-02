import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button, Dialog, 
  DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, useMediaQuery, useTheme, Typography} from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import ExcelIcon from "../../../../assets/Images/excel.png";
import TablePanel from "../../../../components/ControlledTable/RerenderTable/TablePanel";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import F67ReportsTableComponent from "./F67ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

function isEmpty(obj) {
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid white'
  },
  body: {
    fontSize: 14,
    border: '1px solid rgb(29, 95, 152)'
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = ({
  table: {
    width: "100%",
  },
});

function CourseContentPopup (props) {
  const {classes, open, handleClose, label="", filesName=[]} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      maxWidth="md"
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <span style={{ color: "#ffffff" }}>
       _______________________________________________________________________________________________________________________
      </span>
    <DialogTitle style={{ paddingBottom: 0 }} id="responsive-dialog-title">
      <IconButton
        aria-label="close"
        onClick={handleClose}
        style={{
          position: "relative",
          top: "-35px",
          right: "-24px",
          float: "right",
        }}
      >
        <CloseOutlinedIcon color="secondary" />
      </IconButton>
      <Typography
        style={{
          color: "#1d5f98",
          fontWeight: 600,
          borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
          fontSize: 20,
        }}
      >
        {label}
      </Typography>      
    </DialogTitle>
    <DialogContent>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={2}
        style={{
          marginTop: -10,
        }}
      >
        <Grid item xs={12}>
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{borderLeft: '1px solid rgb(29, 95, 152)'}}>File&nbsp;Name</StyledTableCell>
              <StyledTableCell align="center">Download</StyledTableCell>
              <StyledTableCell align="center" style={{borderRight: '1px solid rgb(29, 95, 152)'}}>View</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filesName.length > 0
            ? filesName.map((dt, i) => (
              <StyledTableRow key={dt+i}>
                 <StyledTableCell component="th" scope="row">{dt.fileName}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Download">
                      <IconButton 
                        onClick={(e)=>props.downloadFile(e, dt.fileSource, dt.fileName, false)}
                        aria-label="download"
                      >
                        <CloudDownloadIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                 <StyledTableCell align="center">
                 <Tooltip title="Download">
                    <IconButton 
                      onClick={(e)=>props.downloadFile(e, dt.fileSource, dt.fileName, true)}
                      aria-label="download"
                    >
                      <VisibilityOutlinedIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                 </StyledTableCell>
              </StyledTableRow>
            ))
            :
            <StyledTableRow key={1}>
              <StyledTableCell component="th" scope="row" colSpan={6}><center><b>No Data</b></center></StyledTableCell>
            </StyledTableRow>
          }
          </TableBody>
        </Table>
      </TableContainer>
      </Grid>
      </Grid>
    </DialogContent>
    <Divider
      style={{
        backgroundColor: "rgb(58, 127, 187)",
        opacity: "0.3",
      }}
    />
    <DialogActions>
      <Button autoFocus onClick={handleClose} color="secondary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
  );
}

class F67Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadExcel: false,
      applicationStatusId: 1,
      admissionData: null,
      genderData: [],
      degreeData: [],
      studentName: "",
      genderId: 0,
      degreeId: 0,
      applicationId: "",
      isLoginMenu: false,
      isReload: false,
      eventDate: null,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      popupBoxOpen: false,
      popupBoxLabel:"",
      popupBoxFiles: []
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

  handleClickOpen = (popupBoxLabel,popupBoxFiles) => {
    this.setState({ 
      popupBoxOpen: true,
      popupBoxLabel:popupBoxLabel,
      popupBoxFiles: popupBoxFiles
    });
  }

  handleClose = () => {
    this.setState({
      popupBoxOpen: false,
      popupBoxFiles: []
    });
  };

  getData = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C67CommonAcademicsCourseContentView`;
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
            this.setState({admissionData: json.DATA || []});
            let loopLength = json.DATA.length || 0;
            for (let i=0; i<loopLength; i++) {
              json.DATA[i].action = (
                <EditDeleteTableRecord
                  recordId={json.DATA[i].id}
                  DeleteData={this.DeleteData}
                  onEditURL={`#/dashboard/F67Form/${json.DATA[i].id}`}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                />
              );
              let courseContentLabel = json.DATA[i].sectionLabel+" - "+json.DATA[i].label || "";
              let courseContentFileName = json.DATA[i].courseContentFileName || [];
              json.DATA[i].courseContentPopup = (
                <Button 
                  variant="outlined" 
                  size="small"
                  color="primary"
                  disabled={!courseContentFileName>0}
                  onClick={()=>this.handleClickOpen(courseContentLabel,courseContentFileName)}
                >
                  Open
                </Button>
              );
            }
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,"error");
          }
          console.log("getData", json);
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

  DeleteData = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C67CommonAcademicsCourseContentDelete`;
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
            this.handleOpenSnackbar("Deleted", "success");
            this.getData();
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
          }
          console.log(json);
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
  };


  downloadFile = (e, fileName, fileLabel, viewOnly=false) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fileName", fileName);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
    fetch(url, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer "+localStorage.getItem("uclAdminToken"),
        }),
    })
      .then((res) => {
          if (res.status === 200) {
              return res.blob();
          } else if (res.status === 401) {
              this.setState({
                  isLoginMenu: true,
                  isReload: false
              })
              return {}
          } else {
              alert('Operation Failed, Please try again later.');
              return {}
          }
      })
      .then((result) => {
        if(viewOnly) {
          let fileExtension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
          let fileMimeType = result.type;
          if(fileExtension==="doc" || fileExtension==="DOC"){
            fileMimeType = "application/msword";
          }else if(fileExtension==="pdf" || fileExtension==="PDF") {
            fileMimeType = "application/pdf"
          }else if(fileExtension==="docx" || fileExtension==="DOCX"){
            fileMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          }
          let blob = new Blob([result], { type: fileMimeType });
          if (blob) {
              let fileURL = window.URL.createObjectURL(blob);
              window.open(fileURL);
          }
        } else {
          let csvURL = window.URL.createObjectURL(result);
          let tempLink = document.createElement("a");
          tempLink.href = csvURL;
          tempLink.setAttribute("download", fileLabel);
          tempLink.click();
        }
        
        if (result.CODE === 1) {
            //Code
        } else if (result.CODE === 2) {
            alert("SQL Error (" +result.CODE +"): " +result.USER_MESSAGE +"\n" +result.SYSTEM_MESSAGE);
        } else if (result.CODE === 3) {
            alert("Other Error ("+result.CODE+"): " +result.USER_MESSAGE +"\n" +result.SYSTEM_MESSAGE);
        } else if (result.error === 1) {
            alert(result.error_message);
        } else if (result.success === 0 && result.redirect_url !== "") {
            window.location = result.redirect_url;
        }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getData();
  }

  render() {

    const {classes} = this.props;

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "label", title: "Label" },
      { name: "sectionLabel", title: "Section" },
      { name: "createdOnReport", title: "Created On" },
      { name: "courseContentPopup", title: "Section Content" },
      { name: "action", title: "Action" },
    ];

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Section Content Report
            </Typography>
            {/* 
              <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                  height: 30, width: 32,
                  cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
               }}
              /> 
            */}
            <div style={{ float: "right" }}>
              {/* <Hidden xsUp={true}> */}
              {/* <Tooltip title="Search Bar">
                    <IconButton
                        onClick={this.handleToggleSearchBar}
                    >
                        <FilterIcon fontSize="default" color="primary"/>
                    </IconButton>
                </Tooltip> */}
              {/* </Hidden> */}
              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={this.handleToggleTableFilter}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br/>
          {this.state.admissionData ? (
            <F67ReportsTableComponent
              data={this.state.admissionData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid container justify="center" alignItems="center">
              <CircularProgress disableShrink />
            </Grid>
          )}
          <CourseContentPopup
            open={this.state.popupBoxOpen}
            handleClose={this.handleClose}
            classes={classes}
            label={this.state.popupBoxLabel}
            filesName={this.state.popupBoxFiles}
            downloadFile={this.downloadFile}
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

export default withStyles(styles)(F67Reports);
