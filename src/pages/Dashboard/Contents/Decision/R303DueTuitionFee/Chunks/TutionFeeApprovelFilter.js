import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { TextField, Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
// import { DatePicker } from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
    marginTop: 10,
    flexWrap: "wrap",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    marginRight: 10,
  },
  resize: {
    padding: 10,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    width: "15%",
    marginTop: 29,
  },
  label: {
    textAlign: "left",
    font: "bold 14px Lato",
    letterSpacing: 0,
    color: "#174A84",
    opacity: 1,
    marginTop: 5,
    marginBottom: 5,
    inlineSize: "max-content",
  },
  button: {
    textTransform: "capitalize",
    backgroundColor: "#174A84",
    fontSize: 14,
  },
}));

const TutionFeeApprovelFilter = (props) => {
  const classes = useStyles();
  const { values, onHandleChange, getDataByStatus, onClearFilters, isLoading } =
    props;

  console.log(values.coursesMenuItems);

  return (
    <Fragment>
      <div className={classes.container}>
        <div
          className={classes.item}
          style={{
            width: "15%",
          }}
        >
          <span className={classes.label}>Nucleus ID</span>
          <TextField
            placeholder="ID"
            variant="outlined"
            size="small"
            value={values.applicationId}
            name="applicationId"
            onChange={(e) => {
              onHandleChange(e);
            }}
          />
        </div>
        <div
          className={classes.item}
          style={{
            width: "18%",
          }}
        >
          <span className={classes.label}>Academic Session</span>
          <TextField
            id="academicSessionId"
            name="academicSessionId"
            variant="outlined"
            value={values.academicSessionId}
            size="small"
            onChange={(e) => {
              onHandleChange(e);
            }}
            select
          >
            {values.academicSessionMenuItems.map((dt, i) => (
              <MenuItem key={"academicSessionMenuItems" + dt.ID} value={dt.ID}>
                {dt.Label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "18%",
          }}
        >
          <span className={classes.label}>School</span>
          <TextField
            id="schoolId"
            name="schoolId"
            variant="outlined"
            onChange={(e) => {
              onHandleChange(e);
            }}
            size="small"
            value={values.schoolId}
            select
          >
            {values.schoolsMenuItems && values.schoolsMenuItems.length > 0 ? (
              values.schoolsMenuItems.map((dt, i) => (
                <MenuItem key={"schoolsMenuItems" + dt.id} value={dt.id}>
                  {dt.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"schoolsMenuItems"} disabled>
                No Data
              </MenuItem>
            )}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "18%",
          }}
        >
          <span className={classes.label}>Programme Group</span>
          <TextField
            id="programmeGroupId"
            name="programmeGroupId"
            variant="outlined"
            select
            onChange={(e) => {
              onHandleChange(e);
            }}
            size="small"
            value={values.programmeGroupId}
            disabled={!values.schoolId}
          >
            {values.programmeGroupsMenuItems &&
            values.programmeGroupsMenuItems.length > 0 ? (
              values.programmeGroupsMenuItems.map((dt, i) => (
                <MenuItem
                  key={"programmeGroupsMenuItems" + dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"programmeGroupsMenuItems"} disabled>
                No Data
              </MenuItem>
            )}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "18%",
          }}
        >
          <span className={classes.label}>Programme</span>
          <TextField
            id="programmeId"
            name="programmeId"
            variant="outlined"
            size="small"
            select
            onChange={(e) => {
              onHandleChange(e);
            }}
            value={values.programmeId}
            disabled={!values.programmeGroupId}
          >
            {values.programmeMenuItems &&
            values.programmeMenuItems.length > 0 ? (
              values.programmeMenuItems.map((dt, i) => (
                <MenuItem key={"programmeMenuItems" + dt.ID} value={dt.ID}>
                  {dt.Label}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"programmeMenuItems"} disabled>
                No Data
              </MenuItem>
            )}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "34%",
          }}
        >
          <span className={classes.label}>Courses</span>
          <Autocomplete
            fullWidth
            id="courseObject"
            value={values.courseObject || {}}
            onChange={(e, value) => {
              onHandleChange({
                target: { name: "courseObject", value },
              });
            }}
            options={values.coursesMenuItems || []}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and Select"
                size="small"
                // InputProps={{ classes: { input: classes.resize } }}
              />
            )}
          />
        </div>
        <div
          className={classes.item}
          style={{
            width: "18%",
          }}
        >
          <span className={classes.label}>Pathway</span>
          <TextField
            id="pathwayId"
            name="pathwayId"
            variant="outlined"
            onChange={(e) => {
              onHandleChange(e);
            }}
            size="small"
            value={values.pathwayId}
            disabled={!values.schoolId}
            select
          >
            {values.pathwayMenuItems && values.pathwayMenuItems.length > 0 ? (
              values.pathwayMenuItems.map((dt, i) => (
                <MenuItem key={"pathwayMenuItems" + dt.id} value={dt.id}>
                  {dt.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"pathwayMenuItems"} disabled>
                No Data
              </MenuItem>
            )}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "18%",
          }}
        >
          <span className={classes.label}>Student Status</span>
          <TextField
            id="isActive"
            name="isActive"
            variant="outlined"
            onChange={(e) => {
              onHandleChange(e);
            }}
            size="small"
            value={values.isActive}
            select
          >
            {values.isActiveMenuItems && values.isActiveMenuItems.length > 0 ? (
              values.isActiveMenuItems.map((dt, i) => (
                <MenuItem key={"isActiveMenuItems" + dt.id} value={dt.id}>
                  {dt.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"isActiveMenuItems"} disabled>
                No Data
              </MenuItem>
            )}
          </TextField>
        </div>
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={isLoading}
            onClick={() => getDataByStatus()}
          >
            {" "}
            {isLoading ? (
              <CircularProgress style={{ color: "white" }} size={24} />
            ) : (
              "Search"
            )}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            style={{
              marginLeft: 8,
            }}
            onClick={() => onClearFilters()}
          >
            Clear
          </Button>
        </div>
      </div>
      <Divider
        style={{
          backgroundColor: "rgb(58, 127, 187)",
          opacity: "0.3",
        }}
      />
    </Fragment>
  );
};

TutionFeeApprovelFilter.defaultProps = {
  onHandleChange: (fn) => fn,
  getDataByStatus: (fn) => fn,
  values: {},
  onClearFilters: (fn) => fn,
  handleDateChange: (fn) => fn,
  getDataFilters: (fn) => fn,
  isLoading: false,
};

TutionFeeApprovelFilter.propTypes = {
  onHandleChange: PropTypes.func,
  values: PropTypes.object,
  getDataByStatus: PropTypes.func,
  onClearFilters: PropTypes.func,
  handleDateChange: PropTypes.func,
  getDataFilters: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default TutionFeeApprovelFilter;
