import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, CircularProgress, Collapse, Dialog, Divider, Grid, IconButton, List, ListItem, ListItemText, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Tooltip, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import { CloudDownload } from 'mdi-material-ui';
import OpenInBrowserOutlinedIcon from '@material-ui/icons/OpenInBrowserOutlined';
import { saveAs } from "file-saver";
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        overflowX: "visible",
        padding: `${theme.spacing(1)}px ${theme.spacing(0)}px ${theme.spacing(1)}px ${theme.spacing(2)}px` 
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    expand: {
        color: 'white',
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%"
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main, //theme.palette.common.black,
        color: theme.palette.primary.contrastText,
        fontWeight: 500,
        border: '1px solid white'
    },
    body: {
        fontSize: 14,
        border: theme.palette.primary.main
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const FileRepositoryPopup = ({ open, handleClose, row }) => {

    const classes = useStyles();

    const [studentData, setStudentData] = useState({});
    const [expanded, setExpanded] = useState([true, true, true, false, false]);
    const [downloadingFileName, setDownloadingFileName] = useState(null);
    const [covidVaccineCertificate, setCovidVaccineCertificate] = useState({isLoading: false, list:[]});
    const [admissionsProspectApplicationDocument, setAdmissionsProspectApplicationDocument] = useState({isLoading: false, list:[]});
    const [gradeBookReports, setGradeBookReports] = useState({isLoading: false, list:[]});
    const [assignments, setAssignments] = useState({isLoading: false, list:[]});

    const handleExpandClick = (index) => {
        const newExpanded = [...expanded];
        newExpanded[index] = !newExpanded[index];
        setExpanded(newExpanded); // ✅ set array, not object
    };

    const getCovidVaccineCertificate = async (studentId) => {
        let data = new FormData();
        data.append("studentId", studentId);
        setCovidVaccineCertificate( pre => ({...pre, isLoading: true}));
        let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentDocumentsView/CovidVaccineCertificateView`;
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
            (result) => {
                if (result.CODE === 1) {
                    let data = result.DATA || [];
                    setCovidVaccineCertificate( pre => ({...pre, list: data}));
                } else {
                    alert(result.SYSTEM_MESSAGE + "\n" + result.USER_MESSAGE)
                }
            },
            (error) => {
                alert("Operation Failed, Please try again later");
                console.log(error);
            }
        );
         setCovidVaccineCertificate( pre => ({...pre, isLoading: false}));
    };

    const getAdmissionsProspectApplicationDocuments = async (studentId) => {
        let data = new FormData();
        data.append("studentId", studentId);
        setAdmissionsProspectApplicationDocument( pre => ({...pre, isLoading: true}));
        let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentDocumentsView/AdmissionsProspectApplicationDocumentsView`;
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
            (result) => {
                if (result.CODE === 1) {
                    let data = result.DATA || [];
                    setAdmissionsProspectApplicationDocument( pre => ({...pre, list: data}));
                } else {
                    alert(result.SYSTEM_MESSAGE + "\n" + result.USER_MESSAGE)
                }
            },
            (error) => {
                alert("Operation Failed, Please try again later");
                console.log(error);
            }
        );
        setAdmissionsProspectApplicationDocument( pre => ({...pre, isLoading: false}));
    };

    const getGradeBookReportsList = async (studentId) => {
    console.log("[DEBUG] Fetching grade books for:", studentId); // Debug log
    let data = new FormData();
    data.append("studentId", studentId);
    setGradeBookReports(prev => ({...prev, isLoading: true, error: null}));

    try {
        let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentDocumentsView/ApprovedGradeBookReportsListView`;
        const response = await fetch(url, {
            method: "POST",
            body: data,
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        });

        if (!response.ok) throw response;
        const result = await response.json();
        
        console.log("[DEBUG] Grade books response:", result); // Debug log
        
        if (result.CODE === 1) {
            const gradeBooks = result.DATA || [];
            console.log("[DEBUG] Processed grade books:", gradeBooks); // Debug processed data
            setGradeBookReports(prev => ({
                ...prev, 
                list: gradeBooks,
                isLoading: false
            }));
        } else {
            console.error("API Error:", result.SYSTEM_MESSAGE, result.USER_MESSAGE);
            setGradeBookReports(prev => ({
                ...prev,
                isLoading: false,
                error: result.USER_MESSAGE
            }));
        }
    } catch (error) {
        console.error("Failed to fetch grade book reports:", error);
        setGradeBookReports(prev => ({
            ...prev,
            isLoading: false,
            error: "Failed to load grade book reports"
        }));
    }
};
    const getAssignmentsList = async (studentId) => {
        let data = new FormData();
        data.append("studentId", studentId);
        setAssignments( pre => ({...pre, isLoading: true}));
        let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentDocumentsView/SubmittedAssignmentsView`;
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
            (result) => {
                if (result.CODE === 1) {
                    let data = result.DATA || [];
                    setAssignments( pre => ({...pre, list: data}));
                } else {
                    alert(result.SYSTEM_MESSAGE + "\n" + result.USER_MESSAGE)
                }
            },
            (error) => {
                alert("Operation Failed, Please try again later");
                console.log(error);
            }
        );
        setAssignments( pre => ({...pre, isLoading: false}));
    };

    const downloadFile = (fileName) => {
        const data = new FormData();
        data.append("fileName", fileName);
        setDownloadingFileName(fileName);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
        fetch(url, {
            method: "GET",
            headers: new Headers({
               Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        })
        .then((res) => {
            if (res.ok) {
                return res.blob();
            } else if (res.status === 401) {
                throw new Error("Unauthorized");
            } else if (res.status === 404) {
                this.handleOpenSnackbar("File not found.", "error");
                throw new Error("File not found");
            } else {
                this.handleOpenSnackbar("Operation failed. Please try again later.", "error");
                throw new Error(`Download failed with status ${res.status}`);
            }
        })
        .then((blob) => {
            if (!blob) return; // Skip if aborted or errored
            saveAs(blob, fileName);
        })
        .catch((error) => {
            if (error.name === "AbortError") {
                this.handleOpenSnackbar("Download cancelled.", "warning");
            } else {
                console.error("Download error:", error);
            }
        })
        .finally(() => {
            setDownloadingFileName(null);
        });
    };

    useEffect(() => {
        if (open && row?.studentId) {
            let { id=0, studentId=0 } = row;
            setStudentData(row);
            getCovidVaccineCertificate(studentId);
            getAdmissionsProspectApplicationDocuments(studentId);
            getGradeBookReportsList(studentId);
            //getAssignmentsList(studentId);
        } else {
            setDownloadingFileName(null);
            setCovidVaccineCertificate({isLoading: false, list: []});
            setAdmissionsProspectApplicationDocument({isLoading: false, list: []});
            setAssignments({isLoading: false, list: []});
        }
    }, [row?.studentId, open]);

    const { studentId = 0, firstName = "", lastName = "" } = studentData;

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {studentId} - {firstName} {lastName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid
                container
                spacing={2}
                justifyContent='center'
                alignItems='center'
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
                    >
                        Document Repository
                    </Typography>
                    <Divider
                        className={classes.divider}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        display="flex"
                        justifyContent="space-between"
                        p={0.5}
                        style={{
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5
                        }}
                    >
                        <Box component="span" fontSize={"1.2em"}>Admissions Prospect Application Documents</Box>
                        <Box>
                            {
                                admissionsProspectApplicationDocument?.isLoading ? <CircularProgress style={{ color: 'white', marginTop: 4, marginRight: 8 }} size={18} />
                                    :
                                    <IconButton
                                        size='small'
                                        className={classnames(classes.expand, { [classes.expandOpen]: expanded[0] })}
                                        onClick={() => handleExpandClick(0)}
                                        aria-expanded={expanded[0]}
                                        aria-label="Show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                            }
                        </Box>
                    </Box>
                    <Collapse in={expanded[0]} timeout="auto" unmountOnExit>
                        <Grid container spacing={2} justifyContent='center' alignItems='center'>
                            <Grid item xs={12}>
                                <TableContainer component={Paper} style={{ marginTop: 8 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell>Label</StyledTableCell>
                                                <StyledTableCell>File Name</StyledTableCell>
                                                <StyledTableCell>Uploaded On</StyledTableCell>
                                                <StyledTableCell align='center' style={{width:50}}>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(admissionsProspectApplicationDocument.list || []).length === 0 &&
                                                <StyledTableRow><StyledTableCell colSpan={4} align="center">No Data</StyledTableCell></StyledTableRow>
                                            }
                                            {(admissionsProspectApplicationDocument.list || []).map((doc, idx) => (
                                                <StyledTableRow key={idx}>
                                                    <StyledTableCell>{doc.documentTypeLabel + (doc.otherDocumentTypeLabel ? " - "+doc.otherDocumentTypeLabel : "")}</StyledTableCell>
                                                    <StyledTableCell>{doc.fileName}</StyledTableCell>
                                                    <StyledTableCell>{doc.uploadedOn}</StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        {downloadingFileName === doc.fileName ? (
                                                            <CircularProgress size={18} />
                                                        ) 
                                                        :
                                                        (<Tooltip title="Download">
                                                            <IconButton style={{ padding: 6 }} onClick={() => downloadFile(doc.fileName)}>
                                                                <CloudDownload color='primary' />
                                                            </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
                {(covidVaccineCertificate?.list || []).length > 0 && (
                <Grid item xs={12}>
                    <Box
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        display="flex"
                        justifyContent="space-between"
                        p={0.5}
                        style={{
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5
                        }}
                    >
                        <Box component="span" fontSize={"1.2em"}>Covid Vaccine Certificate</Box>
                        <Box>
                            {
                                covidVaccineCertificate?.isLoading ? <CircularProgress style={{ color: 'white', marginTop: 4, marginRight: 8 }} size={18} />
                                    :
                                    <IconButton
                                        size='small'
                                        className={classnames(classes.expand, { [classes.expandOpen]: expanded[1] })}
                                        onClick={() => handleExpandClick(1)}
                                        aria-expanded={expanded[1]}
                                        aria-label="Show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                            }
                        </Box>
                    </Box>
                    <Collapse in={expanded[1]} timeout="auto" unmountOnExit>
                        <Grid container spacing={2} justifyContent='center' alignItems='center'>
                            <Grid item xs={12}>
                                <TableContainer component={Paper} style={{ marginTop: 8 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell>Label</StyledTableCell>
                                                <StyledTableCell>File Name</StyledTableCell>
                                                <StyledTableCell>Approval Status</StyledTableCell>
                                                <StyledTableCell>Uploaded On</StyledTableCell>
                                                <StyledTableCell align='center' style={{width:50}}>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(covidVaccineCertificate?.list || []).length === 0 &&
                                                <StyledTableRow><StyledTableCell colSpan={5} align="center">No Data</StyledTableCell></StyledTableRow>
                                            }
                                            {(covidVaccineCertificate?.list || []).map((doc, idx) => (
                                                <StyledTableRow key={idx}>
                                                    <StyledTableCell>{doc.documentTypeLabel}</StyledTableCell>
                                                    <StyledTableCell>{doc.fileName}</StyledTableCell>
                                                    <StyledTableCell>{doc.isApproved}</StyledTableCell>
                                                    <StyledTableCell>{doc.uploadedOn}</StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        {downloadingFileName === doc.fileName ? (
                                                            <CircularProgress size={18} />
                                                        ) 
                                                        :
                                                        (<Tooltip title="Download">
                                                            <IconButton style={{padding:6}} onClick={() => downloadFile(doc.fileName)}>
                                                                <CloudDownload color='primary' />
                                                            </IconButton>
                                                        </Tooltip>)}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
                )}
                <Grid item xs={12}>
    <Box
        bgcolor="primary.main"
        color="primary.contrastText"
        display="flex"
        justifyContent="space-between"
        p={0.5}
        style={{
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
        }}
    >
        <Box component="span" fontSize={"1.2em"}>GradeBook Reports</Box>
        <Box>
            {gradeBookReports?.isLoading ? (
                <CircularProgress style={{ color: 'white', marginTop: 4, marginRight: 8 }} size={18} />
            ) : (
                <IconButton
                    size='small'
                    className={classnames(classes.expand, { [classes.expandOpen]: expanded[2] })}
                    onClick={() => handleExpandClick(2)}
                    aria-expanded={expanded[2]}
                    aria-label="Show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            )}
        </Box>
    </Box>
    <Collapse in={expanded[2]} timeout="auto" unmountOnExit>
        {gradeBookReports.isLoading ? (
            <Box p={2} textAlign="center">
                <CircularProgress />
            </Box>
        ) : gradeBookReports.error ? (
            <Box p={2} textAlign="center" color="error.main">
                {gradeBookReports.error}
            </Box>
        ) : (
            <TableContainer component={Paper} style={{ marginTop: 8 }}>
                <Table size="small">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Academics Session</StyledTableCell>
                            <StyledTableCell>Term</StyledTableCell>
                            <StyledTableCell>Programme</StyledTableCell>
                            <StyledTableCell>Approved On</StyledTableCell>
                            <StyledTableCell align='center' style={{width:50}}>Action</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {gradeBookReports.list?.length > 0 ? (
                            gradeBookReports.list.map((doc, idx) => (
                                <StyledTableRow key={idx}>
                                    <StyledTableCell>{doc.academicsSessionLabel || 'N/A'}</StyledTableCell>
                                    <StyledTableCell>{doc.sessionTermLabel || 'N/A'}</StyledTableCell>
                                    <StyledTableCell>{doc.programmeLabel || 'N/A'}</StyledTableCell>
                                    <StyledTableCell>{doc.approvedOn || 'N/A'}</StyledTableCell>
                                    <StyledTableCell align='center'>
                                        {doc.id ? (
                                            <Tooltip title="Open">
                                                <IconButton 
                                                    style={{padding:6}}
                                                    component={RouterLink}
                                                    to={`/R301StudentProgressApprovedReport/${doc.id}`}
                                                    target="_blank"
                                                >
                                                    <OpenInBrowserOutlinedIcon color='primary' />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption">No link</Typography>
                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={5} align="center">
                                    No grade book reports available
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        )}
    </Collapse>
</Grid>
                {/* 
                <Grid item xs={12}>
                    <Box
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        display="flex"
                        justifyContent="space-between"
                        p={0.5}
                        style={{
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5
                        }}
                    >
                        <Box component="span" fontSize={"1.2em"}>Assignments</Box>
                        <Box>
                            {
                                assignments?.isLoading ? <CircularProgress style={{ color: 'white', marginTop: 4, marginRight: 8 }} size={18} />
                                    :
                                    <IconButton
                                        size='small'
                                        className={classnames(classes.expand, { [classes.expandOpen]: expanded[3] })}
                                        onClick={() => handleExpandClick(3)}
                                        aria-expanded={expanded[3]}
                                        aria-label="Show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                            }
                        </Box>
                    </Box>
                    <Collapse in={expanded[3]} timeout="auto" unmountOnExit>
                        <Grid container spacing={2} justifyContent='center' alignItems='center'>
                            <Grid item xs={12}>
                                <TableContainer component={Paper} style={{ marginTop: 8 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell>Section</StyledTableCell>
                                                <StyledTableCell>Label</StyledTableCell>
                                                <StyledTableCell align='center' style={{width:50}}>Assignment</StyledTableCell>
                                                <StyledTableCell align='center' style={{width:140}}>Submitted Assignment</StyledTableCell>
                                                <StyledTableCell style={{width:90}}>Submitted On</StyledTableCell>
                                                <StyledTableCell align='center' style={{width:140}}>Graded Assignment</StyledTableCell>
                                                 <StyledTableCell style={{width:90}}>Graded On</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(assignments?.list || []).length === 0 &&
                                                <StyledTableRow><StyledTableCell colSpan={7} align="center">No Data</StyledTableCell></StyledTableRow>
                                            }
                                            {(assignments?.list || [])
                                            .filter(doc => doc.submittedAssignmentUrl)
                                            .map((doc, idx) => (
                                                <StyledTableRow key={idx}>
                                                    <StyledTableCell>{doc.sectionLabel}</StyledTableCell>
                                                    <StyledTableCell>{doc.label}</StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        {downloadingFileName === doc.assignmentUrl ? (
                                                            <CircularProgress size={18} />
                                                        ) 
                                                        :
                                                        (<Tooltip title="Download">
                                                            <IconButton style={{padding:6}} onClick={() => downloadFile(doc.assignmentUrl)}>
                                                                <CloudDownload color='primary' />
                                                            </IconButton>
                                                        </Tooltip>)}
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        {downloadingFileName === doc.submittedAssignmentUrl ? (
                                                            <CircularProgress size={18} />
                                                        ) 
                                                        :
                                                        (<Tooltip title="Download">
                                                            <IconButton style={{padding:6}} onClick={() => downloadFile(doc.submittedAssignmentUrl)}>
                                                                <CloudDownload color='primary' />
                                                            </IconButton>
                                                        </Tooltip>)}
                                                    </StyledTableCell>
                                                    <StyledTableCell>{doc.assignmentSubmitted}</StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        { doc.gradedAssignmentUrl && 
                                                         (downloadingFileName === doc.gradedAssignmentUrl ? (
                                                            <CircularProgress size={18} />
                                                        ) 
                                                        :
                                                        (<Tooltip title="Download">
                                                            <IconButton style={{padding:6}} onClick={() => downloadFile(doc.gradedAssignmentUrl)}>
                                                                <CloudDownload color='primary' />
                                                            </IconButton>
                                                        </Tooltip>))}
                                                    </StyledTableCell>
                                                    <StyledTableCell>{doc.assignmentGradedOn}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid> 
                */}
            </Grid>
        </Dialog>
    );
};

// Custom memoization to avoid re-renders unless row.studentId changes
function areEqual(prevProps, nextProps) {
    return (
        prevProps.open === nextProps.open &&
        prevProps.row?.studentId === nextProps.row?.studentId
    );
}

export default React.memo(FileRepositoryPopup, areEqual);
