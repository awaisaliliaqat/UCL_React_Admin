import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { TextField, Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
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

const RegistrationFeeApprovelFilter = (props) => {
  const classes = useStyles();
  const {
    values,
    onHandleChange,
    getDataByStatus,
    onClearFilters,
    handleDateChange,
    isLoading,
  } = props;

  return (
    <Fragment>
      <div className={classes.container}>
        <div
          className={classes.item}
          style={{
            width: "20%",
          }}
        >
          <span className={classes.label}>Status</span>

          <TextField
            placeholder="Status"
            variant="outlined"
            name="applicationStatusId"
            id="applicationStatusId"
            InputProps={{ classes: { input: classes.resize } }}
            value={values.applicationStatusId}
            onChange={(e) => {
              onHandleChange(e);
            }}
            select
          >
            <MenuItem value={0}>All</MenuItem>
            {values.statusTypeData.map((item) => (
              <MenuItem key={item.ID} value={item.ID}>
                {item.Label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "20%",
          }}
        >
          <span className={classes.label}>Academic Session</span>
          <TextField
            id="academicSessionId"
            name="academicSessionId"
            variant="outlined"
            value={values.academicSessionId}
            InputProps={{ classes: { input: classes.resize } }}
            onChange={(e) => {
              onHandleChange(e);
            }}
            //   error={!!values.academicSessionIdError}
            //   helperText={values.academicSessionIdError}
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
            width: "8%",
          }}
        >
          <span className={classes.label}>ID</span>
          <TextField
            placeholder="ID"
            variant="outlined"
            InputProps={{ classes: { input: classes.resize } }}
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
            width: "20%",
          }}
        >
          <span className={classes.label}>Name</span>
          <TextField
            placeholder="Name"
            variant="outlined"
            InputProps={{ classes: { input: classes.resize } }}
            value={values.studentName}
            name="studentName"
            onChange={(e) => {
              onHandleChange(e);
            }}
          />
        </div>
        <div
          className={classes.item}
          style={{
            width: "20%",
          }}
        >
          <span className={classes.label}>Reference No.</span>
          <TextField
            placeholder="Reference No."
            variant="outlined"
            InputProps={{ classes: { input: classes.resize } }}
            value={values.referenceNo}
            name="referenceNo"
            onChange={(e) => {
              onHandleChange(e);
            }}
          />
        </div>
        <div
          className={classes.item}
          style={{
            width: "12%",
          }}
        >
          <span className={classes.label}>Gender</span>
          <TextField
            placeholder="Gender"
            variant="outlined"
            select
            InputProps={{ classes: { input: classes.resize } }}
            value={values.genderId}
            name="genderId"
            onChange={(e) => {
              onHandleChange(e);
            }}
          >
            <MenuItem value={0}>All</MenuItem>
            {values.genderData.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "20%",
          }}
        >
          <span className={classes.label}>Programme</span>
          <TextField
            placeholder="Programme"
            variant="outlined"
            select
            InputProps={{ classes: { input: classes.resize } }}
            value={values.degreeId}
            name="degreeId"
            onChange={(e) => {
              onHandleChange(e);
            }}
          >
            <MenuItem value={0}>All</MenuItem>
            {values.degreeData.map((item, index) => {
              return (
                <MenuItem key={index} disabled={!item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
        <div
          className={classes.item}
          style={{
            width: "20%",
          }}
        >
          <span className={classes.label}>Date</span>
          <DatePicker
            autoOk
            invalidDateMessage=""
            placeholder="Payment Date"
            disableFuture
            variant="inline"
            inputVariant="outlined"
            format="dd-MMM-yyyy"
            fullWidth
            value={values.eventDate}
            InputProps={{
              classes: { input: classes.resize },
            }}
            onChange={(event) => {
              handleDateChange(event);
            }}
          />
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

RegistrationFeeApprovelFilter.defaultProps = {
  onHandleChange: (fn) => fn,
  getDataByStatus: (fn) => fn,
  values: {},
  onClearFilters: (fn) => fn,
  handleDateChange: (fn) => fn,
  getDataFilters: (fn) => fn,
  isLoading: false,
};

RegistrationFeeApprovelFilter.propTypes = {
  onHandleChange: PropTypes.func,
  values: PropTypes.object,
  getDataByStatus: PropTypes.func,
  onClearFilters: PropTypes.func,
  handleDateChange: PropTypes.func,
  getDataFilters: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default RegistrationFeeApprovelFilter;
