import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Grid, Typography, TextField, Checkbox, Chip, Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

/* eslint-disable no-use-before-define */

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const styles = () => ({
	sectionTitle: {
		color: "#1d5f98",
		fontWeight: 600,
		fontSize: 20
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%"
	}
});

const DefineEmployeeRolesSection = (props) => {
	
	const { classes } = props;

	return (
		<Fragment>
			<Grid item xs={12}>
				<Typography variant="h5" className={classes.sectionTitle}>
					Define Employee Roles
				</Typography>
				<Divider 
					className={classes.divider}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<Autocomplete
					multiple
					id="employeesRolesArray"
					getOptionLabel={(option) =>
						typeof option.label === "string" ? option.label : ""
					}
					getOptionSelected={(option, value) => option.id === value.id}
					fullWidth
					disabled={!!props.state.recordId}
					aria-autocomplete="none"
					options={props.state.employeesRolesData}
					loading={props.state.employeesRolesDataLoading}
					value={props.state.employeesRolesArray}
					onChange={(e, value) =>
						props.onHandleChange({
							target: { name: "employeesRolesArray", value },
						})
					}
					disableCloseOnSelect
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
					renderOption={(option, { selected }) => (
						<React.Fragment>
							<Checkbox
								icon={icon}
								checkedIcon={checkedIcon}
								color="primary"
								style={{ marginRight: 8 }}
								checked={selected}
							/>
							{option.label}
						</React.Fragment>
					)}
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
			<Grid item xs={12} sm={6}>
				<Autocomplete
					multiple
					id="employeesEntitiesArray"
					getOptionLabel={(option) =>
						typeof option.label === "string" ? option.label : ""
					}
					limitTags={3}
					fullWidth
					disabled={!!props.state.recordId}
					getOptionSelected={(option, value) => option.id === value.id}
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
					aria-autocomplete="none"
					options={props.state.employeesEntitiesData}
					loading={props.state.employeesEntitiesDataLoading}
					value={props.state.employeesEntitiesArray}
					onChange={(e, value) =>
						props.onHandleChange({
							target: { name: "employeesEntitiesArray", value },
						})
					}
					disableCloseOnSelect
					renderOption={(option, { selected }) => (
						<React.Fragment>
							<Checkbox
								icon={icon}
								checkedIcon={checkedIcon}
								style={{ marginRight: 8 }}
								color="primary"
								checked={selected}
							/>
							{option.label}
						</React.Fragment>
					)}
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
			<Grid item xs={12} sm={6}>
				<Autocomplete
					multiple
					limitTags={3}
					id="employeesDepartmentsArray"
					getOptionLabel={(option) =>
						typeof option.label === "string" ? option.label : ""
					}
					fullWidth
					disabled={!!props.state.recordId}
					aria-autocomplete="none"
					options={props.state.employeesDepartmentsData}
					loading={props.state.employeesDepartmentsDataLoading}
					value={props.state.employeesDepartmentsArray}
					getOptionSelected={(option, value) => option.id === value.id}
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
					onChange={(e, value) =>
						props.onHandleChange({
							target: { name: "employeesDepartmentsArray", value },
						})
					}
					disableCloseOnSelect
					renderOption={(option, { selected }) => (
						<React.Fragment>
							<Checkbox
								icon={icon}
								checkedIcon={checkedIcon}
								style={{ marginRight: 8 }}
								color="primary"
								checked={selected}
							/>
							{option.label}
						</React.Fragment>
					)}
					renderInput={(params) => {
						const inputProps = params.inputProps;
						return (
							<TextField
								variant="outlined"
								inputProps={inputProps}
								label="Departments"
								error={!!props.state.employeesDepartmentsArrayError}
								helperText={props.state.employeesDepartmentsArrayError}
								{...params}
							/>
						);
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<Autocomplete
					multiple
					limitTags={3}
					id="employeesSubDepartmentsArray"
					getOptionLabel={(option) =>
						typeof option.label === "string" ? option.label : ""
					}
					fullWidth
					disabled={!!props.state.recordId}
					aria-autocomplete="none"
					options={props.state.employeesSubDepartmentsData}
					loading={props.state.employeesSubDepartmentsDataLoading}
					value={props.state.employeesSubDepartmentsArray}
					getOptionSelected={(option, value) => option.id === value.id}
					onChange={(e, value) =>
						props.onHandleChange({
							target: { name: "employeesSubDepartmentsArray", value },
						})
					}
					disableCloseOnSelect
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
					renderOption={(option, { selected }) => (
						<React.Fragment>
							<Checkbox
								icon={icon}
								checkedIcon={checkedIcon}
								style={{ marginRight: 8 }}
								color="primary"
								checked={selected}
							/>
							{option.label}
						</React.Fragment>
					)}
					renderInput={(params) => {
						const inputProps = params.inputProps;
						return (
							<TextField
								variant="outlined"
								inputProps={inputProps}
								label="Sub Departments"
								error={!!props.state.employeesSubDepartmentsArrayError}
								helperText={props.state.employeesSubDepartmentsArrayError}
								{...params}
							/>
						);
					}}
				/>
			</Grid>

			<Grid item xs={12} sm={6}>
				<Autocomplete
					multiple
					limitTags={3}
					id="employeesDesignationsArray"
					getOptionLabel={(option) =>
						typeof option.label === "string" ? option.label : ""
					}
					fullWidth
					aria-autocomplete="none"
					disableCloseOnSelect
					disabled={!!props.state.recordId}
					options={props.state.employeesDesignationsData}
					loading={props.state.employeesDesignationsDataLoading}
					value={props.state.employeesDesignationsArray}
					getOptionSelected={(option, value) => option.id === value.id}
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
					onChange={(e, value) =>
						props.onHandleChange({
							target: { name: "employeesDesignationsArray", value },
						})
					}
					renderOption={(option, { selected }) => (
						<React.Fragment>
							<Checkbox
								icon={icon}
								checkedIcon={checkedIcon}
								style={{ marginRight: 8 }}
								color="primary"
								checked={selected}
							/>
							{option.label}
						</React.Fragment>
					)}
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
