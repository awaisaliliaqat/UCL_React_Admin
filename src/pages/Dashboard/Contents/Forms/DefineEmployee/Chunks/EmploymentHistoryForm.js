import React, { useState } from "react";
import { 
	Paper, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, 
	Button, Grid, TextField, MenuItem, Box, FormControlLabel, Checkbox
} from "@material-ui/core"; 
import { DatePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/styles";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { format } from "date-fns";


const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

const EmploymentHistoryForm = ({ employmentTableData, setEmploymentTableData, handleOpenSnackbar }) => {
	
	const [employmentForm, setEmploymentForm] = useState({
		organization: "",
		jobTitle: "",
		jobType: "",
		fromDate: null,
		toDate: null,
		isCurrent: false,
		description: "",
	});

	const [editingIndex, setEditingIndex] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEmploymentForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleDateChange = (name, date) => {
		setEmploymentForm((prev) => ({ ...prev, [name]: date }));
	};

	const handleCheckboxChange = (e) => {
		const { checked } = e.target;
		setEmploymentForm((prev) => ({
			...prev,
			isCurrent: checked,
			toDate: checked ? null : prev.toDate, // clear toDate if checked
		}));
	};

	const handleSave = () => {

		const { organization, jobTitle, jobType, fromDate, toDate } = employmentForm;

		if (!organization || !jobTitle || !jobType || !fromDate || (!employmentForm.isCurrent && !toDate)) {
			handleOpenSnackbar("Please fill all required fields.", "error");
			return;
		}

		if (editingIndex !== null) {
			const updated = [...employmentTableData];
			updated[editingIndex] = employmentForm;
			setEmploymentTableData(updated);
			setEditingIndex(null);
		} else {
			setEmploymentTableData([...employmentTableData, employmentForm]);
		}

		setEmploymentForm({
			organization: "",
			jobTitle: "",
			jobType: "",
			fromDate: null,
			toDate: null,
			isCurrent: false,
			description: "",
		});

	};

	const handleEdit = (idx) => {
		setEmploymentForm(employmentTableData[idx]);
		setEditingIndex(idx);
	};

	const handleRemove = (idx) => {
		const updated = [...employmentTableData];
		updated.splice(idx, 1);
		setEmploymentTableData(updated);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={4} xl={2}>
				<TextField
					name="organization"
					label="Organization"
					required
					fullWidth
					variant="outlined"
					value={employmentForm.organization}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12} md={4} xl={2}>
				<TextField
					name="jobTitle"
					label="Job Title"
					required
					fullWidth
					variant="outlined"
					value={employmentForm.jobTitle}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12} md={4} xl={2}>
				<TextField
					name="jobType"
					label="Employment Type"
					required
					fullWidth
					variant="outlined"
					select
					value={employmentForm.jobType}
					onChange={handleChange}
				>
					<MenuItem value=""><em>None</em></MenuItem>
					<MenuItem value="Full-time">Full-time</MenuItem>
					<MenuItem value="Part-time">Part-time</MenuItem>
					<MenuItem value="Contract">Contract</MenuItem>
					<MenuItem value="Intern">Intern</MenuItem>
					<MenuItem value="Freelance">Freelance</MenuItem>
					<MenuItem value="Other">Other</MenuItem>
				</TextField>
			</Grid>
			<Grid item xs={12} md={4} xl={2}>
				<DatePicker
					autoOk
					name="fromDate"
					label="From Date"
					inputVariant="outlined"
					format="dd-MM-yyyy"
					fullWidth
					required
					value={employmentForm.fromDate}
					onChange={(date) => handleDateChange("fromDate", date)}
				/>
			</Grid>
			<Grid item xs={12} md={4} xl={2}>
				<DatePicker
					autoOk
					name="toDate"
					label="To Date"
					inputVariant="outlined"
					format="dd-MM-yyyy"
					fullWidth
					required
					value={employmentForm.toDate}
					onChange={(date) => handleDateChange("toDate", date)}
				/>
			</Grid>
			<Grid item xs={6} md={2} xl={1}>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					border="1px solid #c4c4c4"
					height="54px"
					width="100%"
					style={{ borderRadius: 4 }}
				>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								checked={employmentForm.isCurrent}
								onChange={handleCheckboxChange}
							/>
						}
						label="Current"
						labelPlacement="end"
						style={{ margin: 0, marginRight: 11 }}
					/>
				</Box>
			</Grid>
			<Grid item xs={12} md={2} xl={1}>
				<Button
					color="primary"
					variant="outlined"
					onClick={handleSave}
					style={{ height: 54 }}
					fullWidth
				>
					{editingIndex !== null ? "Update" : "Add"}
				</Button>
			</Grid>
			<Grid item xs={12}>
				<TextField
					name="description"
					label="Key Responsibilities / Achievements"
					multiline
					minRows={3}
					required
					fullWidth
					variant="outlined"
					value={employmentForm.description}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<StyledTableRow>
								<StyledTableCell>Organization</StyledTableCell>
								<StyledTableCell>Job Title</StyledTableCell>
								<StyledTableCell>Employment Type</StyledTableCell>
								<StyledTableCell>From Date</StyledTableCell>
								<StyledTableCell>To Date</StyledTableCell>
								<StyledTableCell>Key Responsibilities</StyledTableCell>
								<StyledTableCell style={{width:80}}>Actions</StyledTableCell>
							</StyledTableRow>
						</TableHead>
						<TableBody>
							{employmentTableData.length===0 && 
								<StyledTableRow><StyledTableCell colSpan={8} align="center">No Data</StyledTableCell></StyledTableRow>
							}
							{employmentTableData.map((edu, idx) => (
								<StyledTableRow key={idx}>
									<StyledTableCell>{edu.organization}</StyledTableCell>
									<StyledTableCell>{edu.jobTitle}</StyledTableCell>
									<StyledTableCell>{edu.jobType}</StyledTableCell>
									<StyledTableCell>{edu.fromDate ? format(edu.fromDate, "dd-MM-yyyy") : ""}</StyledTableCell>
									<StyledTableCell>{edu.isCurrent ? "Current" : (edu.toDate ? format(edu.toDate,"dd-MM-yyyy") : "")}</StyledTableCell>
									<StyledTableCell>{edu.description}</StyledTableCell>
									<StyledTableCell >
										<Box display="flex" justifyContent="space-between">
											<Button
												variant="outlined"
												color="primary"
												size="small"
												onClick={() => handleEdit(idx)}
												style={{padding: "1px 0px", minWidth: 36}}
											>
												<EditOutlinedIcon />
											</Button>
											<Button
												variant="outlined"
												color="secondary"
												size="small"
												onClick={() => handleRemove(idx)}
												style={{padding: "1px 0px", minWidth: 36}}
											>
												<DeleteOutlineOutlinedIcon />
											</Button>
										</Box>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
}

export default EmploymentHistoryForm;