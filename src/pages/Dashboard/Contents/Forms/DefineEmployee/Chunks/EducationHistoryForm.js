import React, { useState } from "react";
import {
    Grid, TextField, MenuItem, Button, Paper, TableContainer, Table,
    TableHead, TableBody, TableCell, TableRow, Box
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

const EducationHistoryForm = ({ educationTableData, setEducationTableData, handleOpenSnackbar }) => {

    const [educationForm, setEducationForm] = useState({
        institution: "",
        qualification: "",
        yearsOfQualification: "",
        educationLevel: "",
        fromDate: null,
        toDate: null,
        result: ""
    });

    const [editingIndex, setEditingIndex] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducationForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setEducationForm((prev) => ({ ...prev, [name]: date }));
    };

    const handleSave = () => {

        const { institution, qualification, yearsOfQualification } = educationForm;

        if (!institution || !qualification || !yearsOfQualification) {
            handleOpenSnackbar("Please fill all required fields.", "error");
            return;
        }

        if (editingIndex !== null) {
            const updated = [...educationTableData];
            updated[editingIndex] = educationForm;
            setEducationTableData(updated);
            setEditingIndex(null);
        } else {
            setEducationTableData([...educationTableData, educationForm]);
        }

        setEducationForm({
            institution: "",
            qualification: "",
            yearsOfQualification: "",
            educationLevel: "",
            fromDate: null,
            toDate: null,
            result: ""
        });
    };

    const handleEdit = (idx) => {
        setEducationForm(educationTableData[idx]);
        setEditingIndex(idx);
    };

    const handleRemove = (idx) => {
        const updated = [...educationTableData];
        updated.splice(idx, 1);
        setEducationTableData(updated);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
                <TextField
                    name="institution"
                    label="Institution Name"
                    required
                    fullWidth
                    variant="outlined"
                    value={educationForm.institution}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <TextField
                    name="qualification"
                    label="Qualification / Degree"
                    required
                    fullWidth
                    variant="outlined"
                    value={educationForm.qualification}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <TextField
                    name="yearsOfQualification"
                    label="Years of Qualification"
                    fullWidth
                    required
                    variant="outlined"
                    value={educationForm.yearsOfQualification}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <TextField
                    name="educationLevel"
                    label="Education Level"
                    fullWidth
                    variant="outlined"
                    select
                    value={educationForm.educationLevel}
                    onChange={handleChange}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="High School">High School</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Bachelor's">Bachelor’s</MenuItem>
                    <MenuItem value="Master's">Master’s</MenuItem>
                    <MenuItem value="Doctorate">Doctorate</MenuItem>
                    <MenuItem value="Certification">Certification</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
                <DatePicker
                    autoOk
                    clearable
                    name="fromDate"
                    label="Start Date"
                    inputVariant="outlined"
                    format="dd-MM-yyyy"
                    views={["year", "month", "date"]}
                    fullWidth
                    value={educationForm.fromDate}
                    onChange={(date) => handleDateChange("fromDate", date)}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <DatePicker
                    autoOk
                    clearable
                    name="toDate"
                    label="End Date / Graduation Date"
                    inputVariant="outlined"
                    format="dd-MM-yyyy"
                    views={["year", "month", "date"]}
                    fullWidth
                    value={educationForm.toDate}
                    onChange={(date) => handleDateChange("toDate", date)}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField
                    name="result"
                    label="Grade / GPA / Percentage"
                    fullWidth
                    variant="outlined"
                    value={educationForm.result}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12} md={3}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleSave}
                    fullWidth
                    style={{ height: 54 }}
                >
                    {editingIndex !== null ? "Update" : "Add"}
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Institution</StyledTableCell>
                                <StyledTableCell>Qualification</StyledTableCell>
                                <StyledTableCell>Field of Study</StyledTableCell>
                                <StyledTableCell>Level</StyledTableCell>
                                <StyledTableCell>Start</StyledTableCell>
                                <StyledTableCell>End</StyledTableCell>
                                <StyledTableCell>Result</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {educationTableData.length === 0 &&
                                <StyledTableRow><StyledTableCell colSpan={8} align="center">No Data</StyledTableCell></StyledTableRow>
                            }
                            {educationTableData.map((edu, idx) => (
                                <StyledTableRow key={idx}>
                                    <StyledTableCell>{edu.institution}</StyledTableCell>
                                    <StyledTableCell>{edu.qualification}</StyledTableCell>
                                    <StyledTableCell>{edu.yearsOfQualification}</StyledTableCell>
                                    <StyledTableCell>{edu.educationLevel}</StyledTableCell>
                                    <StyledTableCell>{edu.fromDate ? format(edu.fromDate, "dd-MM-yyyy") : ""}</StyledTableCell>
                                    <StyledTableCell>{edu.toDate ? format(edu.toDate, "dd-MM-yyyy") : ""}</StyledTableCell>
                                    <StyledTableCell>{edu.result}</StyledTableCell>
                                    <StyledTableCell style={{width:80}}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleEdit(idx)}
                                                style={{ padding: "1px 0px", minWidth: 36 }}
                                            >
                                                <EditOutlinedIcon />
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleRemove(idx)}
                                                style={{ padding: "1px 0px", minWidth: 36 }}
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
};

export default EducationHistoryForm;
