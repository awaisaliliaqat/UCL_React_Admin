import React, { Component, Fragment } from "react";
import { Divider, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F84ReportsTableComponent from "./Chunks/F84ReportsTableComponent";

const styles = () => ({
	root: {
		paddingBottom: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%"
	}
});

class F84Reports extends Component {
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
			expandedGroupsData: []
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
		this.setState({
			isLoading: true,
		});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/View`;
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
						let expandedGroupsData = [];
						for (let i = 0; i < json.DATA.length; i++) {
							const id = json.DATA[i].id;
             				expandedGroupsData.push(json.DATA[i].userLabel);
							json.DATA[i].action = (
								<EditDeleteTableComponent
									recordId={id}
									deleteRecord={this.DeleteData}
									editRecord={() =>
										window.location.replace(
											`#/dashboard/define-employees/${id}`
										)
									}
								/>
							);
						}
						this.setState({
							admissionData: json.DATA || [],
							expandedGroupsData
						});
					} else {
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
					}
					console.log(json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleOpenSnackbar(
							"Failed to fetch, Please try again later.",
							"error"
						);
						console.log(error);
					}
				}
			);
		this.setState({
			isLoading: false,
		});
	};

	DeleteData = async (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersDeleteV2`;
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
						this.handleOpenSnackbar("Deleted", "success");
						this.getData();
					} else {
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
					}
					console.log(json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						this.handleOpenSnackbar(
							"Failed to fetch, Please try again later.",
							"error"
						);
						console.log(error);
					}
				}
			);
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
		const {isDrawerOpen=false, setDrawerOpen=()=>{}} = this.props;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
		this.getData();
	}

	render() {

		const { classes } = this.props;

		const columns = [
			// { name: "action", title: "Action" },
			{ name: "userId", title: "ID" },
			{ name: "userLabel", title: "Name" },
			{ name: "fromDateLabel", title: "Effective From" },
			{ name: "roles", title: "Roles",
				getCellValue : (rowData) => {
					return (Array.isArray(rowData.roles) ? rowData.roles.map( r => r.label).join('\n') : (rowData.roles || ''))
				}				
			 },
			{ name: "entities", title: "Entities", 
				getCellValue : (rowData) => {
					return (rowData.entities || []).map((obj, index) => (obj.label+'\n'))
				}
			},
			{ name: "departments", title: "Departments",
				getCellValue : (rowData) => {
					return (rowData.departments || []).map((obj, index) => ( obj.label+'\n' ))
				}
			 },
			{ name: "subDepartments", title: "Sub Departments",
				getCellValue : (rowData) => {
					return (rowData.subDepartments || []).map((obj, index) => ( obj.label+'\n' ))
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
				<Grid
					container
					justifyContent="center"
					alignContent="center"
					spacing={2}
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
							component="span"
						>
							<Tooltip title="Back">
								<IconButton
									onClick={() =>
										window.location.replace("#/dashboard/F84Form")
									}
								>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Employees Roles Assignment Reports
						</Typography>
						<div style={{ float: "right" }}>
							<Tooltip title="Table Filter">
								<IconButton
									onClick={() => this.handleToggleTableFilter()}
								>
									<FilterIcon color="primary" />
								</IconButton>
							</Tooltip>
						</div>
						<Divider
							className={classes.divider}
						/>
					</Grid>
					<F84ReportsTableComponent
						rows={this.state.admissionData}
						columns={columns}
						expandedGroupsData={this.state.expandedGroupsData}
						showFilter={this.state.showTableFilter}
						isLoading={this.state.isLoading}
					/>
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
export default withStyles(styles)(F84Reports);
