import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Typography, Fab} from "@material-ui/core";
import ExcelIcon from "../../../../assets/Images/excel.png";
import F36FormFilter from "./F36FormFilter";
import TablePanel from "../../../../components/ControlledTable/RerenderTable/TablePanel";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import F36FormTableComponent from "./F36FormTableComponent";
import F36FormPopupComponent from "./F36FormPopupComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import BottomBar from "../../../../components/BottomBar/BottomBar";

class F36Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadExcel: false,
      popupBoxOpen:false,
      applicationStatusId: 1,
      assignmentsData: [],
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
      popupTitle:"",
      recordId:"",
      fileName:"",
      assignmentGradedData:{}
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

  handlePopupOpen = (popupTitle, recordId, fileName, assignmentGradedData) => {
    this.setState({ 
      popupTitle: popupTitle,
      recordId: recordId,
      fileName: fileName,
      popupBoxOpen: true,
      assignmentGradedData: assignmentGradedData
    });
  };

  handlePopupClose = () => {
    this.setState({
      popupBoxOpen: false,
      popupTitle:"",
      recordId:"",
      fileName:""
    });
  }

  onClearFilters = () => {
    this.setState({
      studentName: "",
      genderId: 0,
      degreeId: 0,
      applicationId: "",
      eventDate: null,
    });
  };

  getData = async (status) => {
    this.setState({isLoading: true});
    const reload = status === 1 && this.state.applicationId === "" && this.state.genderId === 0 && this.state.degreeId === 0 && this.state.studentName === "";
    const type = status === 1 ? "Pending" : status === 2 ? "Submitted" : "Pending";
    const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : "";
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C36CommonAcademicsAssignmentsResultsView`;
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
            this.setState({assignmentsData: json.DATA || []});
            for (var i = 0; i < json.DATA.length; i++) {
              let recordId = json.DATA[i].studentAssignmentId;
              let popupTitle = json.DATA[i].nucleusId+" - "+json.DATA[i].studentName+" - "+json.DATA[i].sectionLabel+"\xa0\xa0\xa0("+json.DATA[i].label+")";
              let fileName = json.DATA[i].assignmentUrl;
              let isAssignmentGraded = json.DATA[i].isAssignmentGraded;
              let gradedAssignmentUrl = json.DATA[i].gradedAssignmentUrl;
              let obtainedMarks = json.DATA[i].obtainedMarks;
              let remarks = json.DATA[i].remarks;
              let assignmentGradedData = {};
              if(isAssignmentGraded){
                assignmentGradedData = {
                  gradedAssignmentUrl:gradedAssignmentUrl,
                  obtainedMarks: obtainedMarks,
                  remarks:remarks
                }
              }
              json.DATA[i].action = (
                <Fragment>
                  <Tooltip title={isAssignmentGraded ? "Change Grading":"Grading"}>
                    <Fab 
                      aria-label="add"
                      size="small"
                      color="secondary"
                      style={
                        isAssignmentGraded ?
                          {height:36, width:36, backgroundColor:"#4caf50"}
                          :
                          {height:36, width:36, backgroundColor:"rgb(29, 95, 152)"}
                      }
                      onClick={() => this.handlePopupOpen(popupTitle, recordId, fileName, assignmentGradedData)}
                    >
                      <EditIcon fontSize="small"/>
                    </Fab>
                  </Tooltip>
                </Fragment>
              );
              json.DATA[i].fileDownload = (
                <Fragment>
                  <Tooltip title="Download Assignemt">
                    <IconButton 
                      onClick={(e)=>this.downloadFile(e, fileName)} 
                      aria-label="download"
                      color="primary"
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  {gradedAssignmentUrl && 
                  <Tooltip title="Download Graded Assignemt">
                    <IconButton 
                      onClick={(e)=>this.downloadFile(e, gradedAssignmentUrl)} 
                      aria-label="download"
                      style={{color:"rgb(76, 175, 80)"}}
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  }
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
              isReload: reload,
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

  // DeleteData = async (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.target);
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsAssignmentsDelete`;
  //   await fetch(url, {
  //     method: "POST",
  //     body: data,
  //     headers: new Headers({
  //       Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw res;
  //       }
  //       return res.json();
  //     })
  //     .then(
  //       (json) => {
  //         if (json.CODE === 1) {
  //           this.handleOpenSnackbar("Deleted", "success");
  //           this.getData();
  //         } else {
  //           //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
  //           this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
  //         }
  //         console.log(json);
  //       },
  //       (error) => {
  //         if (error.status === 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           //alert('Failed to fetch, Please try again later.');
  //           this.handleOpenSnackbar(
  //             "Failed to fetch, Please try again later.",
  //             "error"
  //           );
  //           console.log(error);
  //         }
  //       }
  //     );
  // };

  downloadFile = (e, fileName) => {
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
              var csvURL = window.URL.createObjectURL(result);
              var tempLink = document.createElement("a");
              tempLink.href = csvURL;
              tempLink.setAttribute("download", fileName);
              tempLink.click();
              console.log(csvURL);
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

  viewReport = () => {
    window.location = "#/dashboard/F36Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getData();
  }

  render() {

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "sectionLabel", title: "Section" },
      { name: "courseLabel", title: "Course" },
      { name: "label", title: "Assignment" },
      { name: "nucleusId", title: "NucleusID" },
      { name: "studentName", title: "Student Name" },
      { name: "startDateReport", title: "Start\xa0Date" },
      { name: "dueDateReport", title: "Due\xa0Date" },
      { name: "totalMarks", title: "Total Marks" },
      { name: "fileDownload", title: "Download" },
      { name: "action", title: "Action" },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <F36FormPopupComponent
          recordId={this.state.recordId}
          fileName={this.state.fileName}
          downloadFile={this.downloadFile}
          handlePopupClose={this.handlePopupClose}
          popupBoxOpen={this.state.popupBoxOpen}
          popupTitle={this.state.popupTitle}
          handleOpenSnackbar={this.handleOpenSnackbar}
          getData={this.getData}
          assignmentGradedData={this.state.assignmentGradedData}
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
              {/* <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> */}
              Assignment Grading
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
          {this.state.showSearchBar ? (
            <F36FormFilter
              isLoading={this.state.isLoading}
              handleDateChange={this.handleDateChange}
              onClearFilters={this.onClearFilters}
              values={this.state}
              getDataByStatus={(status) => this.getData(status)}
              onHandleChange={(e) => this.onHandleChange(e)}
            />
          ) : (
            <br />
          )}
          {this.state.assignmentsData&&!this.state.isLoading ? (
            <F36FormTableComponent
              data={this.state.assignmentsData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid 
              container 
              justify="center" 
              alignItems="center"
            >
              <CircularProgress />
            </Grid>
          )}
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleCloseSnackbar()}
          />
          <BottomBar
            left_button_text="View"
            left_button_hide={false}
            bottomLeftButtonAction={this.viewReport}
            hideRightButton={true}
            right_button_text="Save"
            bottomRightButtonAction={this.clickOnFormSubmit}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
          />
        </div>
      </Fragment>
    );
  }
}
export default F36Form;
