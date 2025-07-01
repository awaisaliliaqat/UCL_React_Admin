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
	divider: { 
		backgroundColor: "rgb(58, 127, 187)", 
		opacity: "0.3" 
	},
});

class F360Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recordId: this.props.match.params.recordId,
			isLoading: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
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
			effectiveDateError: ""
		};
	}

	handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar:true,
            snackbarMessage:msg,
            snackbarSeverity:severity
        });
    };

	handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar:false
        });
    };

	getEmployees = async () => {
		this.setState({ employeeDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C315CommonUsersView`;
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
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					this.setState({
						employeeData: data
					});
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.error("getEmployees : ", error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.","error");
				}
			}
		);
		this.setState({ employeeDataLoading: false });
	};

	onFormSubmit = async (e) => {
		if(!IsEmpty(e)){
			e.preventDefault();
		}
		const data = new FormData(e.target);
		data.append("userId", this.state.employeeObject.id);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C360CommonEmployeesPayrollRequests/Save`;
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
		.then((json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}</span>, "success");
					this.clearAllData();
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>,"error");
				}
				console.log(json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					console.log("onFormSubmit : ", error);
					this.handleOpenSnackbar("Failed to Save ! Please try Again later.",	"error");
				}
			}
		);
		this.setState({ isLoading: false });
	};

	viewReport = () => {
		window.location = "#/dashboard/F360Reports";
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
			perMonthSalaryError ="Please enter Per Month Salary or Enter in Per Hour Rate field.";
			// perHourRateError = "Please enter Per Hour Rate  or Enter in Per Month Salary field.";
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

	onHandleChange = (e) => {
		let { name, value } = e.target;
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
				//regex = new RegExp(numberWithDecimalExp);
				regex = new RegExp(/^\d*\.?\d*$/);
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

	componentDidMount() {
		const {isDrawerOpen, setDrawerOpen} = this.props;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
		this.getEmployees();
	}

	render() {

		const { classes } = this.props;

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<form noValidate autoComplete="off" id="myForm" onSubmit={this.onFormSubmit}>
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
								}}
								variant="h5"
							>
								Employees Payroll Request
							</Typography>
							<Divider
								className={classes.divider}
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
								format="dd-MM-yyyy"
								fullWidth
								required
								value={this.state.effectiveDate}
								onChange={(date) =>
									this.onHandleChange({
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
									maxLength: 2,
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
								inputProps={{
									maxLength : 255
								}}
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
					handleCloseSnackbar={this.handleCloseSnackbar}
				/>
			</Fragment>
		);
	}
}

F360Form.propTypes = {
	isDrawerOpen: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	match: PropTypes.object,
};

F360Form.defaultProps = {
	isDrawerOpen: true,
	match: {
		params: {
			recordId: 0,
		},
	},
};

export default withStyles(styles)(F360Form);
