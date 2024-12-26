import React, { Component, Fragment } from "react";
import {
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExcelIcon from "../../../../../assets/Images/excel.png";
import R327UploadedFeeVoucherFilter from "./R327UploadedFeeVoucherFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import R327UploadedFeeVoucherTableComponent from "./R327UploadedFeeVoucherTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";
import { wrap } from "highcharts";
import { TimerSand } from "mdi-material-ui";
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

class R327UploadedFeeVoucher extends Component {
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
      sessionData: "",
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
    // this.getData(this.state.applicationStatusId);
    const { id } = this.props.match.params;
    const sessionId = id.split("T")[1];
    const sessionLabel = id.split("T")[0];
    // this.getMethodData();
    // this.loadAcademicSessions();
    // this.getSchools();
    // this.loadPathway();

    if (id) {
      this.getData(sessionId, sessionLabel);
    }
  }

  getData = async (id, sessionLabel) => {
    this.setState({
      isLoading: true,
    });
    const reload = true;
    let data = new FormData();
    // data.append("studentId", this.state.applicationId || 0);
    data.append("academicSessionId", id || 0);
    // data.append("schoolId", this.state.schoolId || 0);
    // data.append("programmeGroupId", this.state.programmeGroupId || 0);
    // data.append("programmeId", this.state.programmeId || 0);
    // data.append("courseId", this.state.courseObject.id || 0);
    // data.append("pathwayId", this.state.pathwayId || 0);
    // data.append("isActive", this.state.isActive);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C11FinanceStudentsLegacyFeeUploadedVouchersView`;
    await fetch(url, {
      method: "Post",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
      body: data,
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
              sessionData: sessionLabel,
            });
          } else {
            // alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              `${json.SYSTEM_MESSAGE} + "\n" + ${json.USER_MESSAGE}`,
              "error"
            );
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: reload,
            });
          } else {
            // alert("Failed to fetch, Please try again later.");
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

  render() {
    const columns = [
      {
        title: "Bill Id",

        name: "billNo",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Student ID",
        name: "studentId",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },

      {
        title: "Necleus ID",
        name: "studentNecluesId",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Full Name",
        name: "fullName",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "200px !important",
        },
      },
      {
        title: "Student Account",
        name: "accountsId",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Nucleus Session",
        name: "studentSessionId",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },

      {
        title: "Student Class",
        name: "studentClass",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },

      {
        title: "Voucher Session",
        name: "session",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      // {
      //   title: "OId",
      //   name: "oid",
      //   sortable: false,
      //   customStyleHeader: {
      // textAlign: "center",
      //     width: "100px",
      //   },
      // },

      // {
      //   title: "Section",
      //   name: "section",
      //   sortable: false,
      //   customStyleHeader: {
      // textAlign: "center",
      //     width: "100px",
      //   },
      // },
      // {
      //   title: "Father CNIC",
      //   name: "fatherCnic",
      //   sortable: false,
      //   customStyleHeader: {
      // textAlign: "center",
      //     width: "100px",
      //   },
      // },

      {
        title: "Installment",
        name: "installment",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Installment Desc.",
        name: "installmentDescription",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Total Amount",
        name: "totalAmount",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Due Date",
        name: "dueDate",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Payment Date",
        name: "paymentDate",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Payment Method",
        name: "paymentMethod",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Cheque Number",
        name: "chequeDishonorFine",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        name: "Status",
        getCellValue: (rowData) => {
          return (
            <Fragment>
              <div style={{ color: "green" }}>
                {rowData.paymentDate ? "Confirmed" : ""}
              </div>
            </Fragment>
          );
        },
        name: "overDueDays",
        sortIndex: "overDueDays",
        sortable: true,
        customStyleHeader: { width: "16%" },
      },
      {
        title: "Tuition Fee",
        name: "tuitionFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Comp Fee",
        name: "compFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Other Fee",
        name: "otherFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Admission Fee",
        name: "admFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Security Fee",
        name: "securityFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Arr/Adj",
        name: "arrAdj",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Annual Charge",
        name: "oneTimeFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Other Fee 2",
        name: "otherFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Lab Charge",
        name: "labOtherCharges",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Advance Tax",
        name: "advanceIncomeTax",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "PBC Reg. Fee",
        name: "otherFee5",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "180px",
        },
      },

      {
        title: "Other Fee 7",
        name: "otherFee8",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Other Fee 8",
        name: "otherFee8",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Other Fee 9",
        name: "otherFee9",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Other Fee 10",
        name: "otherFee9",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Bill Amount",
        name: "billAmount",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },

      {
        title: "Father Name",
        name: "fatherName",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Mother Name",
        name: "motherName",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Mobile Number",
        name: "mobileNo",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
      {
        title: "Security Fee",
        name: "securityFee",
        sortable: false,
        customStyleHeader: {
          // textAlign: "center",
          width: "100px",
        },
      },
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
              Uploaded Fee Voucher {`(${this.state.sessionData})`}
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
            <R327UploadedFeeVoucherFilter
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
            <R327UploadedFeeVoucherTableComponent
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
export default R327UploadedFeeVoucher;
