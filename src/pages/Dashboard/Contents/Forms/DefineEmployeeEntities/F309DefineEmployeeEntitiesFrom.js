import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Button, CircularProgress, IconButton, Chip, } from "@material-ui/core";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import DefineEmployeeEntitiesTableComponent from "./chunks/DefineEmployeeEntitiesTableComponent";
import { Delete } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
	},
	editButton: {
		color: theme.palette.warning.main,
		transition: "0.3s",
		"&:hover": {
			backgroundColor: "rgb(255, 152, 0, 0.1)", // Light yellow background on hover
		},
	},
});

class F309DefineEmployeeEntitiesFrom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//recordId: this.props.match.params.recordId,
			recordId: 0,
			isLoading: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			showTableFilter: false,
			employeeRolesTypesData: [],
			employeeRolesTypesDataLoading: false,
			employeesRolesObject: [],
			employeesRolesObjectError: "",
			employeeEntitiesData: [],
			label: "",
			labelError: "",
			employeeData: [],
			employeeDataLoading: false,
			employeeObject: {},
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
		this.setState({
			isOpenSnackbar: false,
		});
	};

	getEmployeesData = async () => {
		this.setState({ employeeDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C309CommonUsersView`;
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
				this.setState({
				  employeeData: json.DATA || [],
				});
			  } else {
				this.handleSnackbar(
				  true,
				  json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
				  "error"
				);
			  }
			  console.log(json);
			},
			(error) => {
			  if (error.status == 401) {
				this.setState({
				  isLoginMenu: true,
				  isReload: true,
				});
			  } else {
				console.log(error);
				this.handleSnackbar(
				  true,
				  "Failed to Get Data ! Please try Again later.",
				  "error"
				);
			  }
			}
		  );
		this.setState({ employeeDataLoading: false });
	  };

	getEmployeeRolesTypesData = async (id) => {
		const data = new FormData();
		data.append("id", id);
		this.setState({ employeeRolesTypesDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C309CommonEmployeesRolesTypesView`;
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
						this.setState({
							employeeRolesTypesData: json.DATA || [],
						});
					} else {
						//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
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
						console.log(error);
						// alert("Failed to Save ! Please try Again later.");
						this.handleOpenSnackbar(
							"Failed to Save ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeeRolesTypesDataLoading: false });
	};

	getEmployeesEntitiesData = async (roleObject) => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C309CommonEmployeesEntitiesTypesView`;
		let data = new FormData();
		data.append("roleId", roleObject?.id);
		await fetch(url, {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			})
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
						employeeEntitiesData: json.DATA || [],
					});
				} else {
					this.handleOpenSnackbar( json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE, "error" );
				}
				console.log(json);
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.log(error);
					this.handleOpenSnackbar( "Failed to Get Data ! Please try Again later.", "error" );
				}
			}
		);
		this.setState({ isLoading: false });
	};

	isFormValid = () => {
		let isValid = true;
		let { labelError, employeesRolesObjectError } = this.state;

		if(!this.state.employeesRolesObject.id){
			isValid = false;
			employeesRolesObjectError = "Please select a role";
		} else {
			employeesRolesObjectError = "";
		}

		if (!this.state.label) {
			isValid = false;
			labelError = "Please add role label";
		} else {
			labelError = "";
		}

		this.setState({
			labelError,
			employeesRolesObjectError
		});
		return isValid;
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		const errMsg = "";

		switch (name) {
			case "employeesRolesObject":
				if(value?.id){
					this.getEmployeesEntitiesData(value || []);
				} else {
					this.setState({
						employeeEntitiesData: []
					});
				}
				this.setState({
					recordId: 0,
					label:"",
					employeeObject: {}
				});
				break;
			default:
				break;
		}

		this.setState({
			[name]: value,
			[errName]: errMsg,
		});
	};

	clickOnFormSubmit = () => {
		if (this.isFormValid()) {
			document.getElementById("F308FormSubmitBtn").click();
		}
	};

	resetForm = () => {
		this.setState({
			recordId: 0,
			label: "",
			labelError: "",
		});
	};

	onFormSubmit = async (e) => {
		e.preventDefault();
		if (this.isFormValid) {
			let myForm = document.getElementById("myForm");
			const data = new FormData(myForm);
			data.append("recordId", this.state.recordId);
			data.append("roleTypeId", this.state.employeesRolesObject.id);
			let hodId = parseInt(this.state.employeeObject?.id);
			if(isNaN(hodId)){ hodId=""; }
			data.append("hodId", hodId);
			this.setState({ isLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C309CommonEmployeesEntitiesTypesSave`;
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
						//alert(json.USER_MESSAGE);
						this.getEmployeesEntitiesData(this.state.employeesRolesObject);
						this.handleOpenSnackbar(json.USER_MESSAGE, "success");
						this.resetForm();
					} else {
						//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
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
		}
	};

	onEditRecord = async (e, id) => {
		let newEmployeeEntitiesData = [...this.state.employeeEntitiesData.filter((item)=> item.id==id)];
		this.setState({
			recordId : id,
			employeesRolesObject : {id: newEmployeeEntitiesData[0].rolesTypeId , label: newEmployeeEntitiesData[0].rolesTypeLabel},
			label: newEmployeeEntitiesData[0].label,
			employeeObject: {id:newEmployeeEntitiesData[0].hodId, label:newEmployeeEntitiesData[0].hodLabel},
			employeeEntitiesData: newEmployeeEntitiesData
		});
	}

	onDeleteRecord = async (e, id) => {
		e.preventDefault();
		const data = new FormData();
		data.append("id", id);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C309CommonEmployeesEntitiesTypesDeleteById`;
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
						//alert(json.USER_MESSAGE);
						this.getEmployeesEntitiesData(this.state.employeesRolesObject);
						this.handleOpenSnackbar("Deleted", "success");
					} else {
						//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
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
		this.getEmployeeRolesTypesData();
		this.getEmployeesData();
	}

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "id", title: "ID" },
			{ name: "label", title: "Entity Name" },
			{ name: "hodLabel", title: "HOD" },
			{ name: "action", title: "Action",
				getCellValue: (rowData) => {
					return (
						<>
						<IconButton
							className={classes.editButton}
							onClick={(e) => this.onEditRecord(e, rowData.id)}
						>
							<EditIcon fontSize="small" />
						</IconButton>
						<IconButton
							onClick={(e) => this.onDeleteRecord(e, rowData.id)}
							color="secondary"
						>
							<Delete fontSize="small" />
						</IconButton> 
						</>
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
				<form id="myForm" onSubmit={this.onFormSubmit}>
					<TextField type="hidden" name="recordId" value={this.state.recordId} />
					<Button id="F308FormSubmitBtn" type="submit" style={{ display: "none" }} >
						Submit Form
					</Button>
					<Grid container component="main" className={classes.root}>
						<Typography className={classes.pageTitle} variant="h5">
							Define Employee Entities
						</Typography>
						<Divider className={classes.divider} />
						<Grid 
							container 
							spacing={2} 
							className={classes.container}
						>
							<Grid item xs={12} sm={6} md={3}>
								<Autocomplete
									id="employeesRolesObject"
									getOptionLabel={(option) =>
										typeof option.label === "string" ? option.label : ""
									}
									fullWidth
									aria-autocomplete="none"
									options={this.state.employeeRolesTypesData}
									loading={this.state.employeeRolesTypesDataLoading}
									value={this.state.employeesRolesObject}
									onChange={(e, value) =>
										this.onHandleChange({
											target: { name: "employeesRolesObject", value },
										})
									}
									renderInput={(params) => {
										const inputProps = params.inputProps;
										return (
											<TextField
												variant="outlined"
												error={!!this.state.employeesRolesObjectError}
												helperText={this.state.employeesRolesObjectError}
												inputProps={inputProps}
												label="Roles *"
												{...params}
											/>
										);
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={4}>
								<TextField
									id="label"
									name="label"
									label="Entity Label"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.label}
									error={!!this.state.labelError}
									helperText={this.state.labelError}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={4}>
								<Autocomplete
									id="employeeObject"
									getOptionLabel={(option) => typeof option.label == "string" ? option.label : "" }
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
												label="HOD"
												{...params}
											/>
										);
									}}
								/>
							</Grid>
							<Grid item xs={1}>
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
										this.state.recordId ? "Edit" : "Save"
									)}
								</Button>
							</Grid>
						</Grid>
						<Grid container spacing={2} className={classes.reportsContainer}>
							<Grid item xs={12}>
								<Divider />
								<DefineEmployeeEntitiesTableComponent
									rows={this.state.employeeEntitiesData || []}
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

F309DefineEmployeeEntitiesFrom.propTypes = {
	isDrawerOpen: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	match: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F309DefineEmployeeEntitiesFrom.defaultProps = {
	isDrawerOpen: true,
	setDrawerOpen: (fn) => fn,
	match: {
		params: {
			recordId: 0,
		},
	},
};
export default withStyles(styles)(F309DefineEmployeeEntitiesFrom);
