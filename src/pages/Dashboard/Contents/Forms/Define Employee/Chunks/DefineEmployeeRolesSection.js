import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = () => ({
  sectionTitle: {
    color: "#1d5f98",
    fontWeight: 600,
    borderBottom: "1px solid #d2d2d2",
    marginBottom: 10,
    marginTop: 10,
    fontSize: 20,
    marginLeft: "-10px",
  },
});

const DefineEmployeeRolesSection = (props) => {
  const { classes } = props;

  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Define Employee Roles
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          multiple
          id="employeesRolesArray"
          getOptionLabel={(option) =>
            typeof option.Label === "string" ? option.Label : ""
          }
          fullWidth
          aria-autocomplete="none"
          options={props.state.employeesRolesData}
          loading={props.state.employeesRolesDataLoading}
          value={props.state.employeesRolesArray}
          renderInput={(params) => {
            const inputProps = params.inputProps;
            return (
              <TextField
                variant="outlined"
                error={!!props.state.employeesRolesArrayError}
                helperText={props.state.employeesRolesArrayError}
                inputProps={inputProps}
                label="Roles *"
                {...params}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          multiple
          id="employeesEntitiesArray"
          getOptionLabel={(option) =>
            typeof option.Label === "string" ? option.Label : ""
          }
          fullWidth
          aria-autocomplete="none"
          options={props.state.employeesEntitiesData}
          loading={props.state.employeesEntitiesDataLoading}
          value={props.state.employeesEntitiesArray}
          renderInput={(params) => {
            const inputProps = params.inputProps;
            return (
              <TextField
                variant="outlined"
                inputProps={inputProps}
                label="Entities *"
                error={!!props.state.employeesEntitiesArrayError}
                helperText={props.state.employeesEntitiesArrayError}
                {...params}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          multiple
          id="employeesDepartmentsArray"
          getOptionLabel={(option) =>
            typeof option.Label === "string" ? option.Label : ""
          }
          fullWidth
          aria-autocomplete="none"
          options={props.state.employeesDepartmentsData}
          loading={props.state.employeesDepartmentsDataLoading}
          value={props.state.employeesDepartmentsArray}
          renderInput={(params) => {
            const inputProps = params.inputProps;
            return (
              <TextField
                variant="outlined"
                inputProps={inputProps}
                label="Departments *"
                error={!!props.state.employeesDepartmentsArrayError}
                helperText={props.state.employeesDepartmentsArrayError}
                {...params}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          multiple
          id="employeesSubDepartmentsArray"
          getOptionLabel={(option) =>
            typeof option.Label === "string" ? option.Label : ""
          }
          fullWidth
          aria-autocomplete="none"
          options={props.state.employeesSubDepartmentsData}
          loading={props.state.employeesSubDepartmentsDataLoading}
          value={props.state.employeesSubDepartmentsArray}
          renderInput={(params) => {
            const inputProps = params.inputProps;
            return (
              <TextField
                variant="outlined"
                inputProps={inputProps}
                label="Sub Departments *"
                error={!!props.state.employeesSubDepartmentsArrayError}
                helperText={props.state.employeesSubDepartmentsArrayError}
                {...params}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          multiple
          id="employeesDesignationsArray"
          getOptionLabel={(option) =>
            typeof option.Label === "string" ? option.Label : ""
          }
          fullWidth
          aria-autocomplete="none"
          options={props.state.employeesDesignationsData}
          loading={props.state.employeesDesignationsDataLoading}
          value={props.state.employeesDesignationsArray}
          renderInput={(params) => {
            const inputProps = params.inputProps;
            return (
              <TextField
                variant="outlined"
                inputProps={inputProps}
                label="Designations *"
                error={!!props.state.employeesDesignationsArrayError}
                helperText={props.state.employeesDesignationsArrayError}
                {...params}
              />
            );
          }}
        />
      </Grid>
    </Fragment>
  );
};

DefineEmployeeRolesSection.propTypes = {
  classes: PropTypes.object,
  state: PropTypes.object,
  onHandleChange: PropTypes.func,
};

DefineEmployeeRolesSection.defaultProps = {
  classes: {},
  state: {},
  onHandleChange: (fn) => fn,
};

export default withStyles(styles)(DefineEmployeeRolesSection);
