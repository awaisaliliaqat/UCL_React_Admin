import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, TextField, Chip, Checkbox} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import F72ReportsTableComponent from "./F72ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";

class F72Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadExcel: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      eventDate: null,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      userMenuItems: [],
      userId: "",
      userIds: "",
      userIdError: "",
      tableData: [],
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

  loadUsers = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72FormProgrammeGroupRightsAllocationAllUsersView`;
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
            this.setState({ userMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadUsers", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  }

  getData = async (userId) => {
    let data = new FormData();
    data.append("userId", userId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72FormProgrammeGroupsRightsAllocationView`;
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
            let data = json.DATA || [];
            let dataLength = data.length;
            this.setState({tableData: data});
            for (var i = 0; i<dataLength; i++) {
              let programmeGroupArray = data[i].programmeGroups || [];
              let programmeGroupArrayLength = programmeGroupArray.length;
              let programmeGroupLabels = [];
              for(var j=0; j<programmeGroupArrayLength; j++){
                programmeGroupLabels.push(<Fragment key={"PG"+j}><span>{programmeGroupArray[j].Label}</span><br/></Fragment>);
              }
              data[i].programmeGroupLabels = programmeGroupLabels;
              json.DATA[i].action = (
                <EditDeleteTableRecord
                  key={"Del"+data[i].id}
                  recordId={data[i].id}
                  DeleteData={this.DeleteData}
                  onEditURL={`#/dashboard/F72Form/${data[i].userId+"&"+data[i].featureId}`}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                />
              );
            }
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
    this.setState({
      isLoading: false,
    });
  };

  DeleteData = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72FormProgrammeGroupsRightsAllocationDelete`;
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
            this.getData(this.state.userId.id);
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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

  handleSetUserId = (value) => {
    this.setState({
      userId: value,
      userIdError: "",
    });
    if(value){
      this.setState({tableData: []});
      this.getData(value.id);
    }else{
      this.setState({tableData: []});
    }
  }

  componentDidMount() {
    this.loadUsers();
  }

  render() {

    const { classes } = this.props;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    
    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "featureLabel", title: "Feature" },
      { name: "programmeGroupLabels", title:"Programme Groups"},
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
              User Feature Programme Group Reports
            </Typography>
            <div style={{ float: "right" }}>
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
          <Grid item xs={12} md={12}>
            <Autocomplete
              //multiple
              fullWidth
              
              id="userId"
              options={this.state.userMenuItems}
              value={this.state.userId}
              onChange={(event, value) =>
                this.handleSetUserId(value)
              }
              disabled={this.state.isEditMode}
              //disableCloseOnSelect
              getOptionLabel={(option) => typeof option.label === 'string' ? option.label : "" }
              //getOptionSelected={(option) => this.userSelected(option)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.label}
                    color="primary"
                    variant="outlined"
                    {...getTagProps({ index })}
                  />
                ))
              }
              // renderOption={(option, {selected}) => (
              //   <Fragment>
              //     <Checkbox
              //       icon={icon}
              //       checkedIcon={checkedIcon}
              //       style={{ marginRight: 8 }}
              //       checked={selected}
              //       color="primary"
              //     />
              //     {option.label}
              //   </Fragment>
              // )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Users"
                  placeholder="Search and Select"
                  required
                  error={!!this.state.userIdError}
                  helperText={this.state.userIdError}
                />
              )}
            />
            <TextField type="hidden" name="userId" value={this.state.userIds}/>
          </Grid>
          {this.state.tableData && !this.state.isLoading ? 
            <F72ReportsTableComponent
              data={this.state.tableData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
           : this.state.isLoading ?
            <Grid container justify="center" alignItems="center">
              <CircularProgress disableShrink={true} />
            </Grid>
            :
            ""
          }
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
export default F72Reports;
