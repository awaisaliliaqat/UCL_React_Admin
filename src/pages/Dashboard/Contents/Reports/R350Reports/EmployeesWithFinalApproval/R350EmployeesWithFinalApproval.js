import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, Grid, Typography, TextField, } from "@material-ui/core";
import MonthlyEmployeeLateDaysReportforPayrollTableComponent from "./chunks/MonthlyEmployeeLateDaysReportforPayrollTableComponent";
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

class R350EmployeesWithFinalApproval extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			id: null,
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

	getData = async (academicId, monthId) => {
		this.setState({ academicSessionsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C350EmployeeWithFinalApprovalsView?sessionId=${academicId}&sessionPayrollMonthId=${monthId}`;
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
					this.setState({
						academicSessionId: json.DATA[0],
						teachersAttendanceSheetData: json.DATA[0].employeeData,
						expandedGroupsData: json.DATA[0].employeeData,
					});
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
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
					console.error("C350EmployeeWithFinalApprovalsView :", error);
				}
			}
		);
		this.setState({ academicSessionsDataLoading: false });
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

	componentDidMount() {
		const { id } = this.props.match.params;
		this.props.setDrawerOpen(false);
		const [academicId, monthId] = id.split("T");
		if (academicId !== "" && monthId !== "") {
			this.getData(academicId, monthId);
		}
	}

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "userId", title: "ID" },
			{ name: "userLabel", title: "Name" },
			{ name: "adjustedAbsentDays", title: "Days Deducted Due to Absence", },
			{ name: "adjustedLateDays", title: "Days Deducted Due to Short Time" },
			{ name: "adjustedOverTime", title: "Adjusted Over Time (Hours)" },
			{ name: "remarks", title: "Remarks"},
			{ name: "totalWorkingDays", title: "Working Days" },
			{ name: "totalAttendedDays", title: "Attended" },
			{ name: "totalAttendanceMissingDays", title: "Att. Missing" },
			{ name: "lateDates", title: "Late"},
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
							Employees Approved Report for Payroll
						</Typography>
					</div>
					<Divider className={classes.divider} />
					<br />
					<Grid container justifyContent="center" alignItems="center" spacing={2}>
						<Grid item xs={12} md={6}>
							<TextField
								id="academicSessionId"
								name="academicSessionId"
								variant="outlined"
								value={this.state.academicSessionId.session || ""}
								onChange={null}
								fullWidth
								disabled
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								id="monthId"
								name="monthId"
								variant="outlined"
								value={this?.state?.academicSessionId.sessionPayrollMonth || ""}
								onChange={null}
								fullWidth
								disabled
							/>
						</Grid>
						<Grid item xs={12}>
							<Divider className={classes.divider} />
						</Grid>
					</Grid>
					<Grid item xs={12} style={{ marginBottom: "1%", }} >
						<MonthlyEmployeeLateDaysReportforPayrollTableComponent
							columns={columns}
							data={this.state}
						/>
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

R350EmployeesWithFinalApproval.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

R350EmployeesWithFinalApproval.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};
export default withRouter(withStyles(styles)(R350EmployeesWithFinalApproval));
