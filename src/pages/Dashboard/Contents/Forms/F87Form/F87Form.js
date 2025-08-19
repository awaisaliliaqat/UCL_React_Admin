import React, { Component, Fragment, useEffect } from "react";
import { Divider, Typography, Chip, Grid, TextField, Box, CircularProgress, MenuItem, Button, } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/styles";
import { Autocomplete } from "@material-ui/lab";
import { useDropzone } from "react-dropzone";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { da } from "date-fns/locale";

const useStyles = makeStyles((theme) => ({
	fileBox: {
		padding: "0.5em 0",
		cursor: "pointer",
		border: `1px solid ${theme.palette.primary.contrastText}`,
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
			color: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.main}`,
		},
	},
}));

function MyDropzone({ files, onChange, onReject, disabled }) {
	
	const classes = useStyles();

	const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB in bytes

	const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
		accept:  [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"application/vnd.ms-powerpoint",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"text/plain",
			"image/*"
		],
		noClick: false,
		multiple: false,
		validator: (file) => {
			const forbiddenExtensions = [".exe", ".msi", ".sh", ".bat", ".cmd", ".scr"];
			const fileName = file.name.toLowerCase();
			// Check forbidden extensions
			for (const ext of forbiddenExtensions) {
				if (fileName.endsWith(ext)) {
				return {
					code: "forbidden-file-type",
					message: "Executable files are not allowed.",
				};
				}
			}
			// Check file size
			if (file.size > MAX_FILE_SIZE) {
				return {
					code: "file-too-large",
					message: "File size exceeds maximum limit of 20 MB.",
				};
			}
			return null;
		},
	});

	useEffect(() => {
		if (fileRejections.length > 0 && onReject) {
			const messages = fileRejections.map(({ file, errors }) => `${file.name} - ${errors.map(e => e.message).join(", ")}`).join("\n");
			// Call parent's handleOpenSnackbar function with message and severity
			onReject(messages, "error");
		}
	}, [fileRejections, onReject]);

	const fileList = acceptedFiles.map((file, index) => {
		const size = file.size > 0 ? (file.size / 1000).toFixed(2) : file.size;
		return (
			<span key={index}>
				{file.path} - {size} Kb
				<input type="hidden" name="documentName" value={file.path} />
			</span>
		);
	});

	const msg =	fileList.length > 0 && files.length > 0	? fileList : <span>Please click here to select a document</span>;
	//console.log({...getRootProps({className: "dropzone", onChange})})
	//console.log({...getInputProps()})
	return (
		<div
			style={{ textAlign: "center" }}
			{...getRootProps({
				className: "dropzone",
				onChange,
			})}
		>
			<Box
				bgcolor="primary.main"
				color="primary.contrastText"
				className={classes.fileBox}
				borderRadius={4}
			>
				<input
					name="contained-button-file"
					disabled={disabled}
					{...getInputProps()}
				/>
				{msg}
			</Box>
		</div>
	);
}

const styles = (theme) => ({
	root: {
		paddingBottom: theme.spacing(8),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: 0.3,
		width: "100%",
	},
	container: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		marginBottom: 10,
		marginTop: 10
	},
	item: {
		display: 'flex',
		flexDirection: 'column',
	},
	resize: {
		padding: 10
	},
	actions: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 26,
		justifyContent: "center"
	},
	label: {
		textAlign: 'left',
		font: 'bold 14px Lato',
		letterSpacing: 0,
		color: '#174A84',
		opacity: 1,
		marginBottom: 5,
		inlineSize: 'max-content'
	},
	button: {
		textTransform: 'capitalize',
		backgroundColor: '#174A84',
		fontSize: 16,
		paddingTop: 6,
		paddingLeft: 20,
		paddingRight: 20,

	}
});

class F87Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			uploadLoading: false,
			files: [],
			filesError: "",
			isLoginMenu: false,
			studentMenuItemsLoading: false,
			studentsMenuItems: [],
			student: null,
			employeeError : "",
			label: "",
			labelError: "",
			description: "",
			descriptionError: "",
			sortOrder: "",
			sortOrderError: "",

			// filters
			studentId: "",
			studentName: "",
			programmeId: "",
			programmeGroupId: "",
			academicSessionId: "",

			academicSessionMenuItems: [],
			programmeGroupsMenuItems: [],
			programmeIdMenuItems: [],
		};
		// memoized values holder
		this._filterValues = null;
		this._filterValuesSnapshot = null;
	}

	handleOpenSnackbar = (msg, severity) => {
		this.setState({
			isOpenSnackbar: true,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") return;
		this.setState({ isOpenSnackbar: false });
	};

	loadAcademicSessions = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonAcademicSessionsView`;
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
		})
		.then((res) => {
			if (!res.ok) throw res;
			return res.json();
		})
		.then((json) => {
			if (json.CODE === 1) {
				let array = json.DATA || [];
				let active = array.find((obj) => obj.isActive === 1);
				this.setState({
					academicSessionMenuItems: array,
					academicSessionId: active && active.ID,
				});
			} else {
				this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
			}
		})
		.catch((error) => {
			if (error.status === 401) {
				this.setState({ isLoginMenu: true, isReload: false });
			} else {
				this.handleOpenSnackbar("Failed to fetch! Please try Again later.", "error");
				console.error(error);
			}
		});
		this.setState({ isLoading: false });
	};

	getProgrammeGroups = async (academicSessionId) => {
		const data = new FormData();
		data.append("academicSessionId", academicSessionId || 0);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/CommonProgrammeGroupsView`;
		await fetch(url, {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
		})
		.then((res) => {
			if (!res.ok) throw res;
			return res.json();
		})
		.then((json) => {
			if (json.CODE === 1) {
				this.setState({ programmeGroupsMenuItems: json.DATA || [] });
			} else {
				this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
			}
		})
		.catch((error) => {
			if (error.status === 401) {
				this.setState({ 
					isLoginMenu: true, 
					isReload: true 
				});
			} else {
				this.handleOpenSnackbar("Failed to load Programme Groups! Try again later.", "error");
			}
		});
	};

	loadProgrammes = async (programmeGroupId) => {
		const data = new FormData();
		data.append("programmeGroupId", programmeGroupId || 0);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/CommonProgrammesView`;
		await fetch(url, {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
		})
		.then((res) => {
			if (!res.ok) throw res;
			return res.json();
		})
		.then((json) => {
			if (json.CODE === 1) {
				this.setState({ programmeIdMenuItems: json.DATA });
			} else {
				this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
			}
		})
		.catch((error) => {
			if (error.status === 401) {
				this.setState({ isLoginMenu: true, isReload: false });
			} else {
				this.handleOpenSnackbar("Failed to fetch programmes! Try again later.", "error");
			}
		});
		this.setState({ isLoading: false });
	};

	isFormValid = () => {

		const { files, student, label, sortOrder } = this.state;
		console.log({files});
		const errors = {
			filesError: "",
			employeeError: "",
			labelError: "",
			sortOrderError: "",
		};

		// files: must be a non-empty array

		if (!files || files.length === 0) {
			errors.filesError = "Please select a file.";
		}

		// student: must be truthy (adjust if you require student.id etc.)
		if (!student) {
			errors.employeeError = "Please select an student.";
		}

		// label: required non-empty after trim
		const labelTrimmed = (label || "").trim();
		if (!labelTrimmed) {
			errors.labelError = "Please enter a document label.";
		}

		// sortOrder: allow 0; must be an integer >= 0
		const sortRaw = sortOrder != null ? String(sortOrder).trim() : "";
		if (sortRaw === "") {
			errors.sortOrderError = "Please enter.";
		} else {
			const sortNumber = Number(sortRaw);
			if (!Number.isFinite(sortNumber) || !Number.isInteger(sortNumber) || sortNumber < 0) {
			errors.sortOrderError = "Sort order must be a non-negative integer.";
			}
		}

		const isValid =
			!errors.filesError &&
			!errors.employeeError &&
			!errors.labelError &&
			!errors.sortOrderError;

		this.setState({ ...errors });

		if (!isValid) {
			this.handleOpenSnackbar("Please fix the highlighted fields.", "error");
		}

		return isValid;
	};



	handleUploadButtonClick = () => {
		if (this.isFormValid()) {
			document.getElementById("submit-button").click();
		}
	};

	handleFileChange = (event) => {
		const { files = [] } = event.target;
		if (files.length > 0) {
			this.setState({ files, filesError: "" });
		}
	};

	onHandleChange = (e) => {
		let regex = "";
		const { name, value } = e.target;
		switch (name) {
			case "academicSessionId":
				this.getProgrammeGroups(value);
			break;
			case "programmeGroupId":
				this.loadProgrammes(value);
			break;
			case "student":
				if(value==null){
					this.setState({sortOrder: ""});
				} else {
					this.getSortOrder(value?.id || 0);
				}
			break;
			case "sortOrder":
				regex = new RegExp(/^\d*(\.\d{0,2})?$/);
				if (value && !regex.test(value)) {
					return;
				}
			break;
		default:
		}
		this.setState({ 
			[name]: value,
			[`${name}Error`] : ""
		});
	};

	handleResetForm = () => {
		this.setState({
			files: [],
			filesError: "",
			student: null,
			label: "",
			labelError: "",
			description: "",
			descriptionError: "",
		});
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		data.append("userId", this.state.student?.id || "");
		this.setState({ uploadLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/Save`;
		try {
			const res = await fetch(url, {
				method: "POST",
				body: data,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("uclAdminToken")}`,
				},
			});
			if (!res.ok) throw res;
			const result = await res.json();
			const { CODE, USER_MESSAGE, SYSTEM_MESSAGE } = result;
			if (CODE === 1) {
				this.handleOpenSnackbar("File uploaded successfully.", "success");
				this.handleResetForm();
			} else {
				console.error("Upload result:", result);
				this.handleOpenSnackbar(<span>{USER_MESSAGE}<br />{SYSTEM_MESSAGE}</span>, "error");
			}
		} catch (error) {
			if (error.status === 401) {
				this.setState({ isLoginMenu: true, isReload: false });
			} else {
				this.handleOpenSnackbar("Operation failed. Please try again later.", "error");
				console.error("Upload error:", error);
			}
		} finally {
			this.setState({ uploadLoading: false });
		}
	};

	viewReport = () => {
        window.location = "#/dashboard/F87Reports";
    }

	onClearFilters = () => {
		this.setState({
			studentId: "",
			studentName: "",
			programmeId: "",
			programmeGroupId: "",
			academicSessionId: "",
		});
	};

	getData = async () => {
		const data =  new FormData();
		data.append("studentId", this.state.studentId || 0);
		data.append("studentName", this.state.studentName || "");
		data.append("programmeGroupId", this.state.programmeGroupId || 0);
		data.append("academicSessionId" ,this.state.academicSessionId || 0);
		data.append("programmeId", this.state.programmeId || 0);
		this.setState({ studentMenuItemsLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/StudentsView`;
		await fetch(url, {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
		})
			.then((res) => {
				if (!res.ok) throw res;
				return res.json();
			})
			.then((json) => {
				if (json.CODE === 1) {
					this.setState({
						studentsMenuItems: json.DATA || [],
						totalStudents: (json.DATA || []).length,
					});
				} else {
					this.handleOpenSnackbar(`${json.SYSTEM_MESSAGE}\n${json.USER_MESSAGE}`, "error");
				}
			})
			.catch((error) => {
				if (error.status === 401) {
					this.setState({ isLoginMenu: true });
				} else {
					this.handleOpenSnackbar("Failed to fetch students! Try again later.", "error");
				}
			});
		this.setState({ studentMenuItemsLoading: false });
	};

	getSortOrder = async (studentId) => {
		const data =  new FormData();
		data.append("studentId", studentId || 0);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/SortOrderView`;
		try {
			const res = await fetch(url, {
				method: "POST",
				body: data,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("uclAdminToken") || ""}`,
				},
			});
			if (!res.ok) throw res;
			const json = await res.json();
			const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json || {};
			if (CODE === 1) {
				const data = Array.isArray(DATA) && DATA[0] ? DATA[0] : { sortOrder: 0 };
				this.onHandleChange({ target: { name: "sortOrder", value: data.sortOrder } });
			} else {
				this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error");
			}
		} catch(error) {
			// If you threw 'res', it has .status; network errors won't
			const status = error && error.status;
			if (status === 401) {
				this.setState({ isLoginMenu: true });
			} else {
				this.handleOpenSnackbar("Failed to fetch students! Try again later.", "error");
			}
		} finally {
			this.setState({ isLoading: false });
		}
	};

	componentDidMount() {
		const { isDrawerOpen, setDrawerOpen } = this.props;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
		this.loadAcademicSessions();
		this.getProgrammeGroups();
		//this.getEmployees();
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
				<form autoComplete="off" onSubmit={this.handleSubmit}>
					<Grid container spacing={2} className={classes.root}>
						<Grid item xs={12}>
							<Typography
								style={{ color: "#1d5f98", fontWeight: 600, textTransform: "capitalize" }}
								variant="h5"
							>
								Students Document Center
							</Typography>
							<Divider className={classes.divider} />
						</Grid>
						<Grid item xs={12}>
							<Grid container justifyContent="space-between" alignItems="center" spacing={2}>
								<Grid item xs={6} md={2}>
									<div className={classes.item}>
										<span className={classes.label}>Nucleus ID</span>
										<TextField
											placeholder="ID"
											variant="outlined"
											InputProps={{ classes: { input: classes.resize } }}
											value={this.state.studentId}
											name="studentId"
											onChange={e => { this.onHandleChange(e) }}
										/>
									</div>
								</Grid>
								<Grid item xs={6} md={2}>
									<div className={classes.item}>
										<span className={classes.label}>Name</span>
										<TextField
											placeholder="Name"
											variant="outlined"
											InputProps={{ classes: { input: classes.resize } }}
											value={this.state.studentName}
											name="studentName"
											onChange={e => { this.onHandleChange(e) }}
										/>
									</div>
								</Grid>
								<Grid item xs={4} md={2}>
								<div className={classes.item}>
									<span className={classes.label}>Academic Session</span>
									<TextField
										id="academicSessionId"
										name="academicSessionId"
										variant="outlined"
										value={this.state.academicSessionId}
										InputProps={{ classes: { input: classes.resize } }}
										onChange={e => {
											this.onHandleChange(e);
										}}
										//   error={!!values.academicSessionIdError}
										//   helperText={values.academicSessionIdError}
										select
									>
										{this.state.academicSessionMenuItems.map((dt, i) => (
											<MenuItem
												key={"academicSessionMenuItems" + dt.ID}
												value={dt.ID}
											>
												{dt.Label}
											</MenuItem>
										))}
									</TextField>
								</div>
								</Grid>
								<Grid item xs={4} md={2}>
								<div className={classes.item}>
									<span className={classes.label}>Programme Group</span>
									<TextField
										id="programmeGroupId"
										name="programmeGroupId"
										variant="outlined"
										value={this.state.programmeGroupId}
										InputProps={{ classes: { input: classes.resize } }}
										onChange={e => {
											this.onHandleChange(e);
										}}
										//   error={!!values.academicSessionIdError}
										//   helperText={values.academicSessionIdError}
										select
									>
										{this.state.programmeGroupsMenuItems.map((dt, i) => (
											<MenuItem
												key={"programmeGroupsMenuItems" + dt.Id}
												value={dt.Id}
											>
												{dt.Label}
											</MenuItem>
										))}
									</TextField>

								</div>
								</Grid>
								<Grid item xs={4} md={2}>
								<div className={classes.item}>
									<span className={classes.label}>Programme</span>
									<TextField
										id="programmeId"
										name="programmeId"
										variant="outlined"
										value={this.state.programmeId}
										InputProps={{ classes: { input: classes.resize } }}
										onChange={e => {
											this.onHandleChange(e);
										}}
										//   error={!!values.academicSessionIdError}
										//   helperText={values.academicSessionIdError}
										select
									>
										{this.state.programmeIdMenuItems.map((dt, i) => (
											<MenuItem
												key={"programmeIdMenuItems" + dt.ID}
												value={dt.ID}
											>
												{dt.Label}
											</MenuItem>
										))}
									</TextField>
								</div>
								</Grid>
								<Grid item xs={6} md={1}>
									<div className={classes.item}>
										<span className={classes.label}>&emsp;</span>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											disabled={this.state.isLoading || (!this.state.programmeId && !this.state.studentId && !this.state.studentName)}
											onClick={() => this.getData()}
										>
											{this.state.isLoading ? (
												<CircularProgress style={{ color: 'white' }} size={24} />
											) : (
												"Search"
											)}
										</Button>
									</div>
								</Grid>
								<Grid item xs={6} md={1}>
									<div className={classes.item}>
										<span className={classes.label}>&emsp;</span>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											onClick={() => this.onClearFilters()}
										>
											Clear
										</Button>
									</div>
								</Grid>
							</Grid>
							<br/>
							<Divider className={classes.divider}/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Autocomplete
								id="student"
								options={this.state.studentsMenuItems}
								getOptionLabel={(option) =>
									typeof option.label === "string" ? `${option.studentId} - ${option.label}` : ""
								}
								getOptionSelected={(option, value) => option.id === value.id}
								fullWidth
								loading={this.state.studentMenuItemsLoading}
								value={this.state.student}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "student", value },
									})
								}
								renderInput={(params) => {
									const inputProps = params.inputProps;
									return (<TextField 
										{...params} 
										label="Student"
										variant="outlined"
										error={!!this.state.employeeError}
										helperText={this.state.employeeError}
										required
										inputProps={inputProps}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<React.Fragment>
													{this.state.studentMenuItemsLoading ? (
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
						<Grid item xs={12} sm={10} md={7}>
							<TextField
								label="Document Label"
								name="label"
								variant="outlined"
								value={this.state.label}
								onChange={this.onHandleChange}
								fullWidth
								required
								error={!!this.state.labelError}
								helperText={this.state.labelError}
							/>
						</Grid>
						<Grid item xs={12} sm={2} md={1}>
							<TextField
								label="Sort Order"
								name="sortOrder"
								variant="outlined"
								value={this.state.sortOrder}
								onChange={this.onHandleChange}
								fullWidth
								error={!!this.state.sortOrderError}
								helperText={this.state.sortOrderError}
								inputProps={{
									maxLength: 8, // restrict total characters
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Description"
								name="description"
								variant="outlined"
								value={this.state.description}
								onChange={this.onHandleChange}
								fullWidth
								multiline
								minRows={4}
								error={!!this.state.descriptionError}
								helperText={this.state.descriptionError}
							/>
						</Grid>
						<Grid item xs={12}>
							<MyDropzone
								files={this.state.files}
								onChange={this.handleFileChange}
								onReject={this.handleOpenSnackbar} // pass the function
								disabled={false}
							/>
							<Box
								display="flex"
								flexGrow="1"
								justifyContent="center"
								alignItems="center"
								color="error.main"
							>
								{this.state.filesError}
							</Box>
						</Grid>
					</Grid>
					<input id="submit-button" type="submit" style={{ display: "none" }} />
				</form>
				<BottomBar
					leftButtonText="View"
					leftButtonHide={false}
					bottomLeftButtonAction={() => this.viewReport()}
					right_button_text="Save"
					bottomRightButtonAction={this.handleUploadButtonClick}
					loading={this.state.uploadLoading || this.state.isLoading}
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

export default withStyles(styles)(F87Form);
