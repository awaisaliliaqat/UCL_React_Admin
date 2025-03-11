import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Divider, Grid, Typography, IconButton, Tooltip, Box, } from "@material-ui/core";
import { format } from 'date-fns';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import F355ReportsTableComponent from "./chunks/F355ReportsTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

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

class F355Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: {
				isLoading: false
			},
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			leaveTypeMenuItems: [],
			leaveTypeId: "",
			leaveTypeIdError: "",
			fromDate: null,
			toDate: null,
			employeeLeavesData: [
				/*
				{ "leaveTypeId": 2, "leaveTypeLabel": "Sick Leave", "fromDate": "01-02-2025", "toDate": "02-02-2025", "approvalStatus": "Approved" },
				{ "leaveTypeId": 1, "leaveTypeLabel": "Annual Leave", "fromDate": "10-02-2025", "toDate": "12-02-2025", "approvalStatus": "Approved" },
				{ "leaveTypeId": 3, "leaveTypeLabel": "Casual Leave", "fromDate": "15-02-2025", "toDate": "15-02-2025", "approvalStatus": "Pending" },
				{ "leaveTypeId": 4, "leaveTypeLabel": "Casual Leave", "fromDate": "20-02-2025", "toDate": "20-02-2025", "approvalStatus": "Rejected" }
				*/
			],
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

	componentDidMount() {
		this.loadData();
	}

	onHandleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	onSearchClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		this.setState(prevState => ({ isLoading: { ...prevState.isLoading, isLoading: true } }));

		let leaveTypeLabel = this.state.leaveTypeMenuItems.find(d => d.id == this.state.leaveTypeId)?.label;

		const obj = {
			leaveTypeId: this.state.leaveTypeId,
			leaveTypeLabel: leaveTypeLabel || "",
			fromDate: format(this.state.fromDate, "dd-MM-yyyy"),
			toDate: format(this.state.toDate, "dd-MM-yyyy"),
		};
		this.setState(prevState => ({
			leaveTypeId: "",
			fromDate: null,
			toDate: null,
			isLoading: { ...prevState.isLoading, isLoading: false },
			employeeLeavesData: [...prevState.employeeLeavesData, obj],
		}));
	};

	loadData = async () => {
		this.setState(prevState => ({ isLoading: { ...prevState.isLoading, isLoading: true } }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C355CommonEmployeesProxyLeaves/View`;
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
			})
		})
		.then(res => {
			if (!res.ok) {
				throw res;
			}
			return res.json();
		})
		.then(json => {
			const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE } = json;
			if (json.CODE === 1) {
				if (json.DATA.length) {
					this.setState({
						employeeLeavesData: json.DATA
					});
				} else {
					window.location = "#/dashboard/F355Form";
				}
			} else {
				//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
				this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error");
			}
			console.log("loadData:", json);
		},
		error => {
			if (error.status == 401) {
				this.setState({
					isLoginMenu: true,
					isReload: true
				})
			} else {
				console.log(error);
				// alert("Failed to Save ! Please try Again later.");
				this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.", "error");
			}
		});
		this.setState(prevState => ({ isLoading: { ...prevState.isLoading, isLoading: false } }));
	}

	viewReport = () => {
		window.location = "#/dashboard/F353Reports";
	};

	handleDelete = (rowData) => {
		const filterData = this.state.employeeLeavesData.filter(
			(item) => item.employeeID !== rowData.employeeID
		);

		this.setState({
			employeeLeavesData: [...filterData],
		});
	};

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "leaveTypeLabel", title: "Leave Type" },
			{ name: "startOnDate", title: "From Date" },
			{ name: "endOnDate", title: "To Date" },
			{ name: "noOfDays", title: "Days" },
			{
				name: "approvalStatus", title: "Approval Status",
				getCellValue: (rowData) => {
					let color = '';
					let approvalStatus = '';
					if (rowData.isApproved == 1) {
						color = 'success.main';
						approvalStatus = 'Approved';
					} else if (rowData.isDeclined == 1) {
						color = 'error.main';
						approvalStatus = 'Declined';
					} else {
						color = 'warning.main';
						approvalStatus = 'Pending'
					}
					return (
						<Box color={color}>{approvalStatus}</Box>
					)
				}
			},
			{
				name: "statusChangedOn", title: "Status On",
				getCellValue: (rowData) => {
					let statusOn = '';
					if (rowData.isApproved == 1) {
						statusOn = rowData.approvedOn;
					} else if (rowData.isDeclined == 1) {
						statusOn = rowData.declinedOn;
					} else {
						statusOn = rowData.createdOn;
					}
					return statusOn;
				}
			},
			{
				name: "statusChangedBy", title: "Status By",
				getCellValue: (rowData) => {
					let statusBy = '';
					if (rowData.isApproved == 1) {
						statusBy = rowData.approvedByLabel;
					} else if (rowData.isDeclined == 1) {
						statusBy = rowData.declinedByLabel;
					} else {
						statusBy = rowData.createdByLabel;
					}
					return (
						<Box>{statusBy}</Box>
					)
				}
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
							{"Employees Proxy Leave Reports"}
							<br />
						</Typography>
					</div>
					<Divider className={classes.divider} />
					<br />
					<Grid item xs={12}>
						<F355ReportsTableComponent
							isLoading={this.state.isLoading?.isLoading}
							columns={columns}
							rows={this.state.employeeLeavesData}
						/>
					</Grid>
					<br/>
					<br/>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
					<BottomBar
						// leftButtonHide
						leftButtonText="View"
						leftButtonHide={true}
						bottomLeftButtonAction={this.viewReport}
						right_button_text="Save"
						hideRightButton={true}
						disableRightButton={this.state.employeeLeavesData.length === 0}
						loading={this.state.isLoading?.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={() => { this.handleOpenSnackbar("Saved", "success"); setTimeout(window.location.reload(), 2000) }}
					/>
				</div>
			</Fragment>
		);
	}
}

F355Reports.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F355Reports.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F355Reports);
