import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Chip, Checkbox, CircularProgress, } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const styles = () => ({
	root: {
		paddingBottom: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
	},
	chip: {
		borderRadius: ".3em"
	}
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class F84Form extends Component {
	constructor(props) {
		super(props);
		this.state = {

			isLoading: false,
			isReload: false,
			showPass: false,

			employeeData: [],
			employeeDataLoading: false,
			employee: null,

			employeesRolesData: [],
			employeesRolesDataLoading: false,
			employeesRolesArray: [],
			employeesRolesArrayError: "",

			employeesEntitiesData: [],
			employeesEntitiesDataLoading: false,
			employeesEntitiesArray: [],
			employeesEntitiesArrayError: "",

			employeesDepartmentsData: [],
			employeesDepartmentsDataLoading: false,
			employeesDepartmentsArray: [],
			employeesDepartmentsArrayError: "",

			employeesSubDepartmentsData: [],
			employeesSubDepartmentsDataLoading: false,
			employeesSubDepartmentsArray: [],
			employeesSubDepartmentsArrayError: "",

			employeesDesignationsData: [],
			employeesDesignationsDataLoading: false,
			employeesDesignationsArray: [],
			employeesDesignationsArrayError: "",

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

	loadUsers = async () => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationAllUsersView`;
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
            this.setState({ employeeData: json.DATA });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadUsers", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ employeeDataLoading: false });
  };

	loadData = async (index) => {
		const data = new FormData();
		data.append("id", index);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersViewV2`;
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
						if (json.DATA) {
							if (json.DATA.length > 0) {
								const {
									employeesRolesArray = [],
									employeesEntitiesArray = [],
									employeesDepartmentsArray = [],
									employeesSubDepartmentsArray = [],
									employeesDesignationsArray = [],
								} = json.DATA[0];

								this.getEmployeesEntitiesData(employeesRolesArray);
								this.getEmployeesDepartmentsData(employeesEntitiesArray);
								this.getEmployeesSubDepartmentsData(
									employeesEntitiesArray,
									employeesDepartmentsArray
								);
								this.setState({
									employeesRolesArray,
									employeesEntitiesArray,
									employeesDepartmentsArray,
									employeesSubDepartmentsArray,
									employeesDesignationsArray
								});
							}
						}
					} else {
						this.handleOpenSnackbar(
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
						this.handleOpenSnackbar(
							"Failed to Load Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	handleDateChange = (date) => {
		this.setState({ selectedDate: date });
	};
	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;

		let regex = "";
		switch (name) {
			case "employee":
				this.setState({
					employee : value
				});
				if(value?.id){
					this.loadData(value?.id);
				} else {
					this.setState({
					employeesRolesArray: [],
					employeesRolesArrayError: "",

					employeesEntitiesArray: [],
					employeesEntitiesArrayError: "",

					employeesDepartmentsArray: [],
					employeesDepartmentsArrayError: "",
					employeesDepartmentsData: [],
					employeesDepartmentsDataLoading: false,

					employeesSubDepartmentsArray: [],
					employeesSubDepartmentsArrayError: "",
					employeesSubDepartmentsData: [],
					employeesSubDepartmentsDataLoading: false,
				});
				}
			break;
			case "employeesRolesArray":
				this.setState({
					employeesEntitiesArray: [],
					employeesEntitiesArrayError: "",

					employeesDepartmentsArray: [],
					employeesDepartmentsArrayError: "",
					employeesDepartmentsData: [],
					employeesDepartmentsDataLoading: false,

					employeesSubDepartmentsArray: [],
					employeesSubDepartmentsArrayError: "",
					employeesSubDepartmentsData: [],
					employeesSubDepartmentsDataLoading: false,
				});
				this.getEmployeesEntitiesData(value || []);
				break;
			case "employeesEntitiesArray":
				this.setState({
					employeesDepartmentsArray: [],
					employeesDepartmentsArrayError: "",

					employeesSubDepartmentsArray: [],
					employeesSubDepartmentsArrayError: "",
					employeesSubDepartmentsData: [],
					employeesSubDepartmentsDataLoading: false,
				});
				this.getEmployeesDepartmentsData(value || []);
				break;
			case "employeesDepartmentsArray":
				this.setState({
					employeesSubDepartmentsArray: [],
					employeesSubDepartmentsArrayError: "",
				});
				this.getEmployeesSubDepartmentsData(
					this.state.employeesEntitiesArray || [],
					value || []
				);
				break;
			default:
				break;
		}

		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	isFormValid = () => {
		let isValid = true;
		let regex = "";
		let {
			employeesRolesArrayError,
			employeesEntitiesArrayError,
			employeesDesignationsArrayError,
		} = this.state;

		this.setState({
			employeesRolesArrayError,
			employeesEntitiesArrayError,
			employeesDesignationsArrayError
		});

		return isValid;
	};

	clickOnFormSubmit = () => {
		if (this.isFormValid()) {
			document.getElementById("btn-submit").click();
		}
	};

	resetForm = () => {
		this.setState({
			showPass: false,

			employeesRolesArray: [],
			employeesRolesArrayError: "",

			employeesEntitiesArray: [],
			employeesEntitiesArrayError: "",
			employeesEntitiesData: [],
			employeesEntitiesDataLoading: false,
			coordinationId: "",

			employeesDepartmentsArray: [],
			employeesDepartmentsArrayError: "",
			employeesDepartmentsData: [],
			employeesDepartmentsDataLoading: false,

			employeesSubDepartmentsArray: [],
			employeesSubDepartmentsArrayError: "",
			employeesSubDepartmentsData: [],
			employeesSubDepartmentsDataLoading: false,

			employeesDesignationsArray: [],
			employeesDesignationsArrayError: "",
		});
	};

	getEmployeesRolesData = async () => {
		this.setState({ employeesRolesDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesRolesTypesView`;
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
							employeesRolesData: json.DATA || [],
						});
					} else {
						this.handleOpenSnackbar(
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
						this.handleOpenSnackbar(
							"Failed to Get Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeesRolesDataLoading: false });
	};

	getEmployeesDesignationsData = async (
		entityIds,
		departmentIds,
		subDepartmentIds
	) => {
		this.setState({ employeesDesignationsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesEntitiesDesignationsTypesView`;
		let data = new FormData();
		data.append("entityId", entityIds);
		data.append("departmentId", departmentIds);
		data.append("subDepartmentId", subDepartmentIds);
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
			body: data,
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
							employeesDesignationsData: json.DATA || [],
						});
					} else {
						this.handleOpenSnackbar(
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
						this.handleOpenSnackbar(
							"Failed to Get Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeesDesignationsDataLoading: false });
	};

	getEmployeesEntitiesData = async (roleIds) => {
		this.setState({ employeesEntitiesDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesEntitiesTypesView`;
		let data = new FormData();
		if (roleIds != null && roleIds.length > 0) {
			for (let i = 0; i < roleIds.length; i++) {
				data.append("roleId", roleIds[i].id);
			}
		}
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
			body: data,
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
							employeesEntitiesData: json.DATA || [],
						});
					} else {
						this.handleOpenSnackbar(
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
						this.handleOpenSnackbar(
							"Failed to Get Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeesEntitiesDataLoading: false });
	};

	getEmployeesDepartmentsData = async (entityIds) => {
		this.setState({ employeesDepartmentsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesEntitiesDepartmentsTypesView`;
		let data = new FormData();
		if (entityIds != null && entityIds.length > 0) {
			for (let i = 0; i < entityIds.length; i++) {
				data.append("entityId", entityIds[i].id);
			}
		}
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
			body: data,
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
							employeesDepartmentsData: json.DATA || [],
						});
					} else {
						this.handleOpenSnackbar(
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
						this.handleOpenSnackbar(
							"Failed to Get Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeesDepartmentsDataLoading: false });
	};

	getEmployeesSubDepartmentsData = async (entityIds, departmentIds) => {
		this.setState({ employeesSubDepartmentsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesEntitiesSubDepartmentsTypesView`;
		let data = new FormData();
		if (entityIds != null && entityIds.length > 0) {
			for (let i = 0; i < entityIds.length; i++) {
				data.append("entityId", entityIds[i].id);
			}
		}
		if (departmentIds != null && departmentIds.length > 0) {
			for (let i = 0; i < departmentIds.length; i++) {
				data.append("departmentId", departmentIds[i].id);
			}
		}
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
			body: data,
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
							employeesSubDepartmentsData: json.DATA || [],
						});
					} else {
						this.handleOpenSnackbar(
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
						this.handleOpenSnackbar(
							"Failed to Get Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ employeesSubDepartmentsDataLoading: false });
	};

	onFormSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData(e.target);
		data.append("isActive", this.state.isActive);
		const roleIdsArray = this.state.employeesRolesArray || [];
		for (let i = 0; i < roleIdsArray.length; i++) {
			data.append("roleIds", roleIdsArray[i]["id"]);
		}

		const entityIdsArray = this.state.employeesEntitiesArray || [];
		for (let i = 0; i < entityIdsArray.length; i++) {
			data.append("entityIds", entityIdsArray[i]["id"]);
		}

		const departmentIdsArray = this.state.employeesDepartmentsArray || [];
		for (let i = 0; i < departmentIdsArray.length; i++) {
			data.append("departmentIds", departmentIdsArray[i]["id"]);
		}

		const subDepartmentIdsArray = this.state.employeesSubDepartmentsArray || [];
		for (let i = 0; i < subDepartmentIdsArray.length; i++) {
			data.append("subDepartmentIds", subDepartmentIdsArray[i]["id"]);
		}
		if (this.state.recordId === 0) {
			const designationIdsArray = this.state.employeesDesignationsArray || [];
			for (let i = 0; i < designationIdsArray.length; i++) {
				data.append("designationsIds", designationIdsArray[i]["id"]);
			}
		}
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersSaveV2`;
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
						if (this.state.recordId == 0) {
							this.resetForm();
						} else {
							setTimeout(() => {
								window.location.replace("#/dashboard/employee-reports");
							}, 1000);
						}
					} else {
						this.handleOpenSnackbar(
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
							isReload: false,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar(
							"Failed to Save ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	viewReport = () => {
		window.location = "#/dashboard/F84Reports";
	};

	componentDidMount() {
		this.loadUsers();
		this.getEmployeesRolesData();
		if (this.state.recordId != 0) {
			//this.loadData(2044);
		} else {
			this.getEmployeesDesignationsData([], [], []);
		}
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
				<form
					noValidate
					autoComplete="off"
					id="myForm"
					onSubmit={this.onFormSubmit}
				>
					<TextField type="hidden" name="id" value={this.state.recordId} />
					<Grid
						container
						component="main"
						spacing={2}
						justifyContent="flex-start"
						alignItems="center"
						className={classes.root}
					>
						<Grid item xs={12}>
							<Typography
								style={{
									color: "#1d5f98",
									fontWeight: 600,
									width: "100%",
								}}
								variant="h5"
							>
								Assign Employee Roles
							</Typography>
							<Divider
								className={classes.divider}
							/>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								id="employee"
								getOptionLabel={(option) =>
									typeof option.label === "string" ? option.label : ""
								}
								options={this.state.employeeData}
								onChange={(event, value) => {
									this.onHandleChange({
										target: { name: "employee", value },
									})
								}}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (<TextField 
										{...params} 
										label="Employee" 
										margin="normal" 
										variant="outlined"
										inputProps={inputProps}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<React.Fragment>
													{this.state.employeeDataLoading ? (
														<CircularProgress color="inherit" size={20} />
													) : null}
													{params.InputProps.endAdornment}
												</React.Fragment>
											),
										}}
									/>
								)}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Autocomplete
								multiple
								id="employeesRolesArray"
								getOptionLabel={(option) =>
									typeof option.label === "string" ? option.label : ""
								}
								getOptionSelected={(option, value) => option.id === value.id}
								fullWidth
								aria-autocomplete="none"
								options={this.state.employeesRolesData}
								loading={this.state.employeesRolesDataLoading}
								value={this.state.employeesRolesArray}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employeesRolesArray", value },
									})
								}
								disableCloseOnSelect
								renderTags={(tagValue, getTagProps) =>
									tagValue.map((option, index) => {
										return (
										<Chip
											key={option}
											label={option.label}
											color="primary"
											variant="outlined"
											{...getTagProps({ index })}
											className={`${getTagProps({ index }).className} ${classes.chip}`}
										/>
									)})
								}
								renderOption={(option, { selected }) => (
									<React.Fragment>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											color="primary"
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{option.label}
									</React.Fragment>
								)}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (
										<TextField
											{...params}
											variant="outlined"
											error={!!this.state.employeesRolesArrayError}
											helperText={this.state.employeesRolesArrayError}
											inputProps={inputProps}
											label="Roles *"
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{this.state.employeesRolesDataLoading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
										/>
									);
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Autocomplete
								multiple
								id="employeesEntitiesArray"
								getOptionLabel={(option) =>
									typeof option.label === "string" ? option.label : ""
								}
								limitTags={3}
								fullWidth
								getOptionSelected={(option, value) => option.id === value.id}
								renderTags={(tagValue, getTagProps) =>
									tagValue.map((option, index) => (
										<Chip
											key={option}
											label={option.label}
											color="primary"
											variant="outlined"
											{...getTagProps({ index })}
											className={`${getTagProps({ index }).className} ${classes.chip}`}
										/>
									))
								}
								aria-autocomplete="none"
								options={this.state.employeesEntitiesData}
								loading={this.state.employeesEntitiesDataLoading}
								value={this.state.employeesEntitiesArray}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employeesEntitiesArray", value },
									})
								}
								disableCloseOnSelect
								renderOption={(option, { selected }) => (
									<React.Fragment>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											color="primary"
											checked={selected}
										/>
										{option.label}
									</React.Fragment>
								)}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (
										<TextField
											{...params}
											variant="outlined"
											inputProps={inputProps}
											label="Entities *"
											error={!!this.state.employeesEntitiesArrayError}
											helperText={this.state.employeesEntitiesArrayError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{this.state.employeesEntitiesDataLoading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
										/>
									);
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Autocomplete
								multiple
								limitTags={3}
								id="employeesDepartmentsArray"
								getOptionLabel={(option) =>
									typeof option.label === "string" ? option.label : ""
								}
								fullWidth
								aria-autocomplete="none"
								options={this.state.employeesDepartmentsData}
								loading={this.state.employeesDepartmentsDataLoading}
								value={this.state.employeesDepartmentsArray}
								getOptionSelected={(option, value) => option.id === value.id}
								renderTags={(tagValue, getTagProps) =>
									tagValue.map((option, index) => (
										<Chip
											key={option}
											label={option.label}
											color="primary"
											variant="outlined"
											{...getTagProps({ index })}
											className={`${getTagProps({ index }).className} ${classes.chip}`}
										/>
									))
								}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employeesDepartmentsArray", value },
									})
								}
								disableCloseOnSelect
								renderOption={(option, { selected }) => (
									<React.Fragment>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											color="primary"
											checked={selected}
										/>
										{option.label}
									</React.Fragment>
								)}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (
										<TextField
											{...params}
											variant="outlined"
											inputProps={inputProps}
											label="Departments"
											error={!!this.state.employeesDepartmentsArrayError}
											helperText={this.state.employeesDepartmentsArrayError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{this.state.employeesDepartmentsDataLoading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
										/>
									);
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Autocomplete
								multiple
								limitTags={3}
								id="employeesSubDepartmentsArray"
								getOptionLabel={(option) =>
									typeof option.label === "string" ? option.label : ""
								}
								fullWidth
								aria-autocomplete="none"
								options={this.state.employeesSubDepartmentsData}
								loading={this.state.employeesSubDepartmentsDataLoading}
								value={this.state.employeesSubDepartmentsArray}
								getOptionSelected={(option, value) => option.id === value.id}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employeesSubDepartmentsArray", value },
									})
								}
								disableCloseOnSelect
								renderTags={(tagValue, getTagProps) =>
									tagValue.map((option, index) => (
										<Chip
											key={option}
											label={option.label}
											color="primary"
											variant="outlined"
											{...getTagProps({ index })}
											className={`${getTagProps({ index }).className} ${classes.chip}`}
										/>
									))
								}
								renderOption={(option, { selected }) => (
									<React.Fragment>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											color="primary"
											checked={selected}
										/>
										{option.label}
									</React.Fragment>
								)}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (
										<TextField
											{...params}
											variant="outlined"
											inputProps={inputProps}
											label="Sub Departments"
											error={!!this.state.employeesSubDepartmentsArrayError}
											helperText={this.state.employeesSubDepartmentsArrayError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{this.state.employeesSubDepartmentsDataLoading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
										/>
									);
								}}
							/>
						</Grid>
						{/* <Grid item xs={12} md={6}>
							<Autocomplete
								multiple
								limitTags={3}
								id="employeesDesignationsArray"
								getOptionLabel={(option) =>
									typeof option.label === "string" ? option.label : ""
								}
								fullWidth
								aria-autocomplete="none"
								disableCloseOnSelect
								disabled={!!this.state.recordId}
								options={this.state.employeesDesignationsData}
								loading={this.state.employeesDesignationsDataLoading}
								value={this.state.employeesDesignationsArray}
								getOptionSelected={(option, value) => option.id === value.id}
								renderTags={(tagValue, getTagProps) =>
									tagValue.map((option, index) => (
										<Chip
											key={option}
											label={option.label}
											color="primary"
											variant="outlined"
											{...getTagProps({ index })}
											className={`${getTagProps({ index }).className} ${classes.chip}`}
										/>
									))
								}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employeesDesignationsArray", value },
									})
								}
								renderOption={(option, { selected }) => (
									<React.Fragment>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											color="primary"
											checked={selected}
										/>
										{option.label}
									</React.Fragment>
								)}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (
										<TextField
											{...params}
											variant="outlined"
											inputProps={inputProps}
											label="Designations *"
											error={!!this.state.employeesDesignationsArrayError}
											helperText={this.state.employeesDesignationsArrayError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{this.state.employeesDesignationsDataLoading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
										/>
									);
								}}
							/>
						</Grid> */}
					</Grid>
					<input type="submit" style={{ display: "none" }} id="btn-submit" />
				</form>
				<BottomBar
					leftButtonText="View"
					leftButtonHide={true}
					bottomLeftButtonAction={() => this.viewReport()}
					right_button_text="Save"
					// bottomRightButtonAction={() => this.clickOnFormSubmit()}
					bottomRightButtonAction={() => this.handleOpenSnackbar("Feature under development","info")}
					loading={this.state.isLoading}
					isDrawerOpen={this.isDrawerOpen}
				/>
				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={this.handleCloseSnackbar}
				/>
			</Fragment>
		);
	}
}

F84Form.propTypes = {
	isDrawerOpen: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	match: PropTypes.object,
};

F84Form.defaultProps = {
	isDrawerOpen: true,
	match: {
		params: {
			recordId: 0,
		},
	},
};

export default withStyles(styles)(F84Form);
