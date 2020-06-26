import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Background from "../../assets/Images/background.jpg";
import Logo from "../../assets/Images/logo.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavBar from "../../components/NavBar/NavBar";
import { DatePicker } from "@material-ui/pickers";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  alphabetExp,
  numberExp,
  emailExp,
} from "../../utils/regularExpression";
import Copyright from "../../components/Copyrights/copyrights";
const styles = (theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(2, 2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  instructions: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 12,
    padding: 1,
    color: "gray",
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  }
});

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        firstName: "",
        lastName: "",
        dob: null,
        genderId: "",
        mobileNo: "",
        email: "",
        degreeId: "",
      },
      formErrors: {
        firstName: "",
        lastName: "",
        dob: "",
        genderId: "",
        mobileNo: "",
        email: "",
        degreeId: "",
      },

      isLoading: false,
      genderData: [],
      degreeData: [],
      successDialog: false,
    };
  }

  handleSuccessDialog = () => {
    this.setState({
      successDialog: !this.state.successDialog,
    });
  }
  componentDidMount() {
    this.getGenderData();
    this.getDegreesData();
  }

  getGenderData = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonGendersView`;
    await fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          this.setState({
            genderData: json.DATA,
          });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getDegreesData = async () => {
    let data = [];
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonAcademicsDegreeProgramsView`;
    await fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          const resData = json.DATA || [];
          if (resData.length > 0) {
            for (let i = 0; i < resData.length; i++) {
              if (!isEmpty(resData[i])) {
                data.push({ id: "", label: resData[i].department });
              }
              for (let j = 0; j < resData[i].degrees.length; j++) {
                if (!isEmpty(resData[i].degrees[j])) {
                  data.push({
                    id: resData[i].degrees[j].id,
                    label: resData[i].degrees[j].label,
                  });
                }
              }
            }
          }
        },
        (error) => {
          console.log("myData", error);
        }
      );
    this.setState({
      degreeData: data,
    });
  };

  resetForm = () => {
    this.setState({
      form: {
        firstName: "",
        lastName: "",
        dob: new Date("2000-01-01"),
        genderId: "",
        mobileNo: "",
        email: "",
        degreeId: "",
      },
      formErrors: {
        firstName: "",
        lastName: "",
        dob: "",
        genderId: "",
        mobileNo: "",
        email: "",
        degreeId: "",
      },
      isLoading: false,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const { form, formErrors } = this.state;
    let regex = "";
    switch (name) {
      case "firstName":
      case "lastName":
        regex = new RegExp(alphabetExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      case "mobileNo":
        regex = new RegExp(numberExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      default:
        break;
    }
    form[name] = value;
    formErrors[name] = "";
    this.setState({
      form,
      formErrors,
    });
  };

  handleDateChange = (date) => {
    const { form, formErrors } = this.state;
    form["dob"] = date;
    formErrors["dob"] = "";
    this.setState({
      form,
      formErrors,
    });
  };

  isFormValid = () => {
    const { form, formErrors } = this.state;
    let isValid = true;
    if (!form.firstName.trim()) {
      formErrors.firstName = "First Name is Required";
      isValid = false;
    } else {
      formErrors.firstName = "";
    }
    if (!form.lastName.trim()) {
      formErrors.lastName = "Last Name is Required";
      isValid = false;
    } else {
      formErrors.lastName = "";
    }
    if (!form.dob) {
      formErrors.dob = "Date of Birth is Required";
      isValid = false;
    } else {
      formErrors.dob = "";
    }
    if (!form.genderId) {
      formErrors.genderId = "Please select gender.";
      isValid = false;
    } else {
      formErrors.genderId = "";
    }
    if (!form.mobileNo) {
      formErrors.mobileNo = "Mobile Number is required.";
      isValid = false;
    } else {
      if (!form.mobileNo.startsWith("03") || form.mobileNo.length < 11) {
        formErrors.mobileNo =
          "Please enter valid mobile number e.g 03001234567";
        isValid = false;
      }
    }
    if (!form.email) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else {
      const regex = new RegExp(emailExp);
      if (!regex.test(form.email)) {
        formErrors.email =
          "Please enter valid email address e.g user@domain.com";
        isValid = false;
      }
    }
    if (!form.degreeId) {
      formErrors.degreeId = "Please select a degree for applying.";
      isValid = false;
    } else {
      formErrors.degreeId = "";
    }

    this.setState({
      formErrors,
    });

    return isValid;
  };

  handleSubmitButtonClick = () => {
    const isValid = this.isFormValid();
    if (isValid) {
      document.getElementById("submit-button").click();
    }
    return;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonUsersSave`;
    await fetch(url, { method: "POST", body: data })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (data) => {
          if (data.CODE === 1) {
            //alert("Your login email and password send to your given email.");
            this.handleSuccessDialog();
            this.resetForm();
            //window.location.replace("#/login");
          } else {
            if (data.SYSTEM_MESSAGE != null && data.SYSTEM_MESSAGE.indexOf('email_UNIQUE') > -1) {
              alert("The email address you have entered is already registered.");
            } else {
              alert("Operation Failed !\n" + data.SYSTEM_MESSAGE);

            }
          }
        },
        (error) => {
          alert(error);
        }
      );

    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { form, formErrors, isLoading, genderData, degreeData } = this.state;
    return (
      <Fragment>
        <Dialog
          open={this.state.successDialog}
          onClose={this.handleSuccessDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Success"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Thank you for registering. Your online admission account has been created successfully.
              You can now login to your account by entering the username and password sent to your given email address.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSuccessDialog} color="primary">
              Close
            </Button>
            <Button onClick={() => window.location.replace("#/login")} color="primary" >
              Login
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container component="main" className={classes.root}>
          <NavBar logo={Logo} title="University College London" />
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            style={{ marginTop: 55 }}
          >
            <div className={classes.container}>
              <div className={classes.paper}>
                <Typography style={{ marginTop: 10 }} component="h1" variant="h5">
                  Applicant Registration
              </Typography>
                <Typography
                  className={classes.instructions}
                  component="h5"
                  variant="body2"
                >
                  Welcome to UCL Admissions<br></br>
                  {
                    //To register for an Online Admission Application Account,<br/>
                  }
                  <i>Please enter the information requested below to register</i>
                </Typography>
                <form
                  noValidate
                  onSubmit={this.handleSubmit}
                  className={classes.form}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        onChange={this.handleChange}
                        value={form.firstName}
                        error={!!formErrors.firstName}
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={this.handleChange}
                        value={form.lastName}
                        error={!!formErrors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        autoOk
                        invalidDateMessage=""
                        views={["year", "month", "date"]}
                        openTo={"year"}
                        disableFuture
                        variant="inline"
                        inputVariant="outlined"
                        label="Date of Birth"
                        format="dd-MMM-yyyy"
                        fullWidth
                        defaultValue={form.dob}
                        InputProps={{
                          endAdornment: (
                            <IconButton>
                              <InsertInvitationIcon />
                            </IconButton>
                          ),
                        }}
                        onChange={this.handleDateChange}
                        value={form.dob}
                        error={!!formErrors.dob}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="genderId"
                        name="genderId"
                        required
                        fullWidth
                        select
                        label="Gender"
                        variant="outlined"
                        onChange={this.handleChange}
                        value={form.genderId}
                        error={!!formErrors.genderId}
                      >
                        {genderData.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="mobileNo"
                        label="Mobile Number"
                        id="mobileNo"
                        onChange={this.handleChange}
                        inputProps={{
                          maxLength: 11,
                        }}
                        value={form.mobileNo}
                        error={!!formErrors.mobileNo}
                        helperText={form.mobileNo && formErrors.mobileNo}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        id="email"
                        onChange={this.handleChange}
                        value={form.email}
                        error={!!formErrors.email}
                        helperText={form.email && formErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="degreeId"
                        name="degreeId"
                        required
                        fullWidth
                        select
                        label="Applying For"
                        variant="outlined"
                        onChange={this.handleChange}
                        value={form.degreeId}
                        error={!!formErrors.degreeId}
                      >
                        {degreeData.map((item, index) => {
                          return (
                            <MenuItem
                              key={index}
                              disabled={!item.id}
                              value={item.id}
                            >
                              {item.label}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <input
                      id="submit-button"
                      type="submit"
                      style={{ display: "none" }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      style={{ backgroundColor: `${isLoading ? "#6272ce" : ""}` }}
                      onClick={this.handleSubmitButtonClick}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <CircularProgress style={{ color: "white" }} size={24} />
                      ) : (
                          "Register"
                        )}
                    </Button>
                    <Grid container justify="center">
                      <Grid item>
                        <Link to="/ucl/login" variant="body2">
                          {"Already have an account."}
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </div>
              <div style={{ paddingBottom: 25 }}>
                <Copyright />
              </div>
            </div>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
