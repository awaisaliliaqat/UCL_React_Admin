import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { Button, TextField,MenuItem,Grid } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

const AttendanceFilter = (props) => {
  const classes = useStyles();
  const {
    values,
    handleDateChange,
    onHandleChange,
    getDataByStatus,
    onClearFilters,
    onAutoCompleteChange,
    isLoading,
    
  } = props;

  return (
    <Fragment>
      <div className={classes.container}>
        <div
          className={classes.item}
          style={{
            width: "30%",
          }}
        >
          <span className={classes.label}>Teachers *</span>
          <Autocomplete
            id="teacherId"
            getOptionLabel={(option) => option.label}
            fullWidth
            value={values.teacherObject}
            onChange={onAutoCompleteChange}
            size="small"
            options={values.teacherData}
            renderInput={(params) => (
              <TextField
                error={values.teacherObjectError}
                variant="outlined"
                placeholder="Teachers"
                {...params}
              />
            )}
          />
        </div>
        <div
          className={classes.item}
          style={{
            width: "30%",
          }}
        >
           <span className={classes.label}>Month *</span>
              <TextField
                id="monthId"
                name="monthId"
                variant="outlined"
                placeholder="Month"
                // label="Month"
                size="small"
                onChange={onHandleChange}
                value={values.monthId}
                required
                fullWidth
                select
                // disabled={!values.sectionId}
              >
                {values.monthsMenuItems && !values.isLoading ? 
                  values.monthsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"monthsMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justify="center">
                      <CircularProgress />
                    </Grid>
                }
              </TextField> 
           
        </div> 

        {/* <div
          className={classes.item}
          style={{
            width: "30%",
          }}
        >
           <span className={classes.label}>Courses *</span>
              <Autocomplete
                fullWidth
                id="courseId"
                size="small"
                options={values.coursesMenuItems}
                value={values.courseId}
                onChange={(event, value) => this.handleSetCourse(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    // label="Courses"
                    placeholder="Search and Select"
                    required
                    error={!!values.courseIdError}
                    helperText={values.courseIdError ? values.courseIdError : "" }
                  />
                )}
              />
           </div> */}
           <div
          className={classes.item}
          style={{
            width: "30%",
          }}
        >
           <span className={classes.label}>Sections *</span>
              <Autocomplete
                fullWidth
                id="sectionId"
                size="small"
                disabled={!values.courseId}
                options={values.sectionsMenuItems}
                value={values.sectionId}
                onChange={(event, value) => this.handleSetSection(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    // label="Sections"
                    placeholder="Search and Select"
                    required
                    error={!!values.sectionIdError}
                    helperText={values.sectionIdError ? values.sectionIdError : "" }
                  />
                )}
              />
          </div>
        

        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={isLoading || !values.teacherId}
            onClick={() => getDataByStatus(values.teacherId)}
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

AttendanceFilter.defaultProps = {
  onHandleChange: (fn) => fn,
  getDataByStatus: (fn) => fn,
  onAutoCompleteChange: (fn) => fn,
  values: {},
  onClearFilters: (fn) => fn,
  handleDateChange: (fn) => fn,
  getDataFilters: (fn) => fn,
  isLoading: false,
};

AttendanceFilter.propTypes = {
  onHandleChange: PropTypes.func,
  onAutoCompleteChange: PropTypes.func,
  values: PropTypes.object,
  getDataByStatus: PropTypes.func,
  onClearFilters: PropTypes.func,
  handleDateChange: PropTypes.func,
  getDataFilters: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default AttendanceFilter;
