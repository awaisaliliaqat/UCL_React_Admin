import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F84ReportsTableComponent from "./Chunks/F84ReportsTableComponent";

class F84Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      admissionData: [],
      isLoginMenu: false,
      isReload: false,
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

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersViewV2`;
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
            for (let i = 0; i < json.DATA.length; i++) {
              const id = json.DATA[i].id;
              json.DATA[i].action = (
                <EditDeleteTableComponent
                  recordId={id}
                  deleteRecord={this.DeleteData}
                  editRecord={() =>
                    window.location.replace(
                      `#/dashboard/define-employees/${id}`
                    )
                  }
                />
              );
            }
            this.setState({
              admissionData: json.DATA || [],
            });
          } else {
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersDeleteV2`;
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
              isReload: false,
            });
          } else {
            this.handleOpenSnackbar(
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

  render() {
    const columns = [
      { name: "action", title: "Action" },
      { name: "id", title: "ID" },
      { name: "displayName", title: "Name" },
      { name: "mobileNo", title: "Mobile No" },
      { name: "email", title: "Email" },
      { name: "jobStatusLabel", title: "Job Status" },
      { name: "shiftLabel", title: "Shift Label" },

      //   { name: "reportingToId", title: "Reporting To ID" },
      { name: "reportingToLabel", title: "Reporting To" },
      { name: "coordinationLabel", title: "Coordination With" },
      { name: "joiningDateLabel", title: "Joining Date" },
      { name: "statusLabel", title: "Status" },
      // { name: "isBankAccount", title: "Bank Status" },
      {
        name: "bankAccount",
        title: "Bank Account",
        getCellValue: (rowData) => {
          return (
            <Fragment>
              {rowData.bankAccount ? "Bank Account" : "Cheque"}
            </Fragment>
          );
        },
      },
      {
        name: "bankAccountNumber1",
        title: "SCB Account",
        getCellValue: (rowData) => {
          return <Fragment>{rowData.bankAccountNumber1}</Fragment>;
        },
      },
      {
        name: "bankAccountNumber2",
        title: "Faysal Bank Account",
        getCellValue: (rowData) => {
          return <Fragment>{rowData.bankAccountNumber2}</Fragment>;
        },
      },
      { name: "leavingDateLabel", title: "Leaving Date" },
      { name: "rolesLabel", title: "Roles" },
      { name: "entitiesLabel", title: "Entities" },
      { name: "departmentsLabel", title: "Departments" },
      { name: "subDepartmentsLabel", title: "Sub Departments" },
      { name: "designationsLabel", title: "Designations" },
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
                    window.location.replace("#/dashboard/F84Form")
                  }
                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Employee Reports
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
          <F84ReportsTableComponent
            rows={this.state.admissionData}
            columns={columns}
            showFilter={this.state.showTableFilter}
            isLoading={this.state.isLoading}
          />
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            isLoading={this.state.isLoading}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleCloseSnackbar()}
          />
        </div>
      </Fragment>
    );
  }
}
export default F84Reports;
