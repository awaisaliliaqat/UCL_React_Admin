import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, CircularProgress, Grid, Typography, IconButton, Tooltip } from "@material-ui/core";
import F354FormTableComponent from "./chunks/F354FormTableComponent";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';

const styles = (theme) => ({
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
	approvedButton: {
		color: theme.palette.success.main,
		transition: "0.3s",
		"&:hover": {
			backgroundColor: "rgba(76, 159, 80, 0.1)", // Light green background on hover
		},
	},
});

class F354Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isLoadingApproval: {}, // Store loading state per row
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			employeeLeavesData: []
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
		this.props.setDrawerOpen(false);
		this.loadData();
	}

	loadData = async () => {
		this.setState(prevState => ({ isLoading: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C354CommonEmployeesLeavesApproval/View`;
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
			const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
			if (CODE === 1) {
				if (DATA.length) {
					this.setState({ employeeLeavesData: DATA });
				} else {
					window.location = "#/dashboard/F354Form";
				}
			} else {
				//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
				this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br />{USER_MESSAGE}</span>, "error");
			}
			console.log("loadData:", json);
		},
		error => {
			const {status} = error;
			if (status == 401) {
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
		this.setState(prevState => ({ isLoading: false }));
	}

	handleSave = async (id, isApproved, isDeclined) => {
		const data = new FormData();
		data.append("id", id);
		data.append("isApproved", isApproved);
		data.append("isDeclined", isDeclined);
		// Set loading for the specific row
		this.setState(prevState => ({
			isLoadingApproval: { ...prevState.isLoadingApproval, [id]: true },
		}));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C354CommonEmployeesLeavesApproval/SaveApproval`;
		await fetch(url, {
			method: "POST",
			body: data,
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
			const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
			if (CODE === 1) {
				this.handleOpenSnackbar(USER_MESSAGE, "success");
				this.setState(prevState => ({
					isLoadingApproval: { ...prevState.isLoadingApproval, [id]: false },
					employeeLeavesData: this.state.employeeLeavesData.filter(item => item.id !== id)
				}));
				// setTimeout(() => {
				// 	window.location.reload();
				// }, 2000);
			} else {
				this.setState(prevState => ({ isLoadingApproval: { ...prevState.isLoadingApproval, [id]: false } }));
				this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br />{USER_MESSAGE}</span>, "error");
			}
			console.log("handleSave : ", json);
		},
		error => {
			const {status} = error;
			this.setState(prevState => ({ isLoadingApproval: { ...prevState.isLoadingApproval, [id]: false } }));
			if (status == 401) {
				this.setState({
					isLoginMenu: true,
					isReload: false
				})
			} else {
				console.log(error);
				this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
			}
		});
	}

	viewReport = () => {
		window.location = "#/dashboard/F354Reports";
	};

	handleDelete = (rowData) => {
		const filterData = this.state.employeeLeavesData.filter((item) => item.recordIndex !== rowData.recordIndex);
		this.setState({ employeeLeavesData: [...filterData] });
	};

	render() {

		const { classes } = this.props;

		const { isLoadingApproval } = this.state;

		const columns = [
			{ name: "userLabel", title: "Employee" },
			{ name: "leaveTypeLabel", title: "Leave Type" },
			{ name: "startOnDate", title: "From Date" },
			{ name: "endOnDate", title: "To Date" },
			{ name: "noOfDays", title: "Days" },
			{ name: "createdOn", title: "Requested On" },
			{
				name: "action", title: "Action",
				getCellValue: (rowData) => {
					console.log(rowData);
					return (
						<>
							<IconButton
								aria-label="Approve"
								className={`${classes.margin} ${classes.approvedButton}`}
								onClick={() => this.handleSave(rowData.id, 1, 0)}
								disabled={isLoadingApproval[rowData.id]}
							>
								{isLoadingApproval[rowData.id] ? (
									<CircularProgress size={24} color="inherit" />
								) : (
									<Tooltip title="Approve">
										<ThumbUpAltOutlinedIcon />
									</Tooltip>
								)}
							</IconButton>
							<IconButton
								color="secondary"
								aria-label="Declined"
								className={classes.margin}
								onClick={() => this.handleSave(rowData.id, 0, 1)}
								disabled={isLoadingApproval[rowData.id]}
							>
								{isLoadingApproval[rowData.id] ? (
									<CircularProgress size={24} color="inherit" />
								) : (

									<Tooltip title="Decline">
										<ThumbDownAltOutlinedIcon />
									</Tooltip>
								)}
							</IconButton>
						</>
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
							{"Employee Leave Approval Form"}
						</Typography>
					</div>
					<Divider className={classes.divider} />
					<br />
					<Grid item xs={12}>
						<F354FormTableComponent
							columns={columns}
							rows={this.state.employeeLeavesData || []}
						/>
					</Grid>
					<br />
					<br />
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
					<BottomBar
						leftButtonText="View"
						leftButtonHide={false}
						bottomLeftButtonAction={this.viewReport}
						right_button_text="Save"
						hideRightButton={true}
						disableRightButton={this.state.employeeLeavesData.length === 0}
						loading={this.state.isLoading?.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={() => alert("Save")}
					/>
				</div>
			</Fragment>
		);
	}
}

F354Form.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F354Form.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F354Form);
