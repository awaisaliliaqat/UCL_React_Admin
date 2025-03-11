import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { DatePicker } from "@material-ui/pickers";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, MenuItem, IconButton, Box, Chip, } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {Delete as DeleteIcon} from "@material-ui/icons";
import { isBefore, startOfDay, parse, format, differenceInDays, isAfter, isEqual } from 'date-fns';
import F355FormTableComponent from "./chunks/F355FormTableComponent";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { IsEmpty } from "../../../../../utils/helper";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import BottomBar from "../../../../../components/BottomBar/BottomBar";

const styles = () => ({
	mainContainer: {
		padding: 20,
	},
	titleContainer: {
		display: "flex",
		justifyContent: "space-between",
	},
	title: {
		color: "#1d5f98",
		fontWeight: 600,
		textTransform: "capitalize",
	},
	divider: { backgroundColor: "rgb(58, 127, 187)", opacity: "0.3" },
	actions: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "100%",
	},
	button: {
		textTransform: "capitalize",
		fontSize: 14,
		height: 45,
	},
});

class F355Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: {
				isLoading: false,
				leaveTypes: false,
			},
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "info",
			leaveTypeMenuItems: [],
			leaveTypeId: "",
			leaveTypeIdError: "",
			fromDate: null,
			fromDateError: "",
			toDate: null,
			toDateError: "",
			noOfDays: 0,
			employeeLeavesData: [],
			employeeLeavePlanData: [],
			appliedLeaveDataPlan: [],
			recordIndex: 0,
			leaveYearsData: [],
			leaveYearStartDate: "",
			leaveYearEndDate: "",
			employeeData: [],
			employeeDataLoading: false,
			employeeObject: null,
			employeeObjectError: "",
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
		this.setState({ isOpenSnackbar: false });
	};

	loadLeaveYears = async () => {
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonLeaveYearsView`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					if (DATA.length) {
						let data = DATA.find((d, i) => d.isCurrent == 1);
						this.setState({
							leaveYearsData: DATA,
							leaveYearStartDate: data.startDate,
							leaveYearEndDate: data.endDate,
						});
					}
				} else {
					//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br />{USER_MESSAGE}</span>, "error");
				}
				console.log("loadLeaveYears:", json);
			},
			(error) => {
				const {status} = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.log(error);
					// alert("Failed to Save ! Please try Again later.");
					this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
				}
			}
		);
	};

	getEmployeesData = async () => {
		this.setState({ employeeDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C355CommonEmployeesProxyLeaves/ReportingEmployeesView`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					this.setState({
				  		employeeData: DATA || [],
					});
			  	} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error");
			  }
			  console.log(json);
			},
			(error) => {
				const {status} = error;
			  	if (status == 401) {
					this.setState({
				  		isLoginMenu: true,
				  		isReload: true,
					});
			  	} else {
					console.log(error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.","error");
			  	}
			}
		);
		this.setState({ employeeDataLoading: false });
	};

	loadLeaveTypes = async () => {
		this.setState((prevState) => ({
			isLoading: { ...prevState.isLoading, leaveTypes: true },
		}));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C355CommonEmployeesProxyLeaves/CommonLeaveTypesView`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					if (DATA.length) {
						this.setState({
							leaveTypeMenuItems: DATA,
						});
					} else {
						window.location = "#/dashboard/F355Form";
					}
				} else {
					//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
				console.log("loadLeaveTypes:", json);
			},
			(error) => {
				const {status} = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.log(error);
					// alert("Failed to Save ! Please try Again later.");
					this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.", "error");
				}
			}
		);
		this.setState((prevState) => ({
			isLoading: { ...prevState.isLoading, leaveTypes: false },
		}));
	};

	loadLeavePlans = async () => {
		this.setState((prevState) => ({
			isLoading: { ...prevState.isLoading, leaveTypes: true },
		}));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C355CommonEmployeesProxyLeaves/UserLeavePlanView`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					if (DATA.length) {
						this.setState({
							employeeLeavePlanData: DATA,
						});
					}
				} else {
					//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
				console.log("loadLeavePlans:", json);
			},
			(error) => {
				const {status} = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.log(error);
					// alert("Failed to Save ! Please try Again later.");
					this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.", "error" );
				}
			}
		);
		this.setState((prevState) => ({
			isLoading: { ...prevState.isLoading, leaveTypes: false },
		}));
	};

	clickOnFormSubmit = () => {
		this.onFormSubmit();
	};

	onFormSubmit = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		const { employeeLeavesData } = this.state;
		if (employeeLeavesData.length === 0) {
			this.handleOpenSnackbar("Please add at least one record.", "error");
			return;
		}
		let myForm = document.getElementById("myForm");
		const data = new FormData(myForm);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C355CommonEmployeesProxyLeaves/Save`;
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
				const { CODE, SYSTEM_MESSAGE, USER_MESSAGE } = json;
				if (CODE === 1) {
					//alert(json.USER_MESSAGE);
					this.handleOpenSnackbar(json.USER_MESSAGE, "success");
					setTimeout(() => {
						// if(this.state.recordId!=0){
						//     window.location="#/dashboard/F353Reports";
						// } else {
						window.location.reload();
						//}
					}, 2000);
				} else {
					//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
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
					console.log(error);
					//alert("Failed to Save ! Please try Again later.");
					this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
				}
			}
		);
		this.setState({ isLoading: false });
	};

	viewReport = () => {
		window.location = "#/dashboard/F355Reports";
	};

	islabelValid = () => {
		let isValid = true;
		if (!this.state.leaveTypeId) {
			this.setState({ leaveTypeIdError: "Please select Leave Type." });
			document.getElementById("leaveTypeId").focus();
			isValid = false;
		} else {
			this.setState({ leaveTypeIdError: "" });
		}
		return isValid;
	};

	isDateValid = () => {
		const { fromDate, toDate, employeeLeavesData } = this.state;
		let errors = {};

		// Check if To Date is before From Date
		if (isAfter(startOfDay(fromDate), startOfDay(toDate))) {
			errors.toDateError="The To Date should be later or equal to the From Date.";
			document.getElementById("toDate").focus();
		}

		// Check for overlapping leave dates
		const isOverlapping = employeeLeavesData.some((leave) => {
			const leaveStart = parse(leave.fromDate, "dd-MM-yyyy", new Date());
			const leaveEnd = parse(leave.toDate, "dd-MM-yyyy", new Date());

			return (
				leave.employeeId==this.state.employeeObject?.id &&
				(isEqual(fromDate, leaveStart) ||
				isEqual(fromDate, leaveEnd) ||
				isEqual(toDate, leaveStart) ||
				isEqual(toDate, leaveEnd) ||
				(isBefore(fromDate, leaveEnd) && isAfter(toDate, leaveStart)) ||
				(isBefore(fromDate, leaveEnd) && isAfter(fromDate, leaveStart)) ||
				(isBefore(toDate, leaveEnd) && isAfter(toDate, leaveStart))
			));
		});

		if (isOverlapping) {
			this.handleOpenSnackbar("The selected dates overlap with existing leave dates.", "error");
			return false;
		}

		// If there are errors, update the state and return false
		if (Object.keys(errors).length > 0) {
			this.setState(errors);
			return false;
		}

		// If valid, clear errors
		this.setState({ fromDateError: "", toDateError: "" });
		return true;
	};

	onHandleChange = (event) => {
		const { name, value } = event.target;
		const errName = `${name}Error`;
		let updates = { [name]: value, [errName]: "" };

		switch (name) {
			case "leaveTypeId": {
				if (value !== 1) {
					const { leaveYearStartDate, leaveYearEndDate } = this.state;
					updates = {
						...updates,
						fromDate: startOfDay(new Date()),
						fromDateError: "",
						toDate: startOfDay(new Date()),
						toDateError: "",
						noOfDays: 1,
						appliedLeaveDataPlan: [
							{
								startOnDate: startOfDay(new Date(leaveYearStartDate)),
								endOnDate: startOfDay(new Date(leaveYearEndDate)),	
							},
						],
					};
				} else {
					const { employeeLeavePlanData } = this.state;
					if (employeeLeavePlanData.length > 0) {
						const startOnDate = startOfDay( new Date(employeeLeavePlanData[0].startOnDate) );
						const endOnDate = startOfDay( new Date(employeeLeavePlanData[0].endOnDate) );
						updates = {
							...updates,
							fromDate: startOnDate,
							fromDateError: "",
							toDate: endOnDate,
							toDateError: "",
							noOfDays: Math.abs(differenceInDays(startOnDate, endOnDate)) + 1,
							appliedLeaveDataPlan: employeeLeavePlanData,
						};
					}
				}
				updates.employeeLeavesData = [];
				break;
			}

			case "fromDate": {
				const isValidDate = this.state.appliedLeaveDataPlan.some(
					(range) =>
						value >= startOfDay(new Date(range.startOnDate)) &&
						value <= startOfDay(new Date(range.endOnDate))
				);

				if (!isValidDate) {
					this.setState({ fromDateError: "Selected date is out of range" });
					return;
				}

				updates = {
					...updates,
					toDateError: "",
					noOfDays: Math.abs( differenceInDays(startOfDay(this.state.toDate), startOfDay(value)) ) + 1,
				};
				break;
			}

			case "toDate": {
				const isValidDate = this.state.appliedLeaveDataPlan.some(
					(range) =>
						value >= startOfDay(new Date(range.startOnDate)) &&
						value <= startOfDay(new Date(range.endOnDate))
				);

				if (!isValidDate) {
					this.setState({ toDateError: "Selected date is out of range" });
					return;
				}

				updates = {
					...updates,
					fromDateError: "",
					noOfDays:
						Math.abs(
							differenceInDays(
								startOfDay(value),
								startOfDay(this.state.fromDate)
							)
						) + 1,
				};
				break;
			}

			default:
				break;
		}

		this.setState(updates);
	};

	handleAdd = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		if (!this.islabelValid() || !this.isDateValid()) {
			return;
		}

		this.setState((prevState) => ({
			isLoading: { ...prevState.isLoading, isLoading: true },
		}));

		let leaveTypeLabel = this.state.leaveTypeMenuItems.find(
			(d) => d.id === this.state.leaveTypeId
		)?.label;

		const obj = {
			recordIndex: this.state.recordIndex,
			employeeId: this.state.employeeObject?.id,
			employeeLabel: this.state.employeeObject?.label,
			leaveTypeId: this.state.leaveTypeId,
			leaveTypeLabel: leaveTypeLabel || "",
			fromDate: format(this.state.fromDate, "dd-MM-yyyy"),
			toDate: format(this.state.toDate, "dd-MM-yyyy"),
			noOfDays: this.state.noOfDays,
		};
		this.setState((prevState) => ({
			recordIndex: prevState.recordIndex + 1,
			employeeObject: null,
			//leaveTypeId: "",
			//fromDate: startOfDay(new Date(this.state.lean)),
			//toDate: startOfDay(new Date()),
			//noOfDays: Math.abs(differenceInDays(startOfDay(new Date()), startOfDay(new Date()))) + 1,
			isLoading: { ...prevState.isLoading, isLoading: false },
			employeeLeavesData: [...prevState.employeeLeavesData, obj],
		}));
	};

	handleDelete = (rowData) => {
		const filterData = this.state.employeeLeavesData.filter(
			(item) => item.recordIndex !== rowData.recordIndex
		);

		this.setState({
			employeeLeavesData: [...filterData],
		});
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadLeaveYears();
		this.getEmployeesData()
		this.loadLeaveTypes();
		this.loadLeavePlans();
	}

	render() {
		const { classes } = this.props;

		const columns = [
			{
				name: "employee",
				title: "Employee",
				getCellValue: (rowData) => {
					return (
						<>
							<Box>{rowData.employeeLabel}</Box>
							<TextField
								type="hidden"
								value={rowData.employeeId}
								name="employeeId"
							/>
						</>
					);
				},
			},
			{
				name: "leaveTypeLabel",
				title: "Leave Type",
				getCellValue: (rowData) => {
					return (
						<>
							<Box>{rowData.leaveTypeLabel}</Box>
							<TextField
								type="hidden"
								value={rowData.leaveTypeId}
								name="leaveTypeId"
							/>
						</>
					);
				},
			},
			{
				name: "fromDate",
				title: "From Date",
				getCellValue: (rowData) => {
					return (
						<>
							<Box>{rowData.fromDate}</Box>
							<TextField
								type="hidden"
								value={rowData.fromDate}
								name="fromDate"
							/>
						</>
					);
				},
			},
			{
				name: "toDate",
				title: "To Date",
				getCellValue: (rowData) => {
					return (
						<>
							<Box>{rowData.toDate}</Box>
							<TextField type="hidden" value={rowData.toDate} name="toDate" />
						</>
					);
				},
			},
			{
				name: "noOfDays",
				title: "Days",
				getCellValue: (rowData) => {
					return (
						<>
							<Box>{rowData.noOfDays}</Box>
							<TextField
								type="hidden"
								value={rowData.noOfDays}
								name="noOfDays"
							/>
						</>
					);
				},
			},
			{
				name: "action",
				title: "Action",
				getCellValue: (rowData) => {
					return (
						<IconButton
							color="secondary"
							aria-label="delete"
							className={classes.margin}
							onClick={() => this.handleDelete(rowData)}
						>
							<DeleteIcon />
						</IconButton>
					);
				},
			},
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<div className={classes.mainContainer}>
					<div className={classes.titleContainer}>
						<Typography className={classes.title} variant="h5">
							{"Employees Proxy Leave Form"}
							<br />
						</Typography>
					</div>
					<Divider className={classes.divider} />
					<br />
					<Grid
						container
						justifyContent="flex-start"
						alignItems="center"
						spacing={2}
					>
						<Grid item xs={12} sm={6} md={3}>
							<Autocomplete
								id="employeeObject"
								fullWidth
								aria-autocomplete="none"
								getOptionLabel={(option) => typeof option.label == "string" ? option.label : "" }
								getOptionSelected={(option, value) => option.id === value.id}
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
											key={option}
											label={option.label}
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
											label="Employees"
											{...params}
										/>
									);
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<TextField
								name="leaveTypeId"
								label="Leave Type"
								required
								fullWidth
								variant="outlined"
								select
								onChange={this.onHandleChange}
								value={this.state.leaveTypeId}
								error={!!this.state.leaveTypeIdError}
								helperText={this.state.leaveTypeIdError}
								SelectProps={{
									id: "leaveTypeId",
									style: { paddingRight: 0 },
									endAdornment: (
										<>
											{this.state.isLoading?.leaveTypes ? (
												<CircularProgress
													color="inherit"
													size={20}
													style={{ marginRight: 36, height: "inherit" }}
												/>
											) : null}
										</>
									),
								}}
							>
								<MenuItem value="" disabled>
									<em>None</em>
								</MenuItem>
								{this.state.leaveTypeMenuItems?.map((d, i) => (
									<MenuItem key={"leaveTypeMenuItems" + d.id} value={d.id}>
										{d.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<DatePicker
								autoOk
								id="fromDate"
								name="fromDate"
								label="From Date"
								invalidDateMessage=""
								placeholder=""
								inputVariant="outlined"
								format="dd-MM-yyyy"
								minDate={startOfDay(new Date(this.state.leaveYearStartDate))}
								maxDate={startOfDay(new Date(this.state.leaveYearEndDate))}
								fullWidth
								required
								value={this.state.fromDate}
								onChange={(date) => {
									this.onHandleChange({
										target: { name: "fromDate", value: date },
									});
								}}
								shouldDisableDate={(date) => {
									return !this.state.appliedLeaveDataPlan.some(
										(range) =>
											date >= range.startOnDate && date <= range.endOnDate
									);
								}}
								error={!!this.state.fromDateError}
								helperText={this.state.fromDateError}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<DatePicker
								autoOk
								id="toDate"
								name="toDate"
								label="To Date"
								invalidDateMessage=""
								placeholder=""
								inputVariant="outlined"
								format="dd-MM-yyyy"
								minDate={startOfDay(new Date(this.state.leaveYearStartDate))}
								maxDate={startOfDay(new Date(this.state.leaveYearEndDate))}
								fullWidth
								required
								value={this.state.toDate}
								onChange={(date) =>
									this.onHandleChange({
										target: { name: "toDate", value: date },
									})
								}
								shouldDisableDate={(date) => {
									return !this.state.appliedLeaveDataPlan.some(
										(range) =>
											date >= range.startOnDate && date <= range.endOnDate
									);
								}}
								error={!!this.state.toDateError}
								helperText={this.state.toDateError}
							/>
						</Grid>
						<Grid item xs={12} sm={10} md={2}>
							<TextField
								id="noOfDays"
								name="noOfDays"
								label="No of Days"
								placeholder=""
								variant="outlined"
								fullWidth
								required
								readOnly
								value={this.state.noOfDays}
								//onChange={this.onHandleChange}
								error={!!this.state.noOfDaysError}
								helperText={this.state.noOfDaysError}
								autoComplete="false"
							/>
						</Grid>
						<Grid item xs={12} sm={2} md={1}>
							<div className={classes.actions}>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									disabled={
										!this?.state?.leaveTypeId ||
										!this?.state?.fromDate ||
										!this?.state?.toDate ||
										!this?.state?.employeeObject?.id
									}
									onClick={(e) => this.handleAdd(e)}
									style={{ padding: "1.7rem" }}
									fullWidth
								>
									{" "}
									{this.state.isLoading?.isLoading ? (
										<CircularProgress style={{ color: "white" }} size={24} />
									) : (
										"Add"
									)}
								</Button>
							</div>
						</Grid>
						<Grid item xs={12}>
							<Divider className={classes.divider} />
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<form id="myForm">
							<F355FormTableComponent
								columns={columns}
								rows={this.state.employeeLeavesData || []}
							/>
						</form>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
					<BottomBar
						// leftButtonHide
						leftButtonText="View"
						leftButtonHide={false}
						bottomLeftButtonAction={this.viewReport}
						right_button_text="Save"
						disableRightButton={this.state.employeeLeavesData.length === 0}
						loading={this.state.isLoading?.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={() => {
							this.clickOnFormSubmit();
						}}
					/>
				</div>
			</Fragment>
		);
	}
}

F355Form.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F355Form.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};

export default withStyles(styles)(F355Form);
