import React, { Component, Fragment } from "react";
import {
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExcelIcon from "../../../../../../assets/Images/excel.png";
import F322HourlySheetReportFilterForCoordinator from "./F322HourlySheetReportFilterForCoordinator";
import F322HourlySheetReportTableComponentForCoordinator from "./F322HourlySheetReportTableComponentForCoordinator";
import TablePanel from "../../../../../../components/ControlledTable/RerenderTable/TablePanel";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";
import ViewTableRecord from "../../../../../../components/EditDeleteTableRecord/ViewTableRecord";

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

class F322HourlySheetReportForCoordinator extends Component {
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

  // getGenderData = async () => {
  //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonGendersView`;
  //     await fetch(url, {
  //         method: "GET",
  //         headers: new Headers({
  //             Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
  //         })
  //     })
  //         .then((res) => {
  //             if (!res.ok) {
  //                 throw res;
  //             }
  //             return res.json();
  //         })
  //         .then(
  //             (json) => {
  //                 this.setState({
  //                     genderData: json.DATA,
  //                 });
  //             },
  //             (error) => {
  //                 if (error.status === 401) {
  //                     this.setState({
  //                         isLoginMenu: true,
  //                         isReload: true
  //                     })
  //                 } else {
  //                     alert('Failed to fetch, Please try again later.');
  //                     console.log(error);
  //                 }
  //             }
  //         );
  // };

  // getDegreesData = async () => {
  //     let data = [];
  //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonAcademicsDegreeProgramsView`;
  //     await fetch(url, {
  //         method: "GET",
  //         headers: new Headers({
  //             Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
  //         })
  //     })
  //         .then((res) => {
  //             if (!res.ok) {
  //                 throw res;
  //             }
  //             return res.json();
  //         })
  //         .then(
  //             (json) => {
  //                 const resData = json.DATA || [];
  //                 if (resData.length > 0) {
  //                     for (let i = 0; i < resData.length; i++) {
  //                         if (!isEmpty(resData[i])) {
  //                             data.push({ id: "", label: resData[i].department });
  //                         }
  //                         for (let j = 0; j < resData[i].degrees.length; j++) {
  //                             if (!isEmpty(resData[i].degrees[j])) {
  //                                 data.push({
  //                                     id: resData[i].degrees[j].id,
  //                                     label: resData[i].degrees[j].label,
  //                                 });
  //                             }
  //                         }
  //                     }
  //                 }
  //             },
  //             (error) => {
  //                 if (error.status === 401) {
  //                     this.setState({
  //                         isLoginMenu: true,
  //                         isReload: true
  //                     })
  //                 } else {
  //                     alert('Failed to fetch, Please try again later.');
  //                     console.log(error);
  //                 }
  //             }
  //         );
  //     this.setState({
  //         degreeData: data,
  //     });
  // };

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

  // getAddmissionForm = async id => {
  //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationSubmittedApplicationsStudentProfileView?applicationId=${id}`;
  //     this.setState({
  //         isLoading: true
  //     })
  //     await fetch(url, {
  //         method: "GET",
  //         headers: new Headers({
  //             Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
  //         })
  //     })
  //         .then(res => {
  //             if (!res.ok) {
  //                 throw res;
  //             }
  //             return res.json();
  //         })
  //         .then(
  //             json => {
  //                 if (json.CODE === 1) {
  //                     if (json.DATA) {
  //                         if (json.DATA.length > 0) {
  //                             this.setState({
  //                                 addmissionForm: json.DATA[0] || {},
  //                                 isOpenForm: true
  //                             });
  //                         } else {
  //                             alert('Geting Data empty, Please try again later.')
  //                         }
  //                     } else {
  //                         alert('Geting Data empty, Please try again later.')
  //                     }
  //                 } else {
  //                     alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
  //                 }
  //                 console.log(json);
  //             },
  //             error => {
  //                 if (error.status === 401) {
  //                     this.setState({
  //                         isLoginMenu: true,
  //                         isReload: false
  //                     })
  //                 } else {
  //                     alert('Failed to fetch, Please try again later.');
  //                     console.log(error);
  //                 }
  //             });

  //     const url2 = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationDocumentsView?applicationId=${id}`;
  //     await fetch(url2, {
  //         method: "GET",
  //         headers: new Headers({
  //             Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
  //         })
  //     })
  //         .then(res => {
  //             if (!res.ok) {
  //                 throw res;
  //             }
  //             return res.json();
  //         })
  //         .then(
  //             json => {
  //                 if (json.DATA) {
  //                     this.setState({
  //                         documentsData: json.DATA || []
  //                     })
  //                 }
  //             },
  //             error => {
  //                 if (error.status === 401) {
  //                     this.setState({
  //                         isLoginMenu: true,
  //                         isReload: false
  //                     })
  //                 } else {
  //                     alert('Failed to fetch, Please try again later.');
  //                     console.log(error);
  //                 }
  //             }
  //         );

  //     this.setState({
  //         isLoading: false,
  //     })

  // }

  // downloadExcelData = async () => {
  //     if (this.state.isDownloadExcel === false) {
  //         this.setState({
  //             isDownloadExcel: true
  //         })
  //         const type = this.state.applicationStatusId === 2 ? 'Submitted' : 'Pending';
  //         const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
  //         const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
  //         await fetch(url, {
  //             method: "GET",
  //             headers: new Headers({
  //                 Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
  //             })
  //         })
  //             .then(res => {
  //                 if (res.status === 200) {
  //                     return res.blob();
  //                 }
  //                 return false;
  //             })
  //             .then(
  //                 json => {
  //                     if (json) {
  //                         var csvURL = window.URL.createObjectURL(json);
  //                         var tempLink = document.createElement("a");
  //                         tempLink.setAttribute("download", `Applications${type}.xlsx`);
  //                         tempLink.href = csvURL;
  //                         tempLink.click();
  //                         console.log(json);
  //                     }
  //                 },
  //                 error => {
  //                     if (error.status === 401) {
  //                         this.setState({
  //                             isLoginMenu: true,
  //                             isReload: false
  //                         })
  //                     } else {
  //                         alert('Failed to fetch, Please try again later.');
  //                         console.log(error);
  //                     }
  //                 });
  //         this.setState({
  //             isDownloadExcel: false
  //         })
  //     }
  // }

  getData = async (status) => {
    this.setState({
      isLoading: true,
    });
    const reload =
      status === 1 &&
      this.state.applicationId === "" &&
      this.state.genderId === 0 &&
      this.state.degreeId === 0 &&
      this.state.studentName === "";
    const type =
      status === 1 ? "Pending" : status === 2 ? "Submitted" : "Pending";
    const eventDataQuery = this.state.eventDate
      ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}`
      : "";
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322TeachersProgrammeGroupAttandanceAprrovalView`;
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
            this.setState({
              admissionData: json.DATA || [],
            });
            for (var i = 0; i < json.DATA.length; i++) {
              json.DATA[i].action = (
                <ViewTableRecord
                  recordId={json.DATA[i].id}
                  DeleteData={this.DeleteData}
                  onEditURL={`/dashboard/F322ViewRecordData/${json.DATA[i].id}`}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                />
              );
            }
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: reload,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsDelete`;
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
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  // DownloadFile = (fileName) => {
  //     const data = new FormData();
  //     data.append("fileName", fileName);
  //     const url = `${process.env.REACT_APP_API_DOMAIN}/${
  //         process.env.REACT_APP_SUB_API_NAME
  //         }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
  //     fetch(url, {
  //         method: "GET",
  //         headers: new Headers({
  //             Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
  //         }),
  //     })
  //         .then((res) => {
  //             if (res.status === 200) {
  //                 return res.blob();
  //             } else if (res.status === 401) {
  //                 this.setState({
  //                     isLoginMenu: true,
  //                     isReload: false
  //                 })
  //                 return {}
  //             } else {
  //                 alert('Operation Failed, Please try again later.');
  //                 return {}
  //             }
  //         })
  //         .then((result) => {
  //             var csvURL = window.URL.createObjectURL(result);
  //             var tempLink = document.createElement("a");
  //             tempLink.href = csvURL;
  //             tempLink.setAttribute("download", fileName);
  //             tempLink.click();
  //             console.log(csvURL);
  //             if (result.CODE === 1) {
  //                 //Code
  //             } else if (result.CODE === 2) {
  //                 alert(
  //                     "SQL Error (" +
  //                     result.CODE +
  //                     "): " +
  //                     result.USER_MESSAGE +
  //                     "\n" +
  //                     result.SYSTEM_MESSAGE
  //                 );
  //             } else if (result.CODE === 3) {
  //                 alert(
  //                     "Other Error (" +
  //                     result.CODE +
  //                     "): " +
  //                     result.USER_MESSAGE +
  //                     "\n" +
  //                     result.SYSTEM_MESSAGE
  //                 );
  //             } else if (result.error === 1) {
  //                 alert(result.error_message);
  //             } else if (result.success === 0 && result.redirect_url !== "") {
  //                 window.location = result.redirect_url;
  //             }
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //         });
  // };

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
    this.getData(this.state.applicationStatusId);
  }

  render() {
    // const columnsSubmitted = [
    //     //{ name: "SR#", dataIndex: "serialNo", sortable: false, customStyleHeader: { width: '7%' } },
    //     { name: "Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '8%', textAlign: 'center' } },
    //     {name: "Name", renderer: rowData => { return (<Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>)}, sortable: false, customStyleHeader: { width: '10%' }},
    //     { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '12%' } },
    //     { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
    //     { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
    //     { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '15%' } },
    //     { name: "Submission Date", dataIndex: "submittedOn", sortIndex: "submittedOn", sortable: true, customStyleHeader: { width: '15%' } },
    //     { name: "Payment Method", dataIndex: "paymentMethod", sortIndex: "paymentMethod", sortable: true, customStyleHeader: { width: '15%' } },
    //     { name: "Status", dataIndex: "status", sortIndex: "status", sortable: true, customStyleHeader: { width: '15%' } },
    //     { name: "Profile", renderer: rowData => {return (<Button style={{fontSize: 12,textTransform: 'capitalize'}} variant="outlined" onClick={() => window.open(`#/view-application/${rowData.id}`, "_blank")} >View</Button>)}, sortable: false, customStyleHeader: { width: '15%' }},
    // ]

    const columns = [
      { name: "sessionLabel", title: "Session" },
      {
        name: "programGroupLabel",
        title: "Program Label",
        customStyleHeader: { width: "20%", textAlign: "center" },
        align: "center",
      },
      { name: "year", title: "Year" },
      { name: "month", title: "Month" },
      // { name: "approvedByHodLabel", title: "Approved by HOD" },
      { name: "approvedByHodLabel", title: "Approved" },
      { name: "approvedByHodOn", title: "Approved On" },

      // { name: "fromDate", title: "From Date" },
      // { name: "toDate", title: "To Date" },
      // { name: "totalAmount", title: "Total Amount" },
      // { name: "totalAvgRatePerHour", title: "Total Average per Hour" },
      // { name: "totalHours", title: "Total Hours" },

      // { name: "label", title: "School\xa0Name - Short\xa0Name" },
      // // { name: "shortLabel", title: "Short\xa0Name" },
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
              Hourly Sheet for Coordinators
            </Typography>
            {/* <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                            height: 30, width: 32,
                            cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                        }}
                        /> */}
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
            <F322HourlySheetReportFilterForCoordinator
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
          {this.state.admissionData ? (
            <F322HourlySheetReportTableComponentForCoordinator
              data={this.state.admissionData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid container justifyContent="center" alignItems="center">
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
export default F322HourlySheetReportForCoordinator;
