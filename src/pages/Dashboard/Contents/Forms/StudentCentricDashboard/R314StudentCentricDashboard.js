import React, { Component, Fragment } from "react";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import {
  Divider,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  mainContainer: {
    padding: 20,
  },
  pageTitle: {
    color: "#1d5f98",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  titleDivider: {
    backgroundColor: "rgb(58, 127, 187)",
    opacity: "0.3",
  },
  imageContainer: {
    height: 120,
    width: 120,
    border: "1px solid #ccc3c3",
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 17,
    marginRight: 15,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  "card:hover": {
    color: "blue",
  },
});

class R314StudentCentricDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      recordId: 0,
      data: {},
    };
  }

  componentDidMount() {
    const { id = 0 } = this.props.match.params;
    if (id != 0) {
      this.loadStudentDetailsById(id);
      this.setState({
        recordId: id,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const currentId = this.props.match.params.id || 0;
    const nextId = nextProps.match.params.id || 0;
    if (currentId != nextId) {
      if (nextId != 0) {
        this.loadStudentDetailsById(nextId);
        this.setState({
          recordId: nextId,
        });
      } else {
        window.location.reload();
      }
    }
  }

  loadStudentDetailsById = async (id) => {
    this.setState({ isLoading: true });

    const myId = id || this.state.recordId || 0;

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C314CommonStudentsProfileView?studentId=${myId}`;
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
            let jsonArray = json.DATA || [];
            let studentData = {};
            if (jsonArray.length > 0) {
              studentData = jsonArray[0] || {};
            }
            this.setState({
              data: studentData,
            });
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <div className={classes.mainContainer}>
          <div>
            <Typography className={classes.pageTitle} variant="h5">
              {"Student-Centric Dashboard"}
            </Typography>
          </div>
          <Divider className={classes.titleDivider} />
          <br />
          <center>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div
                  className={classes.imageContainer}
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${this.state.data.imageName})`,
                  }}
                />
              </Grid>
              <Grid
                style={{
                  marginBottom: 10,
                }}
                item
                xs={12}
              >
                <Typography
                  style={{
                    textTransform: "capitalize",
                  }}
                  component="h5"
                  variant="h5"
                >
                  {`${this.state.data.displayName || "N/A"}`}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {this.state.data.genderLabel || "N/A"},{" "}
                  {this.state.data.email || "N/A"}
                </Typography>
              </Grid>
              {this.state.data?.featuresData &&
              this.state.data?.featuresData?.length > 0 ? (
                <Fragment>
                  {this.state.data?.featuresData?.map((item) => {
                    return (
                      <Grid key={item} item xs={2}>
                        <Card
                          onClick={() => {
                            if (item.action) {
                              window.open(item.action, "_blank", "noreferrer");
                            }
                          }}
                          style={{
                            height: 130,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1">
                              {item.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Fragment>
              ) : (
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginTop: 20,
                      color: "gray",
                      opacity: 0.8,
                      fontSize: 14,
                    }}
                  >
                    Student&apos;s related Features are not assigned.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </center>
        </div>

        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
        />
      </Fragment>
    );
  }
}

R314StudentCentricDashboard.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

R314StudentCentricDashboard.defaultProps = {
  classes: {},
  match: {
    params: {
      id: 0,
    },
  },
  setDrawerOpen: (fn) => fn,
};

export default withStyles(styles)(R314StudentCentricDashboard);
