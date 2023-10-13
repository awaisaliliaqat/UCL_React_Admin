import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/styles";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import F304FormTableComponent from "./chunks/F304FormTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const useStyles = () => ({
    
    switch_track: {
      backgroundColor: "#ff000099",
    },
    switch_base: {
      color: "#ff000099",
      "&.Mui-disabled": {
        color: "#e886a9",
      },
      "&.Mui-checked": {
        color: "#95cc97",
      },
      "&.Mui-checked + .MuiSwitch-track": {
        backgroundColor: "#2da758d4",
      },
    },
    switch_primary: {
      "&.Mui-checked": {
        color: "#2da758d4",
      },
      "&.Mui-checked + .MuiSwitch-track": {
        backgroundColor: "#2da758d4",
      },
    },
  });

class F304Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      degreeProgramsData: [],
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

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C304CommonAcademicsDegreeProgramsView`;
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
              degreeProgramsData: json.DATA || [],
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

  onToggleButtonClick = async (e, row) => {
    e.preventDefault();
    if (row.ID) {
      const { checked } = e.target;
      let { degreeProgramsData = [] } = this.state;
      const index = degreeProgramsData.findIndex((item) => item.ID == row.ID);
      if (index >= 0) {
        const isActive = checked ? 1 : 0;

        const formData = new FormData();
        formData.append("id", row.ID);
        formData.append("isActive", isActive);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C304CommonAcademicsDegreeProgramsIsActiveSave`;
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
                this.getData();
                this.handleOpenSnackbar("Updated", "success");
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
                  "Failed to Save, Please try again later.",
                  "error"
                );
                console.log(error);
              }
            }
          );
      }
    }
  };

  render() {
    const { classes } = this.props;
    const columnsPending = [
      { name: "ID", title: "ID" },
      { name: "label", title: "Degree Programme Label" },
      {
        name: "statusLabel",
        title: "Status",
        getCellValue: (row) => {
          return (
            <>
              <div style={{ color: `${row.isActive == 1 ? "green" : "red"}` }}>
                {row.isActive == 1 ? "Active" : "De-active"}
              </div>
            </>
          );
        },
      },
      {
        name: "action",
        title: "Action",
        getCellValue: (row) => {
          return (
            <>
              <Switch
              classes={{
                  track: classes.switch_track,
                  switchBase: classes.switch_base,
                  colorPrimary: classes.switch_primary,
                }}
                id={`toggle-${row.id}`}
                checked={row.isActive == 1}
                onChange={(e) => this.onToggleButtonClick(e, row)}
                color="primary"
                name="checkedB"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </>
          );
        },
      },
      { name: "approvedOn", title: "Approved On" },
      { name: "deactivateOn", title: "Deactivate On" },
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
              Degree Programmes Activation
            </Typography>
            <div style={{ float: "right" }}>
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
          <F304FormTableComponent
            data={this.state.degreeProgramsData}
            columns={columnsPending}
            showFilter={this.state.showTableFilter}
          />
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

F304Form.defaultProps = {
    classes: {}
  };
  
  F304Form.propTypes = {
    classes: PropTypes.object
  };
export default withStyles(useStyles)(F304Form);
