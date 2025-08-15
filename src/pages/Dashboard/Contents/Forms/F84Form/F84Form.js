import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Chip, Checkbox, CircularProgress, Button, } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { DatePicker } from "@material-ui/pickers";
import { format, startOfDay, isValid, parse } from "date-fns";

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

const toStartOfDay = (val) => {
	if (val == null) return null;
	// epoch (number or numeric string)
	if (typeof val === "number" || /^\d+$/.test(String(val))) {
		const d = new Date(parseInt(val, 10));
		return isValid(d) ? startOfDay(d) : null;
	}
	// dd-MM-yyyy
	const d2 = parse(String(val), "dd-MM-yyyy", new Date());
	return isValid(d2) ? startOfDay(d2) : null;
};

class F84Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			parmUserId: parseInt(this.props.match.params?.userId, 10) || 0,
			parmFromDate: parseInt(this.props.match.params?.fromDate, 10) || 0,
			isLoading: false,
			isReload: false,

			fromDate: startOfDay(new Date()),

			employeeData: [],
			employeeDataLoading: false,
			employeeId: 0,

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
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/EmployeesView`;
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
		.then((json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.setState({ employeeData: DATA });
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
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
					console.log(error);
					this.handleOpenSnackbar( "Failed to fetch ! Please try Again later.", "error");
				}
			}
		);
		this.setState({ employeeDataLoading: false });
	};

	getEmployeesRolesData = async () => {
		this.setState({ employeesRolesDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/RolesTypesView`;
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
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.setState({
						employeesRolesData: DATA || [],
					});
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
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
					console.log(error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.",	"error");
				}
			}
		);
		this.setState({ employeesRolesDataLoading: false });
	};

	getEmployeesEntitiesData = async (roles) => {
		let data = new FormData();
		if (roles != null && roles.length > 0) {
			roles.forEach( role => {
				data.append("roleId", role.id);
			});
		}
		this.setState({ employeesEntitiesDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/EntitiesTypesView`;
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
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.setState({
						employeesEntitiesData: DATA || [],
					});
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
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
					console.log(error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.",	"error");
				}
			}
		);
		this.setState({ employeesEntitiesDataLoading: false });
	};

	getEmployeesDepartmentsData = async (entities) => {
		let data = new FormData();
		if (entities!=null && entities.length>0) {
			entities.forEach( entity => {
				data.append("entityId", entity.id);
			});
		}
		this.setState({ employeesDepartmentsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/DepartmentsTypesView`;
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
		.then((json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.setState({
						employeesDepartmentsData: DATA || [],
					});
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
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
					console.log(error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.",	"error");
				}
			}
		);
		this.setState({ employeesDepartmentsDataLoading: false });
	};

	getEmployeesSubDepartmentsData = async (entities, departments) => {
		let data = new FormData();
		if (entities != null && entities.length > 0) {
			entities.forEach(entity => {
				data.append("entityId", entity.id);
			});
		}
		if (departments != null && departments.length > 0) {
			departments.forEach(department => {
				data.append("departmentId", department.id);	
			});
		}
		this.setState({ employeesSubDepartmentsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/SubDepartmentsTypesView`;
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
		.then((json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.setState({
						employeesSubDepartmentsData: DATA || [],
					});
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
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
					console.log(error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.",	"error");
				}
			}
		);
		this.setState({ employeesSubDepartmentsDataLoading: false });
	};

	loadData = async (userId, fromDate) => {
		let data = new FormData();
		data.append("userId", userId);
		if(fromDate){
			data.append("fromDate", format(new Date(parseInt(fromDate)), "dd-MM-yyyy"));
		}
		// this.setState({ employeesSubDepartmentsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/ViewByUserIdAndFromDate`;
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
		.then((json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					const row = (Array.isArray(DATA) && DATA.length > 0) ? DATA[0] : null;
					if (!row) {
						this.handleOpenSnackbar("No data found.", "info");
						return;
					}
					this.setState({
						fromDate: (fromDate != null) ? toStartOfDay(row.fromDate) : this.state.fromDate,
						employeeId: row.userId,
						employeesRolesArray: row.roles || [],
						employeesEntitiesArray: row.entities || [],
						employeesDepartmentsArray: row.departments || [],
						employeesSubDepartmentsArray: row.subDepartments || []
					});
					this.getEmployeesEntitiesData(row.roles || []);
					this.getEmployeesDepartmentsData(row.entities || []);
					this.getEmployeesSubDepartmentsData(row.entities || [], row.departments || []);
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
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
					console.log(error);
					this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.",	"error");
				}
			}
		);
		// this.setState({ employeesSubDepartmentsDataLoading: false });
	};

	isFormValid = () => {
		
		let isValid = true;

		let {
			employeesRolesArrayError,
			employeesEntitiesArrayError,
		} = this.state;

		this.setState({
			employeesRolesArrayError,
			employeesEntitiesArrayError,
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

			parmUserId : 0,
			parmFromDate : 0,
			fromDate: startOfDay(new Date()),

			employeeId: 0,
			
			employeesRolesArray: [],
			employeesRolesArrayError: "",

			employeesEntitiesArray: [],
			employeesEntitiesArrayError: "",
			employeesEntitiesData: [],
			employeesEntitiesDataLoading: false,

			employeesDepartmentsArray: [],
			employeesDepartmentsArrayError: "",
			employeesDepartmentsData: [],
			employeesDepartmentsDataLoading: false,

			employeesSubDepartmentsArray: [],
			employeesSubDepartmentsArrayError: "",
			employeesSubDepartmentsData: [],
			employeesSubDepartmentsDataLoading: false
		
		});

		window.location.replace("#/dashboard/F84Form/0/0");
	
	};

	onFormSubmit = async (e) => {
		
		e.preventDefault();

		const data = new FormData(e.target);

		const roleIdsArray = this.state.employeesRolesArray || [];
		roleIdsArray.forEach(role => {
			data.append("roleIds", role["id"]);
		});
		
		const entityIdsArray = this.state.employeesEntitiesArray || [];
		entityIdsArray.forEach(entity => {
			data.append("entityIds", entity["id"]);
		});

		const departmentIdsArray = this.state.employeesDepartmentsArray || [];
		departmentIdsArray.forEach(department => {
			data.append("departmentIds", department["id"]);
		});

		const subDepartmentIdsArray = this.state.employeesSubDepartmentsArray || [];
		subDepartmentIdsArray.forEach(subDepartment => {
			data.append("subDepartmentIds", subDepartment["id"]);
		});

		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C84CommonEmployeesRolesAssignment/Save`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					this.handleOpenSnackbar(USER_MESSAGE, "success");
					if(this.state.parmUserId!==0 && this.state.parmFromDate!==0){
						window.location.replace("#/dashboard/F84Reports");
					} else {
						this.resetForm();
					}
				} else {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error");
				}
			},
			(error) => {
				const { status } = error;
				console.log(error);
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error" );
				}
			}
		);
		this.setState({ isLoading: false });
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		switch (name) {
			case "employeeId": 
		    	const selectedEmployeeId = parseInt(value, 10) || 0;
		     	this.setState({ employeeId: selectedEmployeeId });
		     	if (selectedEmployeeId) {
		       		this.loadData(selectedEmployeeId, null);
		     	} else {
		       		// reset dependent selections
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
				this.getEmployeesSubDepartmentsData(this.state.employeesEntitiesArray || [], value || []);
				break;
			default:
				
		}

		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	viewReport = () => {
		window.location = "#/dashboard/F84Reports";
	};

	componentDidMount() {
		const {isDrawerOpen=false, setDrawerOpen=()=>{}} = this.props;
		const {parmUserId, parmFromDate} = this.state;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
		this.loadUsers();
		this.getEmployeesRolesData();
		if (parmUserId !== 0 && parmFromDate !== 0) {
			// alert(parmUserId+" - "+parmFromDate);
			this.loadData(parmUserId, parmFromDate);
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
					<TextField type="hidden" name="id" value={this.state.employeeId} />
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
								Employees Roles Assignment
							</Typography>
							<Divider
								className={classes.divider}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DatePicker
								autoOk
								id="fromDate"
								name="fromDate"
								label="From Date"
								invalidDateMessage = ""
								placeholder = ""
								variant="inline"
								inputVariant="outlined"
								format="dd-MM-yyyy"
								fullWidth
								required
								value={this.state.fromDate}
								onChange={(date) =>
									this.onHandleChange({
										target: { name: "fromDate", value: date },
									})
								}
								readOnly={this.state.parmFromDate !== 0}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Autocomplete
								id="employee"
								// 🏷️ Safely build the label
								getOptionLabel={(option) =>
									option && typeof option === "object" ? `${option.id} - ${option.label || ""}` : ""
								}
								options={this.state.employeeData || []}
								value={(this.state.employeeData || []).find(e => e.id === this.state.employeeId) || null}
								 // 🔑 Tell Autocomplete how to compare option vs value
								getOptionSelected={(option, value) => option?.id === value?.id}
								onChange={(event, value) => {
									this.onHandleChange({ target: { name: "employeeId", value: value?.id || 0 }})
								}}
								disabled={this.state.parmUserId !== 0}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (<TextField 
										{...params} 
										label="Employee"
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
											key={"tagValue"+index}
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
											key={"entitiesChip-"+index}
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
											key={"departmentChip-"+index}
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
											key={"subDepartmentChip-"+index}
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
					</Grid>
					<input type="submit" style={{ display: "none" }} id="btn-submit" />
				</form>
				<BottomBar
					leftButtonText="View"
					leftButtonHide={false}
					bottomLeftButtonAction={() => this.viewReport()}
					disableRightButton={!this.state.employeeId}
					otherActions={<Button color="primary" onClick={this.resetForm}>Reset</Button>}
					right_button_text="Save"
					bottomRightButtonAction={() => this.clickOnFormSubmit()}
					loading={this.state.isLoading}
					isDrawerOpen={this.props.isDrawerOpen}
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
	isDrawerOpen: true
};

export default withStyles(styles)(F84Form);
