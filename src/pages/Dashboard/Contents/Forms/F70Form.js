import React, { Component, useState, Fragment, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  Divider,
  Typography,
  Chip,
  Checkbox,
  Collapse,
  CircularProgress,
  Paper,
  TableContainer,
  IconButtonTable,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  TableRow,
  Switch,
} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: "1px solid " + theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    //border: '1px solid '+theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = (theme) => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  },
  expand: {
    transform: "rotate(-90deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(0deg)",
  },
});

function Switches(props) {
  const [open, setOpen] = React.useState(false);
  const [dialogMsg, setDialogMsg] = React.useState("");
  const [switchState, setSwitchState] = React.useState(props.isChecked);

  const handleClickOpen = () => {
    if (switchState) {
      setDialogMsg("Are you sure you want to deactivate?");
    } else {
      setDialogMsg("Are you sure you want to activate?");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    if (switchState) {
      //setSwitchState(event.target.checked);
      props.onChangeAction(props.recordId, 0, setSwitchState);
    } else {
      //setSwitchState(event.target.checked);
      props.onChangeAction(props.recordId, 1, setSwitchState);
    }
  };

  return (
    <Fragment>
      <Switch
        checked={switchState}
        //onChange={handleChange}
        onClick={handleClickOpen}
        color="primary"
        name="switch"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography
              variant="subtitle1"
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              Confirm !
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogMsg}&emsp;
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              No
            </Button>
            <Button
              onClick={(handleClose, handleChange)}
              color="primary"
              variant="contained"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fragment>
  );
}

function FeatureDetail(props) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const {
    classes,
    data,
    isOpen,
    featureId,
    featureLabel,
    isChecked,
    i,
    programmeGroupMenuItems,
    isSelectedProgrammeGroups,
  } = props;

  const [GroupMenuItems, setprogrammeGroupMenuItems] = useState(
    programmeGroupMenuItems
  );
  const [selectedMenuItems, setSelectedMenuItems] = useState(
    isSelectedProgrammeGroups
  );

  const [isDisabled, setIsEnabled] = useState(!isChecked);

  const [programmeGroupIds, setProgrammeGroupIds] = useState("");

  const handleSetUserId = (value) => {
    setSelectedMenuItems(value);

    let programmeGroupIdArrays = "";
    if (value) {
      let users = value || [];
      let arrLength = value.length || 0;
      for (let i = 0; i < arrLength; i++) {
        if (i == 0) {
          programmeGroupIdArrays = users[i].Id;
        } else {
          programmeGroupIdArrays += "~" + users[i].Id;
        }
      }
      setProgrammeGroupIds(programmeGroupIdArrays);
    }
  };

  const handleCheckBoxChange = (target) => {
    console.log(target.checked);

    if (target.checked == false) {
      // console.log("UNCHECKED");
      setIsEnabled(true);
    } else if (target.checked == true) {
      // console.log("CHECKED");
      setIsEnabled(false);
    }
    //console.log("isDisabled =>> ",isDisabled);
  };

  const userSelected = (option) => {
    return selectedMenuItems.some(
      (selectedOption) => selectedOption.Id == option.Id
    );
  };

  useEffect(() => {
    handleSetUserId(selectedMenuItems);
  });

  return (
    <StyledTableRow key={"row" + data.typeLabel + i}>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        style={{ width: "30%", borderColor: "#fff" }}
      >
        {featureLabel}
      </StyledTableCell>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        style={{ width: "10%", borderColor: "#fff" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              // checked={dt.is}
              onChange={(e) => handleCheckBoxChange(e.target)}
              value={featureId}
              defaultChecked={isChecked}
              id={"checkBox_" + featureId}
              // name={"checkBox_"+data.typeLabel}
              name={"featureId"}
              color="primary"
            />
          }
          label="Assigned"
        />
      </StyledTableCell>

      <StyledTableCell style={{ width: "60%" }}>
        <Grid item xs={12} md={12}>
          {
            <Autocomplete
              multiple
              fullWidth
              id={"userId_" + featureId}
              options={GroupMenuItems}
              value={selectedMenuItems}
              //value={[{id: 1471, label: "Rizwan Ahmed"}]}
              //options={[{id: 1471, label: "Rizwan Ahmed"}]}
              onChange={(event, value) => handleSetUserId(value)}
              disabled={isDisabled}
              disableCloseOnSelect
              getOptionLabel={(option) => option.Label}
              getOptionSelected={(option) => userSelected(option)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.Label}
                    color="primary"
                    variant="outlined"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderOption={(option, { selected }) => (
                <Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    color="primary"
                  />
                  {option.Label}
                </Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Programme Groups"
                  placeholder="Search and Select"
                  // error={!!this.state.userIdError}
                  // helperText={this.state.userIdError}
                />
              )}
            />
          }
          {
            <TextField
              type="hidden"
              disabled={isDisabled}
              name="programGroupIds"
              value={programmeGroupIds}
            />
          }
        </Grid>
      </StyledTableCell>
    </StyledTableRow>
  );
}

function Features(props) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const {
    classes,
    data,
    isOpen,
    userMenuItems,
    programmeGroupMenuItems,
    userId,
  } = props;

  const [selectedMenuItems, setSelectedMenuItems] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const userSelected = (option) => {
    return selectedMenuItems.some(
      (selectedOption) => selectedOption.id == option.id
    );
  };

  const handleSetUserId = (value) => {
    setSelectedMenuItems(value);

    console.log("value" + value);

    let userIds = "";
  };

  return (
    <Grid item xs={12}>
      <Typography
        color="primary"
        component="div"
        style={{ fontWeight: 600, fontSize: 18, color: "rgb(29, 95, 134)" }}
      >
        <IconButton
          className={clsx(classes.expand, { [classes.expandOpen]: expanded })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon
            color="primary"
            style={{ color: "rgb(29, 95, 134)" }}
          />
        </IconButton>
        {data.typeLabel}
        <Divider
          style={{
            backgroundColor: "rgb(29, 95, 134)", //"rgb(58, 127, 187)",
            // backgroundColor:"#fff", //"rgb(58, 127, 187)",
            opacity: "0.3",
            marginLeft: 50,
            marginTop: -10,
          }}
        />
      </Typography>
      <Collapse in={expanded} timeout="auto">
        <div style={{ paddingLeft: 50 }}>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    align="center"
                    style={{ backgroundColor: "#1d5f98" }}
                  >
                    Feature
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    style={{ backgroundColor: "#1d5f98" }}
                  >
                    Action
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    style={{ backgroundColor: "#1d5f98" }}
                  >
                    Programme Groups
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.features.length > 0 ? (
                  data.features.map((dt, i) => (
                    <FeatureDetail
                      key={"featureData" + dt.featureId}
                      classes={classes}
                      data={data}
                      featureId={dt.featureId}
                      featureLabel={dt.featureLabel}
                      isChecked={dt.isChecked}
                      i={i}
                      isOpen={false}
                      userId={userId}
                      programmeGroupMenuItems={programmeGroupMenuItems}
                      isSelectedProgrammeGroups={dt.programmeGroups}
                    />
                  ))
                ) : this.state.isLoading ? (
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row" colSpan={4}>
                      <center>
                        <CircularProgress />
                      </center>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row" colSpan={4}>
                      <center>
                        <b>No Data</b>
                      </center>
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Collapse>
    </Grid>
  );
}

class F70Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      userMenuItems: [],
      programmeGroupMenuItems: [],
      userDetail: [],
      user: [],
      userId: [],
      userID: "",
      userIds: "",
      userIdError: "",
      featureMenuItems: [],
      featureId: [],
      featureIds: "",
      featureIdError: "",
      isEditMode: false,
      expanded: false,
      userRolesTypes: [],
      userRoles: [],
      userRolesError: "",
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

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  onSwitchStatusChange = async (id, isActive, changeSwitch) => {
    const data = new FormData();
    data.append("id", id);
    data.append(" isActive", isActive);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C70IsActiveStatusUpdate`;
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
            changeSwitch(true);
            if (this.state.recordId != 0) {
              window.location = "#/dashboard/F70Form/0";
            } else {
              window.location.reload();
            }
          } else {
            //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
            changeSwitch(false);
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            //alert("Failed to Save ! Please try Again later.");
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadUsers = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationAllUsersView`;
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
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadUsersRolesTypes = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationUsersRolesTypesView`;
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
            this.setState({ userRolesTypes: json.DATA });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadUsersProgrammeGroups = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationAllProgrammeGroupsView2`;
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
            this.setState({ programmeGroupMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadUsersDetails = async (userId) => {
    const data = new FormData();
    data.append("userId", userId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationUsersDetailView`;
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
            let { userRoles = []} = json.DATA[0] || {}; 
            this.setState({ user: json.DATA[0] || [], userRoles });
            console.log(json.DATA[0].userLabel);
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadUsersDetail", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadFeatureUsersDetails = async (userId) => {
    const data = new FormData();
    data.append("userId", userId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationUsersFeatureDetailView`;
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
            this.setState({ userDetail: json.DATA || [] });
            console.log(this.state.userDetail);
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadUsersDetail", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadFeatures = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonFeaturesViews`;
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
            this.setState({ featureMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadFeatures", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadData = async (recordId) => {
    const data = new FormData();
    data.append("id", recordId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationViews`;
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
            if (dataLength > 0) {
              if (data[0].userId) {
                this.handleSetUserId([
                  { id: data[0].userId, label: data[0].userLabel },
                ]);
                let features = data[0].features || [];
                this.handleSetFeatureId(features);
                this.setState({ isEditMode: true });
              } else {
                window.location = "#/dashboard/F70Form/0";
              }
            }
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isUsersValid = () => {
    let userId = this.state.userId;
    let isValid = true;
    if (userId.length == 0) {
      this.setState({ userIdError: "Please select at least one user." });
      document.getElementById("userId").focus();
      isValid = false;
    } else {
      this.setState({ userIdError: "" });
    }
    return isValid;
  };

  isFeatureValid = () => {
    let featureId = this.state.featureId;
    let isValid = true;
    if (featureId.length == 0) {
      this.setState({ featureIdError: "Please select at least one feature." });
      document.getElementById("featureId").focus();
      isValid = false;
    } else {
      this.setState({ featureIdError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "":
        break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  userSelected = (option) => {
    return this.state.userId.some(
      (selectedOption) => selectedOption.id == option.id
    );
  };

  handleSetUserId = (value) => {
    this.setState({
      userId: value,
      userIdError: "",
      userDetail: [],
      user: [],
      userIds: ""
    });

    console.log("value", value);
    if (value != null && value != "undefined") {
      this.loadUsersDetails(value.id);
      this.loadFeatureUsersDetails(value.id);
      this.setState({ userIds: value.id });
      // }
    }

    // let userIds = "";
    // if(value){
    //   let users = value || [];
    //   let arrLength = value.length || 0;
    //   for(let i=0; i<arrLength; i++){
    //     if(i==0){
    //       userIds = users[i].id;
    //     }else{
    //       userIds+= ","+users[i].id;
    //     }
    //   }
    //   this.setState({userIds:userIds});
    // }
  };

  featureSelected = (option) => {
    return this.state.featureId.some(
      (selectedOption) => selectedOption.id == option.id
    );
  };

  handleSetFeatureId = (value) => {
    this.setState({
      featureId: value,
      featureIdError: "",
    });

    let featureIds = "";
    if (value) {
      let features = value || [];
      let arrLength = value.length || 0;
      for (let i = 0; i < arrLength; i++) {
        if (i == 0) {
          featureIds = features[i].id;
        } else {
          featureIds += "," + features[i].id;
        }
      }
      this.setState({ featureIds: featureIds });
    }
  };

  clickOnFormSubmit = () => {
    //  if(
    //   !this.isUsersValid()
    //   || !this.isFeatureValid()
    // ){ return; }
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);

    if(this.state.userRoles?.length > 0){
      for(let i=0; i<this.state.userRoles.length; i++){
        data.append("userRoleId", this.state.userRoles[i]["id"]);
      }
    }

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationAllProgrammeGroupsSaveNewV2`;
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
            this.handleOpenSnackbar(json.USER_MESSAGE, "success");
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F70Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F70Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadUsers();
    this.loadUsersProgrammeGroups();
    this.loadUsersRolesTypes();
    // this.loadFeatures();
    // if(this.state.recordId!=0) {
    //   this.loadData(this.state.recordId);
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
      } else {
        window.location.reload();
      }
    }
  }

  onUserRolesChange = (newArray) => {

    this.setState({
      userRoles: newArray
    })

  }

  render() {
    const { classes } = this.props;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              User Rights
            </Typography>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  id="userId"
                  options={this.state.userMenuItems}
                  value={this.state.userId}
                  onChange={(event, value) => this.handleSetUserId(value)}
                  disabled={this.state.isEditMode}
                  // disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  // getOptionSelected={(option) => this.userSelected(option)}
                  // renderTags={(tagValue, getTagProps) =>
                  //   tagValue.map((option, index) => (
                  //     <Chip
                  //       label={option.label}
                  //       color="primary"
                  //       variant="outlined"
                  //       {...getTagProps({ index })}
                  //     />
                  //   ))
                  // }
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
                      error={!!this.state.userIdError}
                      helperText={this.state.userIdError}
                    />
                  )}
                />
                <TextField
                  type="hidden"
                  name="userId"
                  value={this.state.userIds}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Typography
                style={{
                  // color: "#1d5f98",
                  // fontWeight: 400,
                  // marginTop:25,
                  // // borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                  // width: "98%",

                  // fontSize: 15,

                  color: "#1d5f98",
                  fontWeight: 600,
                  borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                  width: "98%",
                  marginBottom: 25,
                  marginTop: 25,
                  fontSize: 20,
                }}
                variant="h5"
              >
                User Detail
              </Typography>

              <Grid style={{ background: "#1d5f98" }} item xs={12} md={3}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                    color: "#fff",
                  }}
                  variant="h5"
                >
                  Name
                </Typography>
              </Grid>
              <Grid style={{ background: "#1d5f98" }} item xs={12} md={2}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                    color: "#fff",
                  }}
                  variant="h5"
                >
                  Mobile No
                </Typography>
              </Grid>

              <Grid style={{ background: "#1d5f98" }} item xs={12} md={2}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                    color: "#fff",
                  }}
                  variant="h5"
                >
                  User Type
                </Typography>
              </Grid>
              <Grid style={{ background: "#1d5f98" }} item xs={12} md={3}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                    color: "#fff",
                  }}
                  variant="h5"
                >
                  Discipline
                </Typography>
              </Grid>

              <Grid style={{ background: "#1d5f98" }} item xs={12} md={2}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                    color: "#fff",
                  }}
                  variant="h5"
                >
                  Status
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
                marginTop: 25,
              }}
            >
              <Grid item xs={12} md={3}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                  }}
                  variant="h5"
                >
                  {this.state.user.userLabel}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                  }}
                  variant="h5"
                >
                  {this.state.user.userMobile}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                  }}
                  variant="h5"
                >
                  {this.state.user.userType}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography
                  style={{
                    fontWeight: 400,
                    width: "100%",
                    fontSize: 15,
                  }}
                  variant="h5"
                >
                  {this.state.user.userDescipline}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                {this.state.userIds != "" ? (
                  <Switches
                    key={
                      "abc_1" +
                      this.state.user.userId +
                      this.state.user.userIsActive
                    }
                    isChecked={this.state.user.userIsActive == 1}
                    recordId={this.state.user.userId}
                    onChangeAction={this.onSwitchStatusChange}
                  />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            {this.state.userIds != "" && <Grid style={{ marginLeft: 20, marginTop: 20, marginBottom: 20}} xs={11}>
            <Autocomplete
                  multiple
                  fullWidth
                  id="userRolesArray"
                  disableCloseOnSelect
                  options={this.state.userRolesTypes}
                  onChange={(event, value) => this.onUserRolesChange(value)}
                  value={this.state.userRoles}
                  getOptionLabel={(option) => option.label}
                  renderOption={(option, { selected }) => (
                    <Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                        color="primary"
                      />
                      {option.label}
                    </Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="User Roles"
                      placeholder="Search and Select Roles"
                      error={!!this.state.userRolesError}
                      helperText={this.state.userRolesError}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    key={option}
                    label={option.label}
                    color="primary"
                    variant="outlined"
                    {...getTagProps({ index })}
                  />
                ))
              }
                />
            </Grid>}

            <Grid style={{ marginBottom: 50 }} xs={11}>
              {this.state.userDetail.map((data, index) => (
                <Features
                  key={"featureData" + index}
                  classes={classes}
                  data={data}
                  isOpen={false}
                  userId={this.state.userId}
                  userMenuItems={this.state.userMenuItems}
                  programmeGroupMenuItems={this.state.programmeGroupMenuItems}
                />
              ))}
            </Grid>
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={true}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading || this.state.rowEditMode}
          isDrawerOpen={this.props.isDrawerOpen}
        />
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}
export default withStyles(styles)(F70Form);
