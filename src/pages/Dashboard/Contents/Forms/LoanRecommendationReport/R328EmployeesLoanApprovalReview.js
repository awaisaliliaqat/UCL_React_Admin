import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import R328EmployeesLoanApprovalReviewTableComponent from "./Chunks/R328EmployeesLoanApprovalViewTableComponent";
import { Link } from "react-router-dom";
import { BorderRadius } from "mdi-material-ui";
import EditIcon from "@material-ui/icons/Edit";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

class R328EmployeesLoanApprovalReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      employeePayrollsData: [],
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const formData = new FormData();
    formData.append("recordId", 0);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C328CommonUsersEmployeesLoanView`;
    await fetch(url, {
      method: "POST",
      body: formData,
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

            // for (let i = 0; i < data.length; i++) {
            //   const id = data[i].id;
            //   data[i].action = (
            //     <EditDeleteTableComponent
            //       hideEditAction
            //       recordId={id}
            //       deleteRecord={this.DeleteData}
            //       editRecord={() =>
            //         window.location.replace(
            //           `#/dashboard/F315DefineEmployeesPayroll/${id}`
            //         )
            //       }
            //     />
            //   );
            // }
            this.setState({
              employeePayrollsData: data,
            });
          } else {
            this.handleSnackbar(
              true,
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
            this.handleSnackbar(
              true,
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C316CommonUsersEmployeesPayrollDelete`;
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
            this.handleSnackbar(true, "Deleted", "success");
            this.getData();
          } else {
            this.handleSnackbar(
              true,
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
              isReload: false,
            });
          } else {
            this.handleSnackbar(
              true,
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
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

  componentDidMount() {
    this.getData();
  }

  handleApproveLoan = async (event, id) => {
    event.preventDefault();
    console.log(id, "id is coming");

    const data = new FormData();

    data.append("recordId", id);
    data.append("statusId", 1);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C328CommonUsersEmployeesLoanStatusChange`;
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
            this.handleSnackbar(true, "Recommended", "success");
            this.getData();
          } else {
            this.handleSnackbar(
              true,
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
              isReload: false,
            });
          } else {
            this.handleSnackbar(
              true,
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  handleRejectLoan = async (event, id) => {
    event.preventDefault();
    console.log(id, "id is coming");

    const data = new FormData();

    data.append("recordId", id);
    data.append("statusId", 3);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C328CommonUsersEmployeesLoanStatusChange`;
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
            this.handleSnackbar(true, "Rejected", "error");
            this.getData();
          } else {
            this.handleSnackbar(
              true,
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
              isReload: false,
            });
          } else {
            this.handleSnackbar(
              true,
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  downloadMultipleFiles = (e, helpingMaterialFileName) => {
    console.log(helpingMaterialFileName);
    if (helpingMaterialFileName.length !== 0) {
      helpingMaterialFileName.map((dt, i) => this.DownloadFile(e, dt));
    } else {
      this.handleOpenSnackbar("No files found to be download", "error");
    }
  };

  DownloadFile = (e, fileName) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fileName", fileName);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
    fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else if (res.status === 401) {
          this.setState({
            isLoginMenu: true,
            isReload: false,
          });
          return {};
        } else {
          //alert('Operation Failed, Please try again later.');
          this.handleOpenSnackbar(
            "Operation Failed, Please try again later.",
            "error"
          );
          return {};
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
          alert(
            "SQL Error (" +
              result.CODE +
              "): " +
              result.USER_MESSAGE +
              "\n" +
              result.SYSTEM_MESSAGE
          );
        } else if (result.CODE === 3) {
          alert(
            "Other Error (" +
              result.CODE +
              "): " +
              result.USER_MESSAGE +
              "\n" +
              result.SYSTEM_MESSAGE
          );
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

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };
  render() {
    const columns = [
      { name: "id", title: "ID", flex: 1 },
      { name: "userEmployeeId", title: "Employee Id", flex: 1 },
      { name: "userEmployeeLabel", title: "Employee Name", flex: 1 },

      { name: "loanAmount", title: "Loan Amount", flex: 1 },
      { name: "numberOfMonths", title: "Months", flex: 1 },
      { name: "approvedOn", title: "Decision By", flex: 1 },
      { name: "rejectedBy", title: "Rejected By", flex: 1 },
      {
        name: "hell",
        title: "Inst. Per Month",
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <div>
              {Number(rowData.loanAmount / rowData.numberOfMonths).toFixed(2)}
            </div>
          );
        },
      },
      {
        name: "edit",
        title: "Edit",
        sortable: false,
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                // justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {rowData.isRecommended === 1 || rowData.isRecommended === 2 ? (
                // Render as a non-clickable span
                <span
                  style={{
                    //   textTransform: "capitalize",
                    //   fontSize: "12px",
                    //   textDecoration: "none",
                    //   border: "1px solid #bcbcbc",
                    //   padding: "7.5px 10px",
                    //   width: "100px",
                    //   borderRadius: "4px",
                    marginTop: "3.5px",
                    marginRight: "14px",

                    //   background: "white",
                    //   color: "#BCBCBC",
                    //   marginBottom: "3px",
                    //   textAlign: "center",
                  }}
                >
                  <EditIcon style={{ color: "darkgray" }} />
                </span>
              ) : (
                // Render as a clickable link
                <Link
                  variant="outlined"
                  style={{
                    //   textTransform: "capitalize",
                    //   fontSize: "12px",
                    //   textDecoration: "none",
                    //   width: "100px",

                    //   border: "1px solid #BCBCBC",
                    //   textAlign: "center",
                    marginTop: "3.5px",
                    marginRight: "14px",

                    //   padding: "7.5px 10px",
                    //   borderRadius: "4px",
                    //   background: "#FF6B42",
                    //   color: "white",
                  }}
                  to={`/dashboard/F327DefineEmployeesLoan/${rowData.id}TisRecommended`}
                >
                  <EditIcon style={{ color: "black" }} />
                </Link>
              )}
            </div>
          );
        },
      },
      {
        name: "approve",
        title: "Approve",
        sortable: false,
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                // justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  // textTransform: "capitalize",
                  // marginLeft: "5px",
                  // fontSize: "12px",
                  // marginBottom: "3px",
                  // width: "100px",
                  border: "none",
                  // background: rowData.isRecommended !== 1 && "#1565C0",
                  // color: rowData.isRecommended !== 1 && "white",
                }}
                disabled={
                  rowData.isRecommended === 1 || rowData.isRecommended === 2
                }
                onClick={(event) => this.handleApproveLoan(event, rowData.id)}
              >
                <ThumbUpIcon
                  style={{
                    color:
                      rowData.isRecommended === 1 || rowData.isRecommended === 2
                        ? "inherit"
                        : "blue",
                  }}
                />
              </Button>
            </div>
          );
        },
      },
      {
        name: "reject",
        title: "Reject",
        sortable: false,
        flex: 1,
        getCellValue: (rowData) => {
          console.log(rowData);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                // justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  // textTransform: "capitalize",
                  // marginLeft: "5px",
                  // fontSize: "12px",
                  // marginBottom: "3px",
                  // width: "100px",
                  border: "none",

                  // background: rowData.isRecommended !== 1 && "#e63a36",
                  // color: rowData.isRecommended !== 1 && "white",
                }}
                disabled={
                  rowData.isRecommended === 1 || rowData.isRecommended === 2
                }
                onClick={(event) => this.handleRejectLoan(event, rowData.id)}
              >
                <ThumbDownIcon
                  style={{
                    color:
                      rowData.isRecommended === 1 || rowData.isRecommended === 2
                        ? "inherit"
                        : "#f44336",
                  }}
                />
              </Button>
            </div>
          );
        },
      },

      {
        name: "files",
        title: "Download Files",
        getCellValue: (rowData) => {
          return (
            <Fragment>
              <Tooltip title="Download">
                <IconButton
                  onClick={(e) => this.downloadMultipleFiles(e, rowData.files)}
                  aria-label="download"
                >
                  <CloudDownloadIcon />
                </IconButton>
              </Tooltip>
            </Fragment>
          );
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
              {/* <Tooltip title="Back">
                <IconButton
                  onClick={() =>
                    window.location.replace(
                      "#/dashboard/F327DefineEmployeesLoan/0"
                    )
                  }
                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> */}
              Employee Loan recommendation Report
            </Typography>
            <div style={{ float: "right" }}>
              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={() => this.handleToggleTableFilter()}
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
              marginBottom: 20,
            }}
          />
          <R328EmployeesLoanApprovalReviewTableComponent
            rows={this.state.employeePayrollsData}
            columns={columns}
            showFilter={this.state.showTableFilter}
          />
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
          />
        </div>
      </Fragment>
    );
  }
}
export default R328EmployeesLoanApprovalReview;
