import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Switch, MenuItem, } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { alphabetExp, numberExp, emailExp, } from "../../../../../utils/regularExpression";
import PropTypes from "prop-types";
import DefineEmployeeRolesSection from "./Chunks/DefineEmployeeRolesSection";
import { DatePicker } from "@material-ui/pickers";

const styles = () => ({
	root: {
		paddingBottom: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	switch_track: {
		backgroundColor: "#ff000099",
	},
	switch_base: {
		color: "#ff000099",
		"&.Mui-disabled": {
			color: "#e886a9",
		},
		"&.Mui-checked": {
			color: "#95cc97",
		},
		"&.Mui-checked + .MuiSwitch-track": {
			backgroundColor: "#2da758d4",
		},
	},
	switch_primary: {
		"&.Mui-checked": {
			color: "#2da758d4",
		},
		"&.Mui-checked + .MuiSwitch-track": {
			backgroundColor: "#2da758d4",
		},
	},
});

class DefineEmployeeForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recordId: Number(this.props.match.params.recordId),
			isLoading: false,
			isReload: false,
			showPass: false,

			firstName: "",
			firstNameError: "",
			lastName: "",
			lastNameError: "",
			displayName: "",
			displayNameError: "",
			mobileNo: "",
			mobileNoError: "",
			secondaryMobileNo: "",
			secondaryMobileNoError: "",
			email: "",
			emailError: "",
			secondaryEmail: "",
			secondaryEmailError: "",
			discipline: "",
			disciplineError: "",
			jobStatusId: "",
			reportingTo: "",
			coordinationId: "",
			jobStatusIdError: "",
			reportingToError: "",
			address: "",
			addressError: "",
			password: "",
			passwordError: "",

			joiningDate: null,
			joiningDateError: "",

			shiftActivationDateError: "",
			shiftActivationDate: null,

			selectedDate: new Date("2014-08-18T21:11:54"),

			leavingDate: null,
			leavingDateError: "",

			isActive: 1,
			isActiveError: "",

			shiftId: "",
			allActiveShifts: [],
			shiftError: "",

			isCheque: 1,
			isChequeError: "",

			inactiveReasonsData: [],
			inactiveReasonsDataLoading: [],

			inactiveReasonId: "",
			inactiveReasonIdError: "",

			bankAccountNumber1: "",
			bankAccountNumber1Error: "",
			bankAccountNumber2: "",
			bankAccountNumber2Error: "",

			otherReason: "",
			otherReasonError: "",

			employeeComments: "",
			employeeCommentsError: "",

			jobStatusIdData: [],
			reportingStatusData: [],

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

	componentDidMount() {
		this.getEmployeesJobStatusData();
		this.getShifts();
		this.getEmployeesRolesData();
		this.getEmployeesReportingToData();
		this.getUserInactiveReasonsData();
		if (this.state.recordId != 0) {
			this.loadData(this.state.recordId);
		} else {
			this.getEmployeesDesignationsData([], [], []);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.match.params.recordId != nextProps.match.params.recordId) {
			if (nextProps.match.params.recordId != 0) {
				this.loadData(nextProps.match.params.recordId);
				this.setState({
					recordId: nextProps.match.params.recordId,
				});
			} else {
				window.location.reload();
			}
		}
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
									firstName,
									lastName,
									displayName,
									mobileNo,
									secondaryMobileNo,
									email,
									secondaryEmail,
									discipline,
									jobStatusId,
									joiningDate,
									leavingDate,
									address,
									password,
									employeesRolesArray = [],
									employeesEntitiesArray = [],
									employeesDepartmentsArray = [],
									employeesSubDepartmentsArray = [],
									employeesDesignationsArray = [],
									inactiveReasonId,
									bankAccountNumber1,
									bankAccountNumber2,
									otherReason,
									employeeComments,
									isActive,
									reportingToId,
									coordinationId,
									isBankAccount,
									bankAccount,
									shiftId,
								} = json.DATA[0];

								this.getEmployeesEntitiesData(employeesRolesArray);
								this.getEmployeesDepartmentsData(employeesEntitiesArray);
								this.getEmployeesSubDepartmentsData(
									employeesEntitiesArray,
									employeesDepartmentsArray
								);

								console.log();
								this.setState({
									firstName,
									lastName,
									displayName,
									mobileNo,
									secondaryMobileNo,
									email,
									secondaryEmail,
									discipline,
									jobStatusId,
									joiningDate,
									leavingDate,
									address,
									password,
									employeesRolesArray,
									employeesEntitiesArray,
									employeesDepartmentsArray,
									employeesSubDepartmentsArray,
									employeesDesignationsArray,
									inactiveReasonId: inactiveReasonId || "",
									otherReason,
									employeeComments,
									isActive,
									reportingTo: reportingToId,
									coordinationId,
									isCheque: isBankAccount === 0 ? 1 : 0,
									bankAccountNumber1,
									bankAccountNumber2,
									shiftId: shiftId,
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
			case "firstName":
			case "lastName":
			case "displayName":
				regex = new RegExp(alphabetExp);
				if (value && !regex.test(value)) {
					return;
				}
				break;
			case "mobileNo":
			case "secondaryMobileNo":
				regex = new RegExp(numberExp);
				if (value && !regex.test(value)) {
					return;
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
			case "isActive":
				this.setState({
					inactiveReasonId: "",
					inactiveReasonIdError: "",
					otherReason: "",
					otherReasonError: "",
					leavingDate: null,
					leavingDateError: "",
				});

			case "isCheque":
				this.setState({
					bankAccountNumber1: "",
					bankAccountNumber1Error: "",
					bankAccountNumber2: "",
					bankAccountNumber2Error: "",
					// otherReason: "",
					// otherReasonError: "",
				});
				// case "shiftId":
				//   this.setState({
				//     allActiveShifts: [],
				//     shiftId: "",
				//   });
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
			firstNameError,
			lastNameError,
			shiftError,
			displayNameError,
			mobileNoError,
			secondaryMobileNoError,
			emailError,
			disciplineError,
			jobStatusIdError,
			reportingToError,
			joiningDateError,
			shiftActivationDateError,
			addressError,
			passwordError,
			employeesRolesArrayError,
			employeesEntitiesArrayError,
			employeesDesignationsArrayError,
			inactiveReasonIdError,
			otherReasonError,
			isCheque,
			leavingDate,
			leavingDateError,
			bankAccountNumber1,
			bankAccountNumber1Error,
			// bankAccountNumber2,
			// bankAccountNumber2Error,
			shiftId,
		} = this.state;

		if (!this.state.firstName) {
			firstNameError = "Please enter first name";
			isValid = false;
		} else {
			firstNameError = "";
		}

		if (!this.state.lastName) {
			lastNameError = "Please enter last name";
			isValid = false;
		} else {
			lastNameError = "";
		}

		if (!this.state.shiftId) {
			shiftError = "Please Select a Shift";
			isValid = false;
		} else {
			shiftError = "";
		}

		if (!this.state.displayName) {
			displayNameError = "Please enter display name";
			isValid = false;
		} else {
			displayNameError = "";
		}

		if (!this.state.mobileNo) {
			mobileNoError = "Please enter a valid mobile number e.g 03001234567";
			isValid = false;
		} else {
			if (
				!this.state.mobileNo.startsWith("03") ||
				this.state.mobileNo.split("").length !== 11
			) {
				mobileNoError = "Please enter a valid mobile number e.g 03001234567";
				isValid = false;
			} else {
				mobileNoError = "";
			}
		}

		if (this.state.secondaryMobileNo) {
			if (
				!this.state.secondaryMobileNo.startsWith("03") ||
				this.state.secondaryMobileNo.split("").length !== 11
			) {
				secondaryMobileNoError =
					"Please enter a valid mobile number e.g 03001234567";
				isValid = false;
			} else {
				secondaryMobileNoError = "";
			}
		}

		if (!this.state.email) {
			emailError = "Please enter a valid email e.g name@domain.com";
			isValid = false;
		} else {
			regex = new RegExp(emailExp);
			if (!regex.test(this.state.email)) {
				emailError = "Please enter a valid email e.g name@domain.com";
				isValid = false;
			} else {
				emailError = "";
			}
		}

		if (this.state.secondaryEmail) {
			regex = new RegExp(emailExp);
			if (!regex.test(this.state.secondaryEmail)) {
				emailError = "Please enter a valid email e.g name@domain.com";
				isValid = false;
			} else {
				emailError = "";
			}
		} else {
			// Nothing
		}

		if (!this.state.discipline) {
			disciplineError = "Please enter discipline";
			isValid = false;
		} else {
			disciplineError = "";
		}

		if (!this.state.jobStatusId) {
			jobStatusIdError = "Please select the job status";
			isValid = false;
		} else {
			jobStatusIdError = "";
		}

		if (!this.state.reportingTo) {
			reportingToError = "Please select the reporting Status";
			isValid = false;
		} else {
			reportingToError = "";
		}

		if (!this.state.joiningDate) {
			joiningDateError = "Please select joining date";
			isValid = false;
		} else {
			joiningDateError = "";
		}

		// if (!this.state.shiftActivationDate) {
		//   shiftActivationDateError = "Please select Shift Activation date";
		//   isValid = false;
		// } else {
		//   shiftActivationDateError = "";
		// }

		// if (!this.state.address) {
		//     addressError = "Please enter present address"
		//     isValid = false;
		// } else {
		//     addressError = "";
		// }

		if (!this.state.password && this.state.recordId == 0) {
			passwordError = "Please enter temporary password";
			isValid = false;
		} else {
			passwordError = "";
		}

		if (!(this.state.employeesRolesArray?.length > 0)) {
			isValid = false;
			employeesRolesArrayError = "Please select roles";
		} else {
			employeesRolesArrayError = "";
		}

		if (!(this.state.employeesEntitiesArray?.length > 0)) {
			isValid = false;
			employeesEntitiesArrayError = "Please select entities";
		} else {
			employeesEntitiesArrayError = "";
		}
		
		if(this.state.recordId==0){
			if (!(this.state.employeesDesignationsArray?.length > 0)) {
				isValid = false;
				employeesDesignationsArrayError = "Please select designations";
			} else {
				employeesDesignationsArrayError = "";
			}
		}

		if (this.state.isActive == 0) {
			if (!this.state.inactiveReasonId) {
				isValid = false;
				inactiveReasonIdError = "Please select inactive reason";
			} else {
				inactiveReasonIdError = "";
				if (this.state.inactiveReasonId == 1 && !this.state.otherReason) {
					isValid = false;
					leavingDateError = "Please select leaving date";
					otherReasonError = "Please enter other reason";
				} else {
					otherReasonError = "";
					leavingDateError = "";
				}
			}
		}

		if (this.state.isCheque == 0) {
			if (!this.state.bankAccountNumber1) {
				isValid = false;
				bankAccountNumber1Error = "Please add Account number 1";
			} else {
				bankAccountNumber1Error = "";
				// if (this.state.inactiveReasonId == 1 && !this.state.otherReason) {
				//   isValid = false;
				//   otherReasonError = "Please enter other reason";
				// } else {
				//   otherReasonError = "";
				// }
			}
		}

		// if (this.state.isCheque == 0) {
		//   if (!this.state.bankAccountNumber2) {
		//     isValid = false;
		//     bankAccountNumber2Error = "Please add Account number 2";
		//   } else {
		//     bankAccountNumber2Error = "";
		// if (this.state.inactiveReasonId == 1 && !this.state.otherReason) {
		//   isValid = false;
		//   otherReasonError = "Please enter other reason";
		// } else {
		//   otherReasonError = "";
		// }
		// }
		// }
		console.info(isValid);
		this.setState({
			firstNameError,
			lastNameError,
			displayNameError,
			mobileNoError,
			secondaryMobileNoError,
			emailError,
			disciplineError,
			jobStatusIdError,
			joiningDateError,
			addressError,
			passwordError,
			employeesRolesArrayError,
			employeesEntitiesArrayError,
			employeesDesignationsArrayError,
			inactiveReasonIdError,
			otherReasonError,
			leavingDateError,
			shiftError,
			reportingToError,
			shiftActivationDateError,
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

			firstName: "",
			firstNameError: "",
			lastName: "",
			lastNameError: "",
			displayName: "",
			displayNameError: "",
			mobileNo: "",
			mobileNoError: "",
			secondaryMobileNo: "",
			secondaryMobileNoError: "",
			email: "",
			emailError: "",
			secondaryEmail: "",
			secondaryEmailError: "",
			discipline: "",
			disciplineError: "",
			jobStatusId: "",
			jobStatusIdError: "",
			reportingTo: "",
			reportingToError: "",
			joiningDate: null,
			joiningDateError: "",

			shiftActivationDateError: "",
			shiftActivationDate: null,
			leavingDate: null,
			leavingDateError: "",
			address: "",
			addressError: "",
			password: "",
			passwordError: "",

			allActiveShifts: [],
			shiftId: "",

			isActive: 1,
			isActiveError: "",

			isCheque: 1,
			isChequeError: "",

			inactiveReasonId: "",
			inactiveReasonIdError: "",

			otherReason: "",
			otherReasonError: "",

			employeeComments: "",
			employeeCommentsError: "",

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
	getShifts = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C335CommonEmployeeShiftScheduleAllActive`;
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
					console.log(json);
					if (json.CODE === 1) {
						this.setState({
							allActiveShifts: json.DATA || [],
						});
					} else {
						this.handleOpenSnackbar(
							json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
							"error"
						);
					}
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
							"Failed to Get Job Status Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getEmployeesJobStatusData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesJobStatusTypesView`;
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
							jobStatusIdData: json.DATA || [],
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
							"Failed to Get Job Status Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getEmployeesReportingToData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersView`;
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
							reportingStatusData: json.DATA || [],
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
							"Failed to Get Job Status Data ! Please try Again later.",
							"error"
						);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getUserInactiveReasonsData = async () => {
		this.setState({ inactiveReasonsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersInactiveReasonsTypesView`;
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
							inactiveReasonsData: json.DATA || [],
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
		this.setState({ inactiveReasonsDataLoading: false });
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
		// const date = new Date();
		// const day = String(date.getDate()).padStart(2, "0");
		// const month = String(date.getMonth() + 1).padStart(2, "0");
		// const year = date.getFullYear();
		// const formattedDate = `${day}-${month}-${year}`;
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
		data.append("reportingToId", this.state.reportingTo);
		data.append("coordinationId", this.state.coordinationId);
		data.append("isBankAccount", !this.state.isCheque ? 1 : 0);
		if (this.state.recordId !== 0) {
			data.append("shiftId", null);
		} else {
			data.append("shiftId", this.state.shiftId);
		}
		// data.append("shiftStartDate", formattedDate);
		// data.append("leavingDate", null);
		// data.append("bankAccountNumber1", this.state.bankAccountNumber1);
		// data.append("bankAccountNumber2", this.state.bankAccountNumber2);
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
		window.location = "#/dashboard/employee-reports";
	};

	handleClickShowPassword = () => {
		const { showPass } = this.state;
		this.setState({
			showPass: !showPass,
		});
	};

	handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

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
					<Grid container component="main" className={classes.root}>
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								borderBottom: "1px solid #d2d2d2",
								width: "98%",
								marginBottom: 25,
								fontSize: 20,
							}}
							variant="h5"
						>
							Define Employee
						</Typography>
						<Divider
							style={{
								backgroundColor: "rgb(58, 127, 187)",
								opacity: "0.3",
							}}
						/>
						<Grid
							container
							spacing={2}
							style={{
								marginLeft: 5,
								marginRight: 15,
							}}
						>
							<Grid item xs={4}>
								<TextField
									id="firstName"
									name="firstName"
									label="First Name"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.firstName}
									error={!!this.state.firstNameError}
									helperText={this.state.firstNameError}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="lastName"
									name="lastName"
									label="Last Name"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.lastName}
									error={!!this.state.lastNameError}
									helperText={this.state.lastNameError}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="displayName"
									name="displayName"
									label="Display Name"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.displayName}
									error={!!this.state.displayNameError}
									helperText={this.state.displayNameError}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="mobileNo"
									name="mobileNo"
									label="Primary Mobile Number"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.mobileNo}
									helperText={this.state.mobileNoError}
									error={!!this.state.mobileNoError}
									inputProps={{
										maxLength: 11,
									}}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="secondaryMobileNo"
									name="secondaryMobileNo"
									label="Secondary Mobile Number"
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.secondaryMobileNo}
									helperText={this.state.secondaryMobileNoError}
									error={!!this.state.secondaryMobileNoError}
									inputProps={{
										maxLength: 11,
									}}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="email"
									name="email"
									label="Primary Email"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.email}
									helperText={this.state.emailError}
									error={!!this.state.emailError}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="secondaryEmail"
									name="secondaryEmail"
									label="Secondary Email"
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.secondaryEmail}
									helperText={this.state.secondaryEmailError}
									error={!!this.state.secondaryEmailError}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="discipline"
									name="discipline"
									label="Discipline"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.discipline}
									helperText={this.state.disciplineError}
									error={!!this.state.disciplineError}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="jobStatusId"
									name="jobStatusId"
									label="Job Status"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.jobStatusId}
									helperText={this.state.jobStatusIdError}
									error={!!this.state.jobStatusIdError}
									select
								>
									{this.state.jobStatusIdData.map((item) => {
										return (
											<MenuItem key={item.ID} value={item.ID}>
												{item.Label}
											</MenuItem>
										);
									})}
								</TextField>
							</Grid>
							<Grid item xs={12} md={4}>
								<DatePicker
									autoOk
									id="joiningDate"
									name="joiningDate"
									label="Joining Date"
									invalidDateMessage=""
									placeholder=""
									variant="inline"
									inputVariant="outlined"
									format="dd-MM-yyyy"
									fullWidth
									required
									value={this.state.joiningDate}
									onChange={(date) =>
										this.onHandleChange({
											target: { name: "joiningDate", value: date },
										})
									}
									error={!!this.state.joiningDateError}
									helperText={this.state.joiningDateError}
								/>
							</Grid>

							{/* <Grid item xs={4}>
																<TextField
																		id="address"
																		name="address"
																		label="Present Address"
																		required
																		fullWidth
																		variant="outlined"
																		onChange={this.onHandleChange}
																		value={this.state.address}
																		helperText={this.state.addressError}
																		error={this.state.addressError}
																/>
														</Grid> */}
							{(!this.state.recordId || this.state.recordId == 0) && (
								<Grid item xs={4}>
									<TextField
										id="password"
										name="password"
										label="Temporary Password"
										required
										fullWidth
										variant="outlined"
										type={this.state.showPass ? "text" : "password"}
										onChange={this.onHandleChange}
										value={this.state.password}
										helperText={this.state.passwordError}
										error={!!this.state.passwordError}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={() => this.handleClickShowPassword()}
														onMouseDown={this.handleMouseDownPassword}
													>
														{this.state.showPass ? (
															<Visibility />
														) : (
															<VisibilityOff />
														)}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
							)}

							<Grid item xs={4}>
								{/* <TextField
									id="reportingTo"
									name="reportingTo"
									label="Primary Reporting To"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.reportingTo}
									helperText={this.state.reportingToError}
									error={this.state.reportingToError}
									select
								>
									{this.state.reportingStatusData.map((item) => {
										return (
											<MenuItem key={item.id} value={item.id}>
												{item.label}
											</MenuItem>
										);
									})}
								</TextField> */}
								<Autocomplete
									id="reportingTo"
									name="reportingTo"
									options={this.state.reportingStatusData}
									getOptionLabel={(option) => option.label}
									value={
										this.state.reportingStatusData.find(
											(item) => item.id === this.state.reportingTo
										) || null
									}
									onChange={(event, newValue) => {
										this.setState({ reportingTo: newValue ? newValue.id : "" });
									}}
									renderInput={(params) => (
										<TextField
											style={{
												marginTop: "0px",
												marginBottom: "0px",
											}}
											{...params}
											label="Primary Reporting To"
											margin="normal"
											variant="outlined"
											helperText={this.state.reportingToError}
											error={!!this.state.reportingToError}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={4}>
								{/* <TextField
									id="coordinationId"
									name="coordinationId"
									label="Coordination"
									// required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.coordinationId}
									// helperText={this.state.reportingToError}
									// error={this.state.reportingToError}
									select
								>
									<MenuItem key={""} value={null}>
										{"None"}
									</MenuItem>
									{this.state.reportingStatusData.map((item) => {
										return (
											<MenuItem key={item.id} value={item.id}>
												{item.label}
											</MenuItem>
										);
									})}
								</TextField> */}
								<Autocomplete
									id="coordinationId"
									name="coordinationId"
									options={[
										{ id: 0, label: "None" },
										...this.state.reportingStatusData,
									]}
									getOptionLabel={(option) => option.label}
									value={
										this.state.coordinationId !== null
											? this.state.reportingStatusData.find(
												(item) => item.id === this.state.coordinationId
											) || { id: null, label: "None" }
											: { id: 0, label: "None" }
									}
									onChange={(event, newValue) => {
										this.setState({
											coordinationId: newValue ? newValue.id : 0,
										});
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											style={{
												marginTop: "0px",
												marginBottom: "0px",
											}}
											label="Coordination With"
											margin="normal"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</Grid>

							<Grid item xs={4}>
								<TextField
									id="shiftId"
									name="shiftId"
									label="Shift"
									required
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.shiftId}
									helperText={this.state.shiftError}
									error={!!this.state.shiftError}
									disabled={this?.state?.recordId !== 0}
									select
								>
									{this?.state?.allActiveShifts?.map((item) => {
										return (
											<MenuItem key={item.id} value={item.id}>
												{item.label}
											</MenuItem>
										);
									})}
								</TextField>
							</Grid>
							{/* <Grid item xs={12} md={4}>
								<DatePicker
									autoOk
									id="shiftActivationDate"
									name="shiftActivationDate"
									label="Shift Activation Date"
									invalidDateMessage=""
									placeholder=""
									variant="inline"
									inputVariant="outlined"
									format="dd-MM-yyyy"
									fullWidth
									required
									value={this.state.shiftActivationDate}
									onChange={(date) =>
										this.onHandleChange({
											target: { name: "shiftActivationDate", value: date },
										})
									}
									error={!!this.state.shiftActivationDateError}
									helperText={this.state.shiftActivationDateError}
								/>
							</Grid> */}
							{/* <Grid item xs={4}>
								<KeyboardTimePicker
									id="selectedDate"
									name="selectedDate"
									label="Select Time"
									required
									fullWidth
									style={{
										marginTop: "0px",
									}}
									variant="outlined"
									margin="normal"
									value={this.state.selectedDate}
									onChange={this.handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change time",
									}}
									InputProps={{
										variant: "outlined",
									}}
									inputVariant="outlined"
								/>
							</Grid> */}
							<Grid item xs={12}>
								<Grid container justifyContent="flex-start" alignItems="center"	spacing={1}>
									<Grid item xs={4}>
										<Typography component="span">
											Inactive
										</Typography>
										<Switch
											classes={{
												track: classes.switch_track,
												switchBase: classes.switch_base,
												colorPrimary: classes.switch_primary,
											}}
											id="isActive"
											color="primary"
											checked={this.state.isActive == 1}
											onChange={(e, checked) =>
												this.onHandleChange({
													target: {
														name: "isActive",
														value: checked ? 1 : 0,
													},
												})
											}
										/>
										<Typography component="span">
											Active
										</Typography>
									</Grid>
									{!this.state.isActive && (
									<>
									<Grid item xs={4}>
										<TextField
											id="inactiveReasonId"
											name="inactiveReasonId"
											label="Inactive Reason"
											required
											fullWidth
											variant="outlined"
											onChange={this.onHandleChange}
											value={this.state.inactiveReasonId}
											helperText={this.state.inactiveReasonIdError}
											error={!!this.state.inactiveReasonIdError}
											select
										>
											{this.state.inactiveReasonsData.map((item) => {
												return (
													<MenuItem key={item.id} value={item.id}>
														{item.label}
													</MenuItem>
												);
											})}
										</TextField>
									</Grid>
									{this.state.inactiveReasonId == 1 && (
										<>
											<Grid item xs={12} md={4}>
												<DatePicker
													autoOk
													id="leavingDate"
													name="leavingDate"
													label="Leaving Date"
													invalidDateMessage=""
													disabled={!this.state.joiningDate}
													minDate={this.state.joiningDate}
													placeholder=""
													variant="inline"
													inputVariant="outlined"
													format="dd-MM-yyyy"
													fullWidth
													required
													value={this.state.leavingDate}
													onChange={(date) =>
														this.onHandleChange({
															target: { name: "leavingDate", value: date },
														})
													}
													error={!!this.state.leavingDateError}
													helperText={this.state.leavingDateError}
												/>
											</Grid>
											<Grid item xs={12}>
												<TextField
													multiline
													minRows={3}
													id="otherReason"
													name="otherReason"
													label="Other Reason"
													required
													fullWidth
													variant="outlined"
													onChange={this.onHandleChange}
													value={this.state.otherReason}
													helperText={this.state.otherReasonError}
													error={!!this.state.otherReasonError}
												/>
											</Grid>
										</>
										)}
									</>
									)}
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Grid container	spacing={2}>
									<Grid item xs={4}>
										<Typography component="span">Bank Account</Typography>
										<Switch
											classes={{
												track: classes.switch_track,
												switchBase: classes.switch_base,
												colorPrimary: classes.switch_primary,
											}}
											id="isCheque"
											color="primary"
											checked={this.state.isCheque == 1}
											onChange={(e, checked) =>
												this.onHandleChange({
													target: {
														name: "isCheque",
														value: checked ? 1 : 0,
													},
												})
											}
										/>
										<Typography component="span">Cheque</Typography>
									</Grid>
									{!this.state.isCheque && (
										<>
										<Grid item xs={4}>
											<TextField
												id="bankAccountNumber1"
												name="bankAccountNumber1"
												label="SCB Account Number"
												required
												type="number"
												fullWidth
												variant="outlined"
												onChange={this.onHandleChange}
												value={this.state.bankAccountNumber1}
												helperText={this.state.bankAccountNumber1Error}
												error={!!this.state.bankAccountNumber1Error}
											/>
										</Grid>
										<Grid item xs={4}>
											<TextField
												id="bankAccountNumber2"
												name="bankAccountNumber2"
												label="Faysal Bank Account Number"
												type="number"
												fullWidth
												variant="outlined"
												onChange={this.onHandleChange}
												value={this.state.bankAccountNumber2 || ""}
												helperText={this.state.bankAccountNumber2Error}
												error={!!this.state.bankAccountNumber2Error}
											/>
										</Grid>
										</>
									)}
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<TextField
									multiline
									minRows={3}
									id="employeeComments"
									name="employeeComments"
									label="Employee Comments"
									fullWidth
									variant="outlined"
									onChange={this.onHandleChange}
									value={this.state.employeeComments}
									helperText={this.state.employeeCommentsError}
									error={!!this.state.employeeCommentsError}
								/>
							</Grid>
							<DefineEmployeeRolesSection
								state={this.state}
								onHandleChange={(e) => this.onHandleChange(e)}
							/>
						</Grid>
					</Grid>
					<input type="submit" style={{ display: "none" }} id="btn-submit" />
				</form>
				<BottomBar
					leftButtonText="View"
					leftButtonHide={false}
					bottomLeftButtonAction={() => this.viewReport()}
					right_button_text="Save"
					bottomRightButtonAction={() => this.clickOnFormSubmit()}
					loading={this.state.isLoading}
					isDrawerOpen={this.props.isDrawerOpen}
				/>
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

DefineEmployeeForm.propTypes = {
	isDrawerOpen: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	match: PropTypes.object,
};

DefineEmployeeForm.defaultProps = {
	isDrawerOpen: true,
	match: {
		params: {
			recordId: 0,
		},
	},
};

export default withStyles(styles)(DefineEmployeeForm);
