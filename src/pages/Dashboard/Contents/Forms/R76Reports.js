import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExcelIcon from "../../../../assets/Images/excel.png";
import TablePanel from "../../../../components/ControlledTable/RerenderTable/TablePanel";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import R76ReportsTableComponent from "./R76ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

class R76Reports extends Component {
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

  onClearFilters = () => {
    this.setState({
      studentName: "",
      genderId: 0,
      degreeId: 0,
      applicationId: "",
      eventDate: null,
    });
  };

  handleDateChange = (date) => {
    this.setState({
      eventDate: date,
    });
  };

  getData = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C76CommonAcademicsExamsView`;
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
            this.setState({ admissionData: json.DATA || []});

            for (var i = 0; i < json.DATA.length; i++) {
              // json.DATA[i].action = (
              //   <EditDeleteTableRecord
              //     recordId={json.DATA[i].id}
              //     DeleteData={this.DeleteData}
              //     onEditURL={`#/dashboard/R76Form/${json.DATA[i].id}`}
              //     handleOpenSnackbar={this.handleOpenSnackbar}
              //   />
              // );
              let fileName = json.DATA[i].fileName;
              let fileUrl = json.DATA[i].fileUrl;
              json.DATA[i].fileDownload = (
                <Fragment>
                  <Tooltip title="Download">
                    <IconButton 
                      onClick={(e)=>this.DownloadFile(e, fileUrl, fileName)}
                      aria-label="download"
                    >
                      <CloudDownloadIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </Fragment>
              );
            }

          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
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
    this.setState({
      isLoading: false,
    });
  };

  DeleteData = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C204CommonAcademicsExamsDelete`;
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
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
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

  DownloadFile = (e, fileUrl, fileName=fileUrl) => {
      e.preventDefault();
      const data = new FormData();
      data.append("fileName", fileUrl);
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonViewFile`;
      fetch(url, {
          method: "POST",
          body:data,
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
              });
              return {}
          } else {
              //alert('Operation Failed, Please try again later.');
              this.handleOpenSnackbar("Operation Failed, Please try again later.","error");
              return {}
          }
      })
      .then((result) => {
                    
          if(result.type!="application/json"){
            this.handleOpenSnackbar("Operation Failed, Please try again later.","error");
          }
          
          var fileURL = window.URL.createObjectURL(result);
          var tempLink = document.createElement("a");
          tempLink.href = fileURL;
          tempLink.setAttribute("download", fileName);
          tempLink.click();

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
  };

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

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "label", title: "Label" },
      { name: "teacher", title: "Teacher" },
      { name: "sectionLabel", title: "Section" },
      { name: "startTimestampReport", title: "Starts On" },
      { name: "endTimestampReport", title: "Ends On" },
      { name: "instruction", title: "Instruction" },
      { name: "totalMarks", title: "Total\xa0Marks" },
      { name: "fileDownload", title: "Exam" },
      //{ name: "action", title: "Action" },
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
              Exams Report
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
            <R76ReportsTableComponent
              data={this.state.admissionData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid container justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
          )}
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
export default R76Reports;
