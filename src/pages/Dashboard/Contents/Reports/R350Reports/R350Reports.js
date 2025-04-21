import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { DatePicker } from "@material-ui/pickers";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, MenuItem, } from "@material-ui/core";
import { IsEmpty } from "../../../../../utils/helper";
import { withRouter } from "react-router-dom";

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
	disabledTextField: {
		"& .MuiInputBase-input.Mui-disabled": {
			color: "black", // Change the text color to black
		},
		"& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
			borderColor: "black", // Optionally, change the border color to black
		},
	},
});

class R350MonthlyEmployeeLateDaysReportforPayroll extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			recordId: null,
			isApprovedByHead: 0,

			isLoginMenu: false,
			isReload: false,

			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			isExisted: 1,

			yearId: "",
			yearData: [],
			academicSessionsData: [],
			academicSessionsDataLoading: false,
			academicSessionId: "",
			academicSessionIdError: "",

			openDialog: false,
			selectedStudent: null,

			programmeGroupsData: [],
			programmeGroupsDataLoading: false,
			programmeGroupId: "",

			attendanceSheetId: 0,
			programmeGroupIdError: "",

			monthsData: [
				{ id: 1, label: "January" },
				{ id: 2, label: "February" },
				{ id: 3, label: "March" },
				{ id: 4, label: "April" },
				{ id: 5, label: "May" },
				{ id: 6, label: "June" },
				{ id: 7, label: "July" },
				{ id: 8, label: "August" },
				{ id: 9, label: "September" },
				{ id: 10, label: "October" },
				{ id: 11, label: "November" },
				{ id: 12, label: "December" },
			],
			monthsDataLoading: false,
			monthId: "",
			monthIdError: "",

			expandedGroupsData: [],

			fromDate: null,
			toDate: null,
			fromDateToSend: null,
			toDateToSend: null,

			teachersAttendanceSheetData: [],

			isApproved: false,
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

	dateToGetThrough = (date) => {
		const [day, month, year] = date.split("-");
		const dateObj = new Date(`${year}-${month}-${day}`);
		const formattedDate = dateObj.toString();
		return formattedDate;
	};

	handleOpenDialog = (student) => {
		console.log(student, "student");
		this.setState({
			openDialog: true,
			selectedStudent: student,
			undoReason: "",
		});
	};

	handleCloseDialog = () => {
		this.setState({ openDialog: false, selectedStudent: null });
	};

	getYearsData = async (value) => {
		this.setState({
			isLoading: true,
		});
		const formData = new FormData();
		formData.append("sessionId", value);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonMonthsView`;
		await fetch(url, {
			method: "POST",
			body: formData,
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
						yearData: data,
					});
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
				}
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error" );
					console.log(error);
				}
			}
		);
		this.setState({
			isLoading: false,
		});
	};

	onSaveClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}

		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceSave`;
		// var data = new FormData();
		const { teachersAttendanceSheetData } = this.state;
		let array = [];
		const groupedData = teachersAttendanceSheetData.map((acc) => {
			const courseDetail = { ...acc, };
			array.push(courseDetail);
		});
		const data = {
			academicSessionId: this.state.academicSessionId,
			yearId: this.state.yearId,
			monthId: this.state.monthId.id,
			attendanceDetail: array,
		};
		await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
				"Content-Type": "application/json",
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
					this.onSearchClick();
					this.handleOpenSnackbar("Saved", "success");
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
				}
			}
		);
		this.setState({ isLoading: false });
	};

	getAcademicSessions = async () => {
		this.setState({ academicSessionsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322CommonAcademicSessionsView`;
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
						let array = json.DATA || [];
						this.setState({ academicSessionsData: array });
						let arrayLength = array.length;
						for (let i = 0; i < arrayLength; i++) {
							if (array[i].isActive == "1") {
								const sessionId = array[i].ID;
								this.setState({ academicSessionId: sessionId });
								this.getYearsData(sessionId);
							}
						}
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
					}
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error" );
					}
				}
			);
		this.setState({ academicSessionsDataLoading: false });
	};

	onSearchClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceView?fromDate=${this.state.fromDateToSend}&toDate=${this.state.toDateToSend}&sessionId=${this.state.academicSessionId}&monthId=${this.state.monthId.id}&isReportingTo=1`;
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
					let array = json.DATA[0].data || [];
					this.setState({
						teachersAttendanceSheetData: array,
						expandedGroupsData: array,
						isExisted: json.DATA[0].isExist,
						attendanceSheetId: json.DATA[0].attendanceSheetId !== "" ? json.DATA[0].attendanceSheetId : 0
					});
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error" );
				}
			}
		);
		this.setState({ isLoading: false });
	};

	onApproveClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayrollAttendanceSendForApproval?attendanceSheetId=${this.state.attendanceSheetId}`;
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
				"Content-Type": "application/json",
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
					this.onSearchClick();
					this.handleOpenSnackbar("Approved", "success");
				} else {
					this.onSearchClick();
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
				}
			}
		);
		this.setState({ isLoading: false });
	};

	onClearAllData = () => {
		let sessionId = "";
		this.setState({
			isLoading: false,
			recordId: null,
			isApprovedByHead: 0,

			isLoginMenu: false,
			isReload: false,

			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			isExisted: 1,

			yearId: "",
			yearData: [],

			openDialog: false,
			selectedStudent: null,

			academicSessionId : "",
			academicSessionIdError: "",

			programmeGroupsData: [],
			programmeGroupsDataLoading: false,
			programmeGroupId: "",

			attendanceSheetId: 0,
			programmeGroupIdError: "",

			monthsData: [
				{ id: 1, label: "January" },
				{ id: 2, label: "February" },
				{ id: 3, label: "March" },
				{ id: 4, label: "April" },
				{ id: 5, label: "May" },
				{ id: 6, label: "June" },
				{ id: 7, label: "July" },
				{ id: 8, label: "August" },
				{ id: 9, label: "September" },
				{ id: 10, label: "October" },
				{ id: 11, label: "November" },
				{ id: 12, label: "December" },
			],

			monthsDataLoading: false,
			monthId: "",
			monthIdError: "",

			expandedGroupsData: [],

			fromDate: null,
			toDate: null,
			fromDateToSend: null,
			toDateToSend: null,

			teachersAttendanceSheetData: [],

			isApproved: false,
		});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		switch (name) {
			case "academicSessionId":
				this.setState({
					teachersAttendanceSheetData: [],
					programmeGroupId: "",
					programmeGroupIdError: "",
				});
				break;
			case "programmeGroupId":
				this.setState({
					teachersAttendanceSheetData: [],
				});
				break;
			default:
				break;
		}
		if (name === "academicSessionId") {
			this.getYearsData(value);
		}
		if (name === "monthId") {
			const fromDate = this.dateToGetThrough(value.fromDate);
			const toDate = this.dateToGetThrough(value.toDate);
			this.setState({
				[name]: value,
				fromDate: fromDate,
				toDate: toDate,
				fromDateToSend: value.fromDate,
				toDateToSend: value.toDate,
				[errName]: "",
			});
		} else {
			this.setState({
				[name]: value,
				[errName]: "",
			});
		}
	};

	handleInputChange = (fieldName, value, rowData) => {
		const { id } = rowData;
		const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
			item.id === id ? { ...item, [fieldName]: fieldName === "remarks" ? value : Number(value), } : item
		);
		this.setState({
			teachersAttendanceSheetData: updatedData,
		});
	};

	handleFinalApproval = () => {
		const idToSend = `${this.state.academicSessionId}T${this.state.monthId.id}`;
		const url = `${process.env.REACT_APP_URL}#/dashboard/R350EmployeesWithFinalApproval/${idToSend}`;
		window.open(url, "_blank");
	};

	handlePendingApproval = () => {
		const idToSend = `${this.state.academicSessionId}T${this.state.monthId.id}`;
		const url = `${process.env.REACT_APP_URL}#/dashboard/R350EmployeesWithPendingForApproval/${idToSend}`;
		window.open(url, "_blank");
	};

	handleNotSubmittedApproval = () => {
		const idToSend = `${this.state.academicSessionId}T${this.state.monthId.id}`;
		const url = `${process.env.REACT_APP_URL}#/dashboard/R350EmployeesNotSubmitted/${idToSend}`;
		window.open(url, "_blank");
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		const { recordId } = this.props.match.params;
		this.getAcademicSessions();
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
				<div className={classes.mainContainer}>
					<div className={classes.titleContainer}>
						<Typography className={classes.title} variant="h5">
							Monthly Employee Deductions Report
						</Typography>
					</div>
					<Divider className={classes.divider} />
					<br />
					<Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								id="academicSessionId"
								name="academicSessionId"
								variant="outlined"
								label="Academic Session"
								onChange={this.onHandleChange}
								value={this.state.academicSessionId}
								error={!!this.state.academicSessionIdError}
								helperText={this.state.academicSessionIdError}
								required
								fullWidth
								select
							>
								{this.state.academicSessionsData?.map((item) => (
									<MenuItem key={"academicSessionsData"+item.ID} value={item.ID}>
										{item.Label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<br />
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								id="monthId"
								name="monthId"
								variant="outlined"
								label="Month"
								onChange={this.onHandleChange}
								value={this.state.monthId}
								error={!!this.state.monthIdError}
								helperText={this.state.monthIdError}
								required
								fullWidth
								select
							>
								{this.state.yearData?.map((item) => (
									<MenuItem key={"yearData"+item.id} value={item}>
										{item.monthName}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<DatePicker
								autoOk
								id="fromDate"
								name="fromDate"
								label="From Date"
								invalidDateMessage=""
								disabled={Object.keys(this.state.yearId).length === 0}
								placeholder=""
								variant="inline"
								inputVariant="outlined"
								format="dd-MM-yyyy"
								fullWidth
								required
								value={this.state.fromDate}
								onChange={(date) =>
									this.onHandleChangeDate({
										target: { name: "fromDate", value: date },
									})
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<DatePicker
								autoOk
								id="toDate"
								name="toDate"
								label="To Date"
								invalidDateMessage=""
								disabled={Object.keys(this.state.yearId).length === 0}
								placeholder=""
								variant="inline"
								inputVariant="outlined"
								format="dd-MM-yyyy"
								fullWidth
								required
								value={this.state.toDate}
								onChange={(date) =>
									this.onHandleChangeDate({
										target: { name: "toDate", value: date },
									})
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								disabled={
									this.state.isLoading ||
									this.state.academicSessionsDataLoading ||
									!this.state.academicSessionId ||
									!this.state.monthId
								}
								onClick={(e) => this.handleFinalApproval(e)}
								fullWidth
							>
								{this.state.isLoading ? (
									<CircularProgress style={{ color: "white" }} size={24} />
								) : (
									"Employees with Final Approval"
								)}
							</Button>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								disabled={
									this.state.isLoading ||
									this.state.academicSessionsDataLoading ||
									!this.state.academicSessionId ||
									!this.state.monthId
								}
								onClick={(e) => this.handlePendingApproval(e)}
								fullWidth
							>
								{this.state.isLoading ? (
									<CircularProgress style={{ color: "white" }} size={24} />
								) : (
									"Employees with Pending For Approval"
								)}
							</Button>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								disabled={
									this.state.isLoading ||
									this.state.academicSessionsDataLoading ||
									!this.state.academicSessionId ||
									!this.state.monthId
								}
								onClick={(e) => this.handleNotSubmittedApproval(e)}
								fullWidth
							>
								{this.state.isLoading ? (
									<CircularProgress style={{ color: "white" }} size={24} />
								) : (
									"Employees Not Submitted"
								)}
							</Button>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Button
								variant="contained"
								color="default"
								className={classes.button}
								disabled={
									this.state.isLoading ||
									this.state.academicSessionsDataLoading ||
									this.state.programmeGroupsDataLoading
								}
								onClick={() => this.onClearAllData()}
								fullWidth
							>
								Clear
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Divider className={classes.divider} />
						</Grid>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
				</div>
			</Fragment>
		);
	}
}

R350MonthlyEmployeeLateDaysReportforPayroll.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

R350MonthlyEmployeeLateDaysReportforPayroll.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};

export default withRouter(withStyles(styles)(R350MonthlyEmployeeLateDaysReportforPayroll));
