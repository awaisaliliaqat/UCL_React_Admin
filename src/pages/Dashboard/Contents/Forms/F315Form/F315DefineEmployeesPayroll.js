import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";
import { numberExp, numberWithDecimalExp, } from "../../../../../utils/regularExpression";
import PropTypes from "prop-types";
import { IsEmpty } from "../../../../../utils/helper";

const styles = (theme) => ({
	root: {
		paddingBottom: theme.spacing(8),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
});

class F315DefineEmployeesPayroll extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recordId: this.props.match.params.recordId,
			isLoading: false,
			isReload: false,
			showPass: false,

			employeeData: [],
			employeeDataLoading: false,
			employeeObject: null,
			employeeObjectError: "",

			payrollMonths: "",
			payrollMonthsError: "",

			perMonthSalary: "",
			perMonthSalaryError: "",

			perHourRate: "",
			perHourRateError: "",

			payrollComments: "",
			payrollCommentsError: "",
			effectiveDate: new Date(),

			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
		};
	}

	componentDidMount() {
		this.getEmployeesData();
		if (this.state.recordId != 0) {
			this.loadData(this.state.recordId);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.match.params.recordId != nextProps.match.params.recordId) {
			if (nextProps.match.params.recordId != 0) {
				this.loadData(nextProps.match.params.recordId);
				this.setState({
					recordId: nextProps.match.params.recordId,
				});
			} else {
				window.location.reload();
			}
		}
	}

	handleSnackbar = (open, msg, severity) => {
		this.setState({
			isOpenSnackbar: open,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	loadData = async (index) => {
		const data = new FormData();
		data.append("id", index);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C316CommonUsersEmployeesPayrollView`;
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
						if (data.length > 0) {
							let myDataObject = data[0] || {};
							this.setState({
								employeeObject: {
									id: myDataObject["userId"],
									label: myDataObject["userLabel"],
								},
								employeeObjectError: "",

								payrollMonths: myDataObject["payrollMonths"],
								payrollMonthsError: "",

								perMonthSalary: myDataObject["perMonthSalary"],
								perMonthSalaryError: "",

								perHourRate: myDataObject["perHourRate"],
								perHourRateError: "",

								payrollComments: myDataObject["comments"],
								payrollCommentsError: "",
							});
						}
					} else {
						this.handleSnackbar(
							true,
							json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
							"error"
						);
					}
					console.log(json);
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleSnackbar(
							true,
							"Failed to Load Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;

		let regex = "";
		switch (name) {
			case "payrollMonths":
				regex = new RegExp(numberExp);
				if (value && !regex.test(value)) {
					return;
				}
				break;
			case "perMonthSalary":
			case "perHourRate":
				regex = new RegExp(numberWithDecimalExp);
				if (value && !regex.test(value)) {
					return;
				}
				break;
			default:
				break;
		}

		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	isFormValid = () => {
		let isValid = true;
		let {
			employeeObjectError,
			payrollMonthsError,
			perMonthSalaryError,
			perHourRateError,
			payrollCommentsError,
		} = this.state;

		if (IsEmpty(this.state.employeeObject)) {
			employeeObjectError = "Please select employee.";
			isValid = false;
		} else {
			employeeObjectError = "";
		}

		if (!this.state.payrollMonths) {
			isValid = false;
			payrollMonthsError = "Please enter number of months.";
		} else {
			payrollMonthsError = "";
		}

		if (!this.state.perMonthSalary && !this.state.perHourRate) {
			isValid = false;
			perMonthSalaryError =
				"Please enter Per Month Salary or Enter in Per Hour Rate field.";
			// perHourRateError =
			//   "Please enter Per Hour Rate  or Enter in Per Month Salary field.";
		} else if (this.state.perMonthSalary && !this.state.perHourRate) {
			perMonthSalaryError = "";
			perHourRateError = "";
		} else if (!this.state.perMonthSalary && this.state.perHourRate) {
			perMonthSalaryError = "";
			perHourRateError = "";
		} else {
			perMonthSalaryError = "";
			perHourRateError = "";
		}

		if (!this.state.payrollComments) {
			isValid = false;
			payrollCommentsError = "Please enter comments.";
		} else {
			payrollCommentsError = "";
		}

		this.setState({
			employeeObjectError,
			payrollMonthsError,
			perMonthSalaryError,
			perHourRateError,
			payrollCommentsError,
		});
		return isValid;
	};

	clickOnFormSubmit = () => {
		if (this.isFormValid()) {
			document.getElementById("btn-submit").click();
		}
	};

	clearAllData = () => {
		this.setState({
			employeeDataLoading: false,
			employeeObject: null,
			employeeObjectError: "",

			payrollMonths: "",
			payrollMonthsError: "",

			perMonthSalary: "",
			perMonthSalaryError: "",

			perHourRate: "",
			perHourRateError: "",

			payrollComments: "",
			payrollCommentsError: "",
		});
	};

	onFormSubmit = async (e) => {
		e.preventDefault();
		// const dateStr = this.state.fromDate;
		// const date = new Date(dateStr);
		// const formattedDate = date.toISOString().split("T")[0];
		const data = new FormData(e.target);
		data.append("userId", this.state.employeeObject.id);
		// data.append("effectiveDate", Object(formattedDate));
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C315CommonUsersEmployeesPayrollSave`;
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
						this.handleSnackbar(true, json.USER_MESSAGE, "success");
						if (this.state.recordId == 0) {
							this.clearAllData();
						} else {
							setTimeout(() => {
								window.location.replace("#/dashboard/R316Reports");
							}, 1000);
						}
					} else {
						this.handleSnackbar(
							true,
							json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
						this.handleSnackbar(
							true,
							"Failed to Save ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	onHandleChangeDate = (event) => {
		const { name, value } = event.target;
		// const dateStr = value;
		// const date = new Date(dateStr);
		// const formattedDate = date.toISOString().split("T")[0];

		// if (name === "fromDate") {
		//   this.setState({
		//     fromDateToSend: formattedDate,
		//   });
		// } else {
		//   this.setState({
		//     toDateToSend: formattedDate,
		//   });
		// }

		this.setState({
			[name]: value,
		});
	};

	getEmployeesData = async () => {
		this.setState({ employeeDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C315CommonUsersView`;
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
						let data = json.DATA || [];
						this.setState({
							employeeData: data
						});
					} else {
						this.handleSnackbar(
							true,
							json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
							"error"
						);
					}
					console.log(json);
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleSnackbar(
							true,
							"Failed to Get Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeeDataLoading: false });
	};

	viewReport = () => {
		window.location = "#/dashboard/R316Reports";
	};

	render() {
		const { classes } = this.props;

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<form
					noValidate
					autoComplete="off"
					id="myForm"
					onSubmit={this.onFormSubmit}
				>
					<TextField type="hidden" name="id" value={this.state.recordId} />
					<Grid
						container
						component="main"
						className={classes.root}
						spacing={2}
					>
						<Grid item xs={12} >
							<Typography
								style={{
									color: "#1d5f98",
									fontWeight: 600,
									fontSize: 20,
								}}
								variant="h5"
							>
								Define Employees Payroll
							</Typography>
							<Divider
								style={{
									backgroundColor: "rgb(58, 127, 187)",
									opacity: "0.3",
								}}
							/>
						</Grid>

						<Grid item xs={6}>
							<Autocomplete
								id="employeeObject"
								getOptionLabel={(option) =>
									typeof option.label == "string" ? `${option.id} - ${option.label}` : ""
								}
								getOptionSelected={(option, value) => option.id === value.id}
								fullWidth
								aria-autocomplete="none"
								options={this.state.employeeData}
								loading={this.state.employeeDataLoading}
								value={this.state.employeeObject}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employeeObject", value },
									})
								}
								renderTags={(tagValue, getTagProps) =>
									tagValue.map((option, index) => (
										<Chip
											key={"tagValue-" + option.id}
											label={`${option.id} - ${option.label}`}
											color="primary"
											variant="outlined"
											{...getTagProps({ index })}
										/>
									))
								}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (
										<TextField
											variant="outlined"
											error={!!this.state.employeeObjectError}
											helperText={this.state.employeeObjectError}
											inputProps={inputProps}
											label="Employee *"
											{...params}
										/>
									);
								}}
							/>
						</Grid>
						<Grid item xs={6}>
							<DatePicker
								autoOk
								id="effectiveDate"
								name="effectiveDate"
								label="Effective Date"
								invalidDateMessage=""
								placeholder=""
								variant="inline"
								inputVariant="outlined"
								format="yyyy-MM-dd"
								fullWidth
								required
								value={this.state.effectiveDate}
								onChange={(date) =>
									this.onHandleChangeDate({
										target: { name: "effectiveDate", value: date },
									})
								}
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								id="payrollMonths"
								name="payrollMonths"
								label="No. of Months"
								required
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.payrollMonths}
								helperText={this.state.payrollMonthsError}
								error={!!this.state.payrollMonthsError}
								inputProps={{
									maxLength: 11,
								}}
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								id="perMonthSalary"
								name="perMonthSalary"
								label="Per Month Salary"
								required
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.perMonthSalary}
								helperText={this.state.perMonthSalaryError}
								error={!!this.state.perMonthSalaryError}
								inputProps={{
									maxLength: 11,
								}}
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								id="perHourRate"
								name="perHourRate"
								label="Per Hour Rate"
								required
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.perHourRate}
								helperText={this.state.perHourRateError}
								error={!!this.state.perHourRateError}
								inputProps={{
									maxLength: 11,
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								multiline
								minRows={3}
								id="payrollComments"
								name="payrollComments"
								label="Comments"
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.payrollComments}
								helperText={this.state.payrollCommentsError}
								error={!!this.state.payrollCommentsError}
							/>
						</Grid>
					</Grid>
					<input type="submit" style={{ display: "none" }} id="btn-submit" />
				</form>
				<BottomBar
					leftButtonText="View"
					leftButtonHide={false}
					bottomLeftButtonAction={() => this.viewReport()}
					right_button_text="Save"
					bottomRightButtonAction={() => this.clickOnFormSubmit()}
					loading={this.state.isLoading}
					isDrawerOpen={this.props.isDrawerOpen}
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

F315DefineEmployeesPayroll.propTypes = {
	isDrawerOpen: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	match: PropTypes.object,
};

F315DefineEmployeesPayroll.defaultProps = {
	isDrawerOpen: true,
	match: {
		params: {
			recordId: 0,
		},
	},
};

export default withStyles(styles)(F315DefineEmployeesPayroll);
