import React, { Component, Fragment } from "react";
import { Box, Button, Divider, Grid, IconButton, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FilterIcon from "mdi-material-ui/FilterOutline";
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import R86ReportsTableComponent from "./Chunks/R86ReportsTableComponent";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = (theme) => ({
	root: {
		paddingBottom: theme.spacing(4),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%"
	}
});

class R86Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			admissionData: [],
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
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
		this.setState({
			isOpenSnackbar: false,
		});
	};

	getData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C86EmployeeProfile/EmployeesView`;
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
		.then((json) => {
				const { CODE, DATA=[], SYSTEM_MESSAGE, USER_MESSAGE} =  json;
				if (CODE === 1) {
					this.setState({
						admissionData: DATA || [],
					});
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE} <br/> {USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
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
		this.setState({ isLoading: false });
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};

	componentDidMount() {
		this.getData();
	}

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "action", title: "Action",
				getCellValue : (row) => (
					<Button
						color="primary"
						style={{minWidth:42}}
						onClick={()=>window.open( `#/EmployeeProfile/${row.id}`, "_blank" )}
					>
						<Tooltip title="View Profile"><BallotOutlinedIcon /></Tooltip>
					</Button>
				)
			},
			{ name: "id", title: "ID" },
			{ name: "displayName", title: "Name" },
			{ name: "mobileNo", title: "Mobile No" },
			{ name: "email", title: "Email" },
			{ name: "jobStatusLabel", title: "Job Status" },
			{ name: "shiftLabel", title: "Shift Label" },
			// { name: "reportingToId", title: "Reporting To ID" },
			{ name: "reportingToLabel", title: "Reporting To" },
			{ name: "coordinationLabel", title: "Coordination With" },
			{ name: "joiningDateLabel", title: "Joining Date" },
			{ name: "bloodGroup", title: "Blood Group" },
			{ name: "statusLabel", title: "Status" },
			// { name: "isBankAccount", title: "Bank Status" },
			{
				name: "bankAccount", title: "Bank Account",
				getCellValue: (rowData) => <Fragment>{rowData.bankAccount ? "Bank Account" : "Cheque"} </Fragment>
			},
			{
				name: "bankAccountNumber1", title: "SCB Account",
				getCellValue: (rowData) => <Fragment>{rowData.bankAccountNumber1}</Fragment>
			},
			{
				name: "bankAccountNumber2", title: "Faysal Bank Account",
				getCellValue: (rowData) => <Fragment>{rowData.bankAccountNumber2}</Fragment>
			},
			{ name: "leavingDateLabel", title: "Leaving Date" },
			{ name: "rolesLabel", title: "Roles" },
			{ name: "entitiesLabel", title: "Entities" },
			{ name: "departmentsLabel", title: "Departments" },
			{ name: "subDepartmentsLabel", title: "Sub Departments" },
			{ name: "designationsLabel", title: "Designations" },
			{ name: "address", title: "Address" },
			{ name: "emergencyContactName", title: " E.C.Name" },
			{ name: "emergencyContactNumber", title: "E.C.Number" },
		];

		return (

			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid
					container
					spacing={2}
					justifyContent="center"
					alignItems="center"
					className={classes.root}
				>
					<Grid item xs={12}>
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
						>
							Employee Profile
							<Box component="span" style={{ float: "right" }}>
								<Tooltip title="Table Filter">
									<IconButton
										onClick={() => this.handleToggleTableFilter()}
									>
										<FilterIcon color="primary" />
									</IconButton>
								</Tooltip>
							</Box>
						</Typography>
						<Divider
							className={classes.divider}
						/>
					</Grid>
					<Grid item xs={12}>
						<R86ReportsTableComponent
							rows={this.state.admissionData}
							columns={columns}
							showFilter={this.state.showTableFilter}
							isLoading={this.state.isLoading}
						/>
					</Grid>
				</Grid>
				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					isLoading={this.state.isLoading}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={() => this.handleCloseSnackbar()}
				/>
			</Fragment>
		);
	}
}

export default withStyles(styles)(R86Reports);
