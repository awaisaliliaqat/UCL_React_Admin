import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import AnnoucementReportsTableComponent from "./Chunks/AnnoucementReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

class AnnouncementReports extends Component {
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C58CommonAcademicsAnouncementsView`;
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
            this.setState({admissionData: json.DATA || []});
            for (var i = 0; i < json.DATA.length; i++) {
              let GroupAnouncementArray = json.DATA[i].GroupAnouncementArray || [];
              json.DATA[i].groupAnouncement = (GroupAnouncementArray.map((item, index) => <Fragment key={item.Label+index}>{index ?<br/>:""}<span>{item.Label}</span></Fragment>));
              let SectionAnouncementArray = json.DATA[i].SectionAnouncementArray || [];
              json.DATA[i].sectionAnouncement = (SectionAnouncementArray.map((item, index) =>  <Fragment key={item.label+index}>{index ?<br/>:""}<span>{item.label}</span></Fragment>));
              const id = json.DATA[i].id;
              json.DATA[i].action = (
                <EditDeleteTableComponent
                  recordId={id}
                  deleteRecord={this.DeleteData}
                  editRecord={() => window.location.replace(`#/dashboard/announcements/${id}`)}
                />
              );
              let fileName = json.DATA[i].fileName;
              json.DATA[i].fileDownload = (
                <Fragment>
                  <IconButton
                    onClick={(e) => this.DownloadFile(e, fileName)}
                    aria-label="download"
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                </Fragment>
              );
            }
          } else {
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
          }
          console.log("getData", json)
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleOpenSnackbar("Failed to load announcements data, Please try again later.","error");
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C58CommonAcademicsAnouncementsDelete`;
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
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
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
              "Failed to delete, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getData();
  }

  render() {

    const columns = [
      { name: "groupAnouncement", title: "Groups" },
      { name: "sectionAnouncement", title: "Sections" },
      { name: "label", title: "Title" },
      { name: "anouncementDate", title: "Announcement\xa0Date" },
      { name: "anouncementDetails", title: "Announcements" },
      { name: "createdOn", title: "Created On" },
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
            padding: 20
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
                <IconButton onClick={() => window.location.replace('#/dashboard/announcements/0')}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Announcement Reports
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
          <div style={{ marginTop: 20 }} />
          <AnnoucementReportsTableComponent
            data={this.state.admissionData}
            columns={columns}
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

AnnouncementReports.propTypes = {
  setDrawerOpen: PropTypes.func
}

AnnouncementReports.defaultProps = {
  setDrawerOpen: fn => fn
}

export default AnnouncementReports;
