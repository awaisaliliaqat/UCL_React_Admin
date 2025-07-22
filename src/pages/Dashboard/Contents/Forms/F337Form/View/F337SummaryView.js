import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, Tooltip, IconButton } from "@material-ui/core";
import F337SummaryViewTableComponent from "./chunks/F337SummaryViewTableComponent";
import { IsEmpty } from "../../../../../../utils/helper";
import BottomBar from "../../../../../../components/BottomBar/BottomBarWithViewColorBlue";
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

class F337SummaryView extends Component {
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

			yearId: "",
			academicSessionsData: [],
			academicSessionsDataLoading: false,
			academicSessionId: "",
			academicSessionIdError: "",

			programmeGroupsData: [],
			programmeGroupsDataLoading: false,
			programmeGroupId: "",
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

			teachersAttendanceSheetData: [],

			isApproved: false,
			isFinalApproved: false,
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
				const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					let array = DATA || [];
					this.setState({ academicSessionsData: array });
					let arrayLength = array.length;
					for (let i = 0; i < arrayLength; i++) {
						if (array[i].isActive == "1") {
							const sessionId = array[i].ID;
							this.setState({ academicSessionId: sessionId });
							this.getProgrammeGroupsBySessionId(sessionId);
						}
					}
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
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
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ academicSessionsDataLoading: false });
	};

	getProgrammeGroupsBySessionId = async (academicSessionId) => {
		let mySessionId = academicSessionId;
		this.setState({
			programmeGroupsDataLoading: true,
			programmeGroupsData: [],
		});
		let data = new FormData();
		data.append("academicsSessionId", mySessionId);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322CommonAcademicsProgrammesGroupsView`;
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
				const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.setState({ programmeGroupsData: DATA });
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
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
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ programmeGroupsDataLoading: false });
	};

	onSearchClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C337CommonEmployeeAttendanceApprovalView?recordId=${this.state.recordId}`;
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
				const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					let array = DATA[0].attendanceDetail || [];
					let myExpandedGroupsData = [];
					for (let i = 0; i < array.length; i++) {
						myExpandedGroupsData.push(array[i]["teacherLabel"]);
					}
					let isApproved = false;
					if (array.length > 0) {
						isApproved = array[0]["isApproved"] || false;
					}
					this.setState({
						teachersAttendanceSheetData: array,
						expandedGroupsData: array,
						academicSessionId: DATA[0].academicSessionLabel,
						// programmeGroupId: json.DATA[0].programmeGroupLabel,
						monthId: DATA[0].monthLabel,
						// isApprovedByHead: json.DATA[0].isApproved,
						yearId: DATA[0].yearId,
						isApproved: DATA[0].isApproved === 0 ? false : true,
						isFinalApproved: DATA[0].isFinalApproved === 0 ? false : true,
					});
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

	onSendBackForRevision = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		var data = new FormData();
		data.append("sheetId", this.state.recordId);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C337CommonEmployeeAttendanceReverseApproval`;
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
				const { CODE, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					window.history.back();
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
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
		const formData = new FormData();
		formData.append("recordId", this.state.recordId);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C337CommonEmployeeAttendanceApproval`;
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
				const { CODE, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.handleOpenSnackbar("Approved", "success");
					this.onSearchClick();
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

	onClearAllData = () => {
		let sessionId = "";

		let array = this.state.academicSessionsData || [];
		let arrayLength = array.length;
		for (let i = 0; i < arrayLength; i++) {
			if (array[i].isActive == "1") {
				sessionId = array[i].ID || "";
			}
		}

		this.getProgrammeGroupsBySessionId(sessionId);

		this.setState({
			academicSessionId: sessionId,
			academicSessionIdError: "",
			academicSessionsDataLoading: false,

			programmeGroupId: "",
			programmeGroupIdError: "",

			teachersAttendanceSheetData: [],
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
				this.getProgrammeGroupsBySessionId(value);
				break;
			case "programmeGroupId":
				this.setState({
					teachersAttendanceSheetData: [],
				});
				break;
			default:
				break;
		}

		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	handleRatePerHourChange = (value, rowData) => {
		const { courseId } = rowData;
		const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
			item.courseId === courseId ? { 
				...item, totalAdjustedHours: value, 
				totalNetHours: Number(value) + item.totalHours, 
				totalAmount: (Number(value) + item.totalHours) * item.ratePerHour 
			} : item
		);
		this.setState({
			teachersAttendanceSheetData: updatedData,
		});
	};

	componentDidMount() {
		const { recordId } = this.props.match.params;
		this.setState({ recordId: recordId }, () => {
			this.onSearchClick();
		});
	}

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "id", title: "ID" },
			{ name: "displayName", title: "Name"},
			{ name: "adjustedLateDays",	title: "Adjusted Late Days"},
			{ name: "adjustedAbsentDays", title: "Adjusted Absent Days"},
			{ name: "adjustedOverTime", title: "Adjusted Over Time (Hours)"},
			{ name: "remarks", title: "Remarks"},
			{ name: "totalWorkingDays", title: "Work Days" },
			{ name: "totalAttendedDays", title: "Attended" },
			{ name: "totalAttendanceMissingDays", title: "Att. Missing" },
			{ name: "missingAttendanceDates", title: "Att. Missing Dates"},
			{ name: "totalLateDays",
				title: "Late Days",
				getCellValue: (rowData) => {
					const obj = rowData.lateTimeDetails;
					return (
						<div>
							<Button onClick={() => this.handleOpenDialog(obj)}>
								{rowData.totalLateDays}
							</Button>
						</div>
					);
				},
			},
			{
				name: "sumLateTime",
				title: "Late Time",
				getCellValue: (rowData) => {
					const obj = rowData.lateTimeDetails;
					return (
						<div>
							<Button onClick={() => this.handleOpenDialog(obj)}>
								{rowData.sumLateTime}
							</Button>
						</div>
					);
				},
			},
			{
				name: "sumEarlyDeparture",
				title: "Early Departure",
				getCellValue: (rowData) => {
					const obj = rowData.lateTimeDetails;
					return (
						<div>
							<Button onClick={() => this.handleOpenDialog(obj)}>
								{rowData.sumEarlyDeparture}
							</Button>
						</div>
					);
				},
			},
			{
				name: "sumBreakTime",
				title: "Break Time",
				getCellValue: (rowData) => {
					const obj = rowData.lateTimeDetails;
					return (
						<div>
							<Button onClick={() => this.handleOpenDialog(obj)}>
								{rowData.sumBreakTime}
							</Button>
						</div>
					);
				},
			},
			{
				name: "sumOverTime",
				title: "Over Time",
				getCellValue: (rowData) => {
					const obj = rowData.lateTimeDetails;
					return (
						<div>
							<Button onClick={() => this.handleOpenDialog(obj)}>
								{rowData.sumOverTime}
							</Button>
						</div>
					);
				},
			},
			{
				name: "sumShortTime",
				title: "Short Time",
				getCellValue: (rowData) => {
					const obj = rowData.lateTimeDetails;
					return (
						<div>
							<Button onClick={() => this.handleOpenDialog(obj)}>
								{rowData.sumShortTime}
							</Button>
						</div>
					);
				},
			}
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
							<Tooltip title="Back">
								<IconButton onClick={() => window.history.back()}>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Monthly Employee Deductions Approval Summary
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
								label="Academic Session"
								onChange={this.onHandleChange}
								value={this.state.academicSessionId}
								error={!!this.state.academicSessionIdError}
								helperText={this.state.academicSessionIdError}
								required
								fullWidth
								InputProps={{
									classes: { disabled: classes.disabledTextField },
								}}
								disabled
							/>
						</Grid>
						<Grid item xs={12} md={6}>
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
								InputProps={{
									classes: { disabled: classes.disabledTextField },
								}}
								disabled
								fullWidth
							
							/>
						</Grid>
						<Grid item xs={12}>
							<Divider className={classes.divider} />
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<F337SummaryViewTableComponent
							columns={columns}
							data={this.state}
						/>
						<br/>
						<br/>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
					<BottomBar
						// leftButtonHide
						leftButtonText="Send Back to Revision"
						leftButtonHide={false}
						bottomLeftButtonAction={this.onSendBackForRevision}
						disableLeftButton={this.state.isFinalApproved}
						right_button_text={this.state.isApproved ? "Approved" : "Approve"}
						disableRightButton={this.state.isApproved}
						loading={this.state.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={() => this.onApproveClick()}
					/>
				</div>
			</Fragment>
		);
	}
}

F337SummaryView.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F337SummaryView.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};
export default withRouter(withStyles(styles)(F337SummaryView));
