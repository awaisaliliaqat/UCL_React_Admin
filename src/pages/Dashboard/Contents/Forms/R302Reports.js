import React, { Component, Fragment } from "react";
import {
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExcelIcon from "../../../../assets/Images/excel.png";
import F06ReportsFilter from "./F06ReportsFilter";
import TablePanel from "../../../../components/ControlledTable/RerenderTable/TablePanel";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import F302FormTableComponent from "./F302FormTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";

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

class R302Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadExcel: false,
      applicationStatusId: 1,
      savedData: null,
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

  

  getData = async (status) => {
    this.setState({
      isLoading: true,
    });
   
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C302CommonGradebookReportDatesView`;
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
            
            for (var i = 0; i < json.DATA.length; i++) {
              json.DATA[i].action = (
                <EditDeleteTableRecord
                  recordId={json.DATA[i].id}
                  DeleteData={this.DeleteData}
                  onEditURL={`#/dashboard/F302Form/${json.DATA[i].id}`}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                />
              );
            }

            this.setState({
              savedData: json.DATA || [],
            });
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C302CommonGradebookReportDatesDelete`;
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
    this.getData();
  }

  render() {
   
   

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
              Date To Show Students (Student Progress Report) View
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
            <F06ReportsFilter
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
          {this.state.savedData ? (
            <F302FormTableComponent
            rows={this.state.savedData}
               //columns={columns}
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
export default R302Reports;
