import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Button, CircularProgress, IconButton, Tooltip, Select, MenuItem, InputLabel, Input, OutlinedInput, FormControl } from "@material-ui/core";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import DefineEmployeeRolesTableComponent from "./chunks/DefineEmployeeDesignationsTableComponent";
import { Delete } from "@material-ui/icons";
import FilterIcon from "mdi-material-ui/FilterOutline";
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
	root: {
		padding: 20,
	},
	pageTitle: {
		color: "#1d5f98",
		fontWeight: 600,
		borderBottom: "1px solid #d2d2d2",
		width: "98%",
		marginBottom: 25,
		fontSize: 20,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
	},
	container: {
		marginLeft: 5,
		marginRight: 10,
	},
	reportsContainer: {
		marginLeft: 5,
		marginRight: 10,
		marginBottom: 10,
		marginTop: 10,
	},
	circularProgress: {
		color: "white",
	},
	button: {
		padding: 13,
	}
});

class F312DefineEmployeeDesignationsFrom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showTableFilter: false,
			employeeDesignationsData: [],
			recordId: this.props.match.params.recordId,
			label: "",
			labelError: "",
			dashboardId: "",
			dashboardIdError: "",
			dashboardIdMenuItems: [],
			isLoading: false,
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

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};

	handleReset = () => {
		this.setState({isLoading : true});
		window.location = "#/dashboard/F312DefineEmployeeDesignationsFrom/0";
		window.location.reload();
	}

	handleEditReload = (id) => {
		this.setState({isLoading : true});
		window.location = `#/dashboard/F312DefineEmployeeDesignationsFrom/${id}`; 
		window.location.reload()
	}

	loadDashboards = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C312CommonDashboardsView`;
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
					this.setState({dashboardIdMenuItems: json.DATA || []});
				} else {
					this.handleOpenSnackbar( json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error" );
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar( "Failed to Save ! Please try Again later.", "error" );
				}
			}
		);
		this.setState({ isLoading: false });
	};

	getEmployeeDesignationsTypesData = async (id) => {
		const data = new FormData();
		data.append("id", id);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C312CommonEmployeesDesignationsTypesView`;
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
						if(this.state.recordId>0){
							let employeeDesignationsData = json.DATA.filter( data => data.id==this.state.recordId)
							this.setState({
								label: employeeDesignationsData[0].label,
								dashboardId: employeeDesignationsData[0].dashboardId ? employeeDesignationsData[0].dashboardId : "",	
								employeeDesignationsData: employeeDesignationsData || []
							});
						} else {
							this.setState({
								employeeDesignationsData: json.DATA || [],
							});
						}
					} else {
						this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error" );
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
						this.handleOpenSnackbar( "Failed to Save ! Please try Again later.", "error" );
					}
				}
			);
		this.setState({ isLoading: false });
	};

	isFormValid = () => {
		let isValid = true;
		let { labelError } = this.state;

		if (!this.state.label) {
			isValid = false;
			labelError = "Please add role label";
		} else {
			labelError = "";
		}

		this.setState({
			labelError,
		});
		return isValid;
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		const errMsg = "";

		this.setState({
			[name]: value,
			[errName]: errMsg,
		});
	};

	clickOnFormSubmit = () => {
		if (this.isFormValid()) {
			this.onFormSubmit();
		}
	};

	onFormSubmit = async (e) => {
		if (this.isFormValid) {
			let myForm = document.getElementById("myForm");
			const data = new FormData(myForm);
			this.setState({ isLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C312CommonEmployeesDesignationsTypesSave`;
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
						this.handleOpenSnackbar(json.USER_MESSAGE, "success");
						setTimeout(() => {
							this.handleReset();
						}, 2000);
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
					}
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						this.handleOpenSnackbar( "Failed to Save ! Please try Again later.", "error" );
					}
				}
			);
			this.setState({ isLoading: false });
		}
	};

	onDeleteRecord = async (e, id) => {
		e.preventDefault();
			const data = new FormData();
			data.append("id", id);
			this.setState({ isLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C312CommonEmployeesDesignationsTypesDeleteById`;
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
							this.getEmployeeDesignationsTypesData();
							this.handleOpenSnackbar("Deleted", "success");
						} else {
							this.handleOpenSnackbar( json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error" );
						}
					},
					(error) => {
						if (error.status == 401) {
							this.setState({
								isLoginMenu: true,
								isReload: false,
							});
						} else {
							console.log(error);
							//alert("Failed to Save ! Please try Again later.");
							this.handleOpenSnackbar( "Failed to Save ! Please try Again later.", "error" );
						}
					}
				);
			this.setState({ isLoading: false });
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadDashboards();
		this.getEmployeeDesignationsTypesData();
	}

	render() {
		
		const { classes } = this.props;

		const columns = [
			{ name: "id", title: "ID" },
			{ name: "label", title: "Role Name" },
			{ name: "dashboardLable", title: "Dashboard" },
			{ name: "action",
				title: "Action",
				getCellValue: (rowData) => {
					return (
						<Fragment>
							<IconButton onClick={e => this.onDeleteRecord(e, rowData.id)} color="secondary">
								<Delete fontSize="small" key={rowData.id} />
							</IconButton>
							<IconButton	onClick={(e)=>this.handleEditReload(rowData.id)}>
								<EditIcon fontSize="small" style={{ color: "#ff9800" }} />
							</IconButton>
					  </Fragment>
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
				<form id="myForm" name="myForm">
					<TextField
						type="hidden"
						name="id"
						value={this.state.recordId}
					/>
					<Grid container component="main" className={classes.root}>
						<Typography className={classes.pageTitle} variant="h5">
							Define Employee Designations
							<div style={{ float: "right" }}>
							<Tooltip title="Table Filter">
								<IconButton
									style={{ marginLeft: "0px" }}
									onClick={this.handleToggleTableFilter}
								>
									<FilterIcon fontSize="medium" color="primary" />
								</IconButton>
							</Tooltip>
						</div>
						</Typography>
						<Divider className={classes.divider} />
						<Grid container spacing={2} className={classes.container}>
							<Grid item xs={12} md={5}>
								<TextField
									id="label"
									name="label"
									label="Designation Label"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.label}
									error={!!this.state.labelError}
									helperText={this.state.labelError}
									autoComplete="off"
								/>
							</Grid>
							<Grid item xs={12} md={5}>
								<TextField
									id="dashboardId"
									name="dashboardId"
									variant="outlined"
									label="Dashboard"
									onChange={this.onHandleChange}
									value={this.state.dashboardId}
									error={!!this.state.dashboardIdError}
									helperText={this.state.dashboardIdError}
									fullWidth
									select
								>
									<MenuItem selected key={`dashboardIdMenuItems`} value=""><em>None</em></MenuItem>
									{this.state.dashboardIdMenuItems.map((dt, i) => (
									<MenuItem
										key={`dashboardIdMenuItems`+dt.id}
										value={dt.id}
									>
										{dt.label}
									</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={6} md={1}>
								<Button
									className={classes.button}
									disabled={this.state.isLoading}
									color="primary"
									variant="contained"
									onClick={(e) => this.clickOnFormSubmit(e)}
									fullWidth
								>
									{this.state.isLoading ? (
										<CircularProgress
											className={classes.circularProgress}
											size={24}
										/>
									) : (
										"Save"
									)}
								</Button>
							</Grid>
							<Grid item xs={6} md={1}>
								<Button
									className={classes.button}
									disabled={this.state.isLoading}
									color="default"
									variant="outlined"
									onClick={this.handleReset}
									fullWidth
								>
									{this.state.isLoading ? (
										<CircularProgress
											className={classes.circularProgress}
											size={24}
										/>
									) : (
										"Reset"
									)}
								</Button>
							</Grid>
						</Grid>
						<Grid container spacing={2} className={classes.reportsContainer}>
							<Grid item xs={12}>
								<Divider />
								<DefineEmployeeRolesTableComponent
									rows={this.state.employeeDesignationsData || []}
									columns={columns}
									showFilter={this.state.showTableFilter}
								/>
							</Grid>
						</Grid>
					</Grid>
				</form>

				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={() => this.handleCloseSnackbar()}
				/>
			</Fragment>
		);
	}
}

F312DefineEmployeeDesignationsFrom.propTypes = {
	isDrawerOpen: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	match: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F312DefineEmployeeDesignationsFrom.defaultProps = {
	isDrawerOpen: true,
	setDrawerOpen: (fn) => fn,
	match: {
		params: {
			recordId: 0,
		},
	},
};
export default withStyles(styles)(F312DefineEmployeeDesignationsFrom);
