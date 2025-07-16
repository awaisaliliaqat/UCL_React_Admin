import React, { Component, Fragment, useEffect } from "react";
import { Divider, Typography, Chip, Grid, TextField, Box, } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/styles";
import { Autocomplete } from "@material-ui/lab";
import { useDropzone } from "react-dropzone";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

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
});

class F85Form extends Component {
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
			employeeMenuItemsLoading: false,
			employeesMenuItems: [],
			employee: null,
			label: "",
			labelError: "",
			description: "",
			descriptionError: "",
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
		if (reason === "clickaway") return;
		this.setState({ isOpenSnackbar: false });
	};

	getEmployees = async () => {
		this.setState({ employeeMenuItemsLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C360CommonEmployeesPayrollRequests/EmployeesView`;
		try {
			const res = await fetch(url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("uclAdminToken")}`,
				},
			});

			if (!res.ok) throw res;
			const json = await res.json();
			const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
			if (CODE === 1) {
				this.setState({ employeesMenuItems: DATA || [] });
			} else {
				this.handleOpenSnackbar(
					<span>{USER_MESSAGE}<br />{SYSTEM_MESSAGE}</span>,
					"error"
				);
			}
		} catch (error) {
			if (error.status === 401) {
				this.setState({ isLoginMenu: true, isReload: true });
			} else {
				console.error("getEmployees:", error);
				this.handleOpenSnackbar("Failed to get data. Please try again later.", "error");
			}
		} finally {
			this.setState({ employeeMenuItemsLoading: false });
		}
	};

	isFormValid = () => {
		const { files, employee, label } = this.state;
		let filesError = "";
		let employeeError = "";
		let labelError = "";
		let isValid = true;

		// Check files
		if (files.length <= 0) {
			filesError = "Please select a file.";
			isValid = false;
		}

		// Check employee
		if (!employee) {
			employeeError = "Please select an employee.";
			isValid = false;
		}

		// Check document label
		if (!label || label.trim() === "") {
			labelError = "Please enter document label.";
			isValid = false;
		}

		this.setState({
			filesError,
			employeeError,
			labelError
		});

		// Show general error if invalid
		if (!isValid) {
			this.handleOpenSnackbar("Please fill all required fields correctly.", "error");
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
		const { name, value } = e.target;
		switch (name) {
			case "employee":
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
			employee: null,
			label: "",
			labelError: "",
			description: "",
			descriptionError: "",
		});
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		data.append("userId", this.state.employee?.id || "");
		this.setState({ uploadLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C85CommonUsersDocuments/Save`;
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
        window.location = "#/dashboard/F85Reports";
    }

	componentDidMount() {
		const { isDrawerOpen, setDrawerOpen } = this.props;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
		this.getEmployees();
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
								Document Center
							</Typography>
							<Divider className={classes.divider} />
						</Grid>
						<Grid item xs={12} md={4}>
							<Autocomplete
								id="employee"
								options={this.state.employeesMenuItems}
								getOptionLabel={(option) =>
									typeof option.label === "string" ? `${option.id} - ${option.label}` : ""
								}
								getOptionSelected={(option, value) => option.id === value.id}
								fullWidth
								loading={this.state.employeeDataLoading}
								value={this.state.employee}
								onChange={(e, value) =>
									this.onHandleChange({
										target: { name: "employee", value },
									})
								}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Employee"
										error={!!this.state.employeeError}
										helperText={this.state.employeeError}
										required
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={8}>
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

export default withStyles(styles)(F85Form);
