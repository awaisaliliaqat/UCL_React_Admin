import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import R327EmployeesLoanViewTableComponent from "./Chunks/R327EmployeesLoanViewTableComponent";
import { withRouter } from "react-router-dom";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

class R327EmployeesLoanView extends Component {
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C327CommonUsersEmployeesLoanView`;
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

  downloadMultipleFiles = (e, helpingMaterialFileName) => {
    console.log(helpingMaterialFileName);
    if (helpingMaterialFileName.length !== 0) {
      helpingMaterialFileName.map((dt, i) => this.DownloadFile(e, dt));
    } else {
      this.handleOpenSnackbar("No files found to be download", "error");
    }
  };

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
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

  render() {
    const columns = [
      { name: "id", title: "ID" },
      { name: "userEmployeeId", title: "Employee Id" },
      { name: "userEmployeeLabel", title: "Employee Name" },

      { name: "loanAmount", title: "Loan Amount" },
      { name: "numberOfMonths", title: "Months" },
      {
        name: "",
        title: "Inst. Per Month",
        getCellValue: (rowData) => {
          console.log(rowData);

          return (
            <div>
              {Number(rowData.loanAmount / rowData.numberOfMonths).toFixed(2)}
            </div>
          );
        },
      },

      {
        name: "recommendedOn",
        title: "Recommended By",
        // getCellValue: (rowData) => {
        //   console.log(rowData);

        //   return (
        //     <div>
        //       {rowData.isRecommended === 1
        //         ? "Recommended"
        //         : rowData.isRecommended === 2
        //         ? "Rejected"
        //         : "Pending"}
        //     </div>
        //   );
        // },
      },
      // { name: "rejectedBy", title: "Rejected By" },
      { name: "approvedOn", title: "Decision By" },
      { name: "rejectedBy", title: "Rejected By" },

      {
        name: "isRecommended",
        title: "Decision Status",
        getCellValue: (rowData) => {
          console.log(rowData);

          return (
            <div>
              {rowData.isRecommended === 1
                ? "Recommended"
                : rowData.isRecommended === 2
                ? "Rejected"
                : "Pending"}
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

      // { name: "createdBy", title: "Created By" },
      // { name: "action", title: "Action" },
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
                <IconButton
                  onClick={() =>
                    window.location.replace(
                      "#/dashboard/F327DefineEmployeesLoan/0"
                    )
                  }
                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Employee Loan Report
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
          <R327EmployeesLoanViewTableComponent
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
export default withRouter(R327EmployeesLoanView);
