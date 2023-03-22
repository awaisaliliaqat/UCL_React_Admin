import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Typography, Fab} from "@material-ui/core";
import F205FormFilter from "./F205FormFilter";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import F205FormTableComponent from "./F205FormTableComponent";
import F205FormPopupComponent from "./F205FormPopupComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';

class F205Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadExcel: false,
      popupBoxOpen:false,
      applicationStatusId: 1,
      tableData: [],
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
      sectionId:"",
      studentId:"",
      examId:"",
      popupTitle:"",
      recordId:"",
      fileName:"",
      fileUrl: "",
      examGradedData:{}
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

  handlePopupOpen = (studentId,sectionId,examId,popupTitle, recordId, fileName, fileUrl, totalMarks, examGradedData) => {
    this.setState({ 
      sectionId:sectionId,
      studentId:studentId,
      examId:examId,
      popupTitle: popupTitle,
      recordId: recordId,
      fileName: fileName,
      fileUrl: fileUrl,
      popupBoxOpen: true,
      totalMarks: totalMarks,
      examGradedData: examGradedData
    });
  };

  handlePopupClose = () => {
    this.setState({
      popupBoxOpen: false,
      sectionId:"",
      studentId:"",
      examId:"",
      popupTitle:"",
      recordId:"",
      fileName:"",
      fileUrl: "",
      totalMarks:"",
      examGradedData:{}
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

  getData = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C205CommonAcademicsExamsResultsView`;
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
            let data = json.DATA || [];
            let dataLength = data.length;
            for (let i=0; i<dataLength; i++) {
              let sectionId= data[i].sectionId;
              let studentId= data[i].studentId;
              let examId = data[i].id;
              let recordId = data[i].studentExamId;
              let popupTitle = data[i].nucleusId+" - "+data[i].studentName+" - "+data[i].sectionLabel+"\xa0\xa0\xa0("+data[i].label+")";
              let fileName = data[i].examFileName;
              let fileUrl = data[i].examFileUrl;
              let isExamGraded = data[i].isExamGraded;
              let gradedExamFileName = data[i].gradedExamFileName;
              let gradedExamFileUrl = data[i].gradedExamFileUrl;
              let obtainedMarks = data[i].obtainedMarks;
              let remarks = data[i].remarks;
              let totalMarks = data[i].totalMarks;
              let examGradedData = {};
              if(isExamGraded){
                examGradedData = {
                  gradedExamFileName: gradedExamFileName,
                  gradedExamFileUrl: gradedExamFileUrl,
                  obtainedMarks: obtainedMarks,
                  remarks: remarks
                }
              }
              data[i].action = (
                <Fragment>
                  <Tooltip title={isExamGraded ? "Change Grading":"Grading"}>
                    <Fab 
                      aria-label="add"
                      size="small"
                      color="secondary"
                      style={
                        isExamGraded ?
                          {height:36, width:36, backgroundColor:"#4caf50"}
                          :
                          {height:36, width:36, backgroundColor:"rgb(29, 95, 152)"}
                      }
                      onClick={() => this.handlePopupOpen(studentId,sectionId,examId,popupTitle, recordId, fileName, fileUrl, totalMarks, examGradedData)}
                    >
                      <EditIcon fontSize="small"/>
                    </Fab>
                  </Tooltip>
                </Fragment>
              );
              data[i].fileDownload = (
                <Fragment>
                  <Tooltip title="Download Exam">
                    <IconButton 
                      onClick={(e)=>this.downloadFile(e, fileUrl, fileName)}
                      aria-label="download"
                      disabled={fileName=== ""|| fileName===null? true:false}
                      color="primary"
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  {gradedExamFileUrl && 
                  <Tooltip title="Download Graded Exam">
                    <IconButton 
                      onClick={(e)=>this.downloadFile(e, gradedExamFileUrl, gradedExamFileName)} 
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
            this.setState({tableData: data});
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
    this.setState({isLoading: false});
  };

  // DeleteData = async (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.target);
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsExamsDelete`;
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

  downloadFile = (e, fileUrl, fileName="") => {
    e.preventDefault();
    let data = new FormData();
    data.append("fileName", fileUrl);
    if(fileName==null || fileName=="") {fileName = fileUrl;}
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonViewFile`;
    fetch(url, {
        method: "POST",
        body: data,
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

        let fileURL = window.URL.createObjectURL(result);
        let tempLink = document.createElement("a");
        tempLink.href = fileURL;
        tempLink.setAttribute("download", fileName);
        tempLink.click();
        
        if(result.type!="application/json"){
          this.handleOpenSnackbar("Operation Failed, Please try again later.","error");
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
      { name: "label", title: "Exam" },
      { name: "nucleusId", title: "NucleusID" },
      { name: "studentName", title: "Student Name" },
      { name: "startDateReport", title: "Start\xa0Date" },
      { name: "endDateReport", title: "Due\xa0Date" },
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
        <F205FormPopupComponent
          sectionId={this.state.sectionId}
          studentId={this.state.studentId}
          examId={this.state.examId}
          recordId={this.state.recordId}
          fileName={this.state.fileName}
          fileUrl={this.state.fileUrl}
          downloadFile={this.downloadFile}
          handlePopupClose={this.handlePopupClose}
          popupBoxOpen={this.state.popupBoxOpen}
          popupTitle={this.state.popupTitle}
          totalMarks={this.state.totalMarks}
          handleOpenSnackbar={this.handleOpenSnackbar}
          getData={this.getData}
          examGradedData={this.state.examGradedData}
        />
        <div style={{padding: 20}}>
          <Grid
            container
            justify="space-between"
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              Exam Grading
            </Typography>
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
          </Grid>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          {this.state.showSearchBar ? (
            <F205FormFilter
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
          {this.state.tableData&&!this.state.isLoading ? (
            <F205FormTableComponent
              data={this.state.tableData}
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
          {/*
          <br/>
          <br/>
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
          */}
        </div>
      </Fragment>
    );
  }
}
export default F205Form;
