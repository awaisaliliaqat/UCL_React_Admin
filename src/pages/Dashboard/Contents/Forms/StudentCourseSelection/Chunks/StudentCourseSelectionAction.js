import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import TablePanel from '../../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Chip, TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      fontWeight: 900,
      fontSize: 15
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

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize', textAlign: 'center' }} variant="h5">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class StudentCourseSelectionAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        const { achivementsData,moduleData, coursesData, handleSetCourses, selectedCoursesData, handleCheckboxChange, selectedData, open, handleClose, onClear, onSave, readOnly} = this.props;
        const columns = [
            //{ name: "Course Id", dataIndex: "courseId", sortable: false, customStyleHeader: { width: '14%' } },
            //{ name: "Course Code", dataIndex: "courseCode", sortable: false, customStyleHeader: { width: '14%' } },
            { name: "Course Title", renderer: rowData => { return ( <Fragment>{rowData.courseTitle}</Fragment> )}, sortable: false, customStyleHeader: { width: '20%' }},
            { name: "Prerequisite Course", dataIndex: "prerequisites", sortable: false, customStyleHeader: { width: '20%' } },
            { name: "Register", renderer: rowData => {
                    return (
                        <Fragment>
                            <Checkbox
                                style={{ marginLeft: '-20px' }}
                                icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
                                checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                                color="primary"
                                checked={rowData.isRegistered === 1}
                                onChange={(e) => handleCheckboxChange(e, rowData, 0)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%', textAlign: 'center' }, align: 'center'
            },
            {
                name: "Repeat", renderer: rowData => {
                    return (
                        <Fragment>
                            <Checkbox
                                style={{ marginLeft: '-20px' }}
                                icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
                                checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                                color="primary"
                                disabled={rowData.isRegistered !== 1}
                                checked={rowData.isRepeat === 1}
                                onChange={(e) => handleCheckboxChange(e, rowData, 1)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%', textAlign: 'center' }, align: 'center'
            },
        ]

        const modulesColumns = [
            { name: "Module Number", dataIndex: "moduleNumber", sortable: false, customStyleHeader: { width: '8%' } },
            { name: "Courses",dataIndex: "courses", sortable: false, customStyleHeader: { width: '20%' } },
        ]

        const achievementsColumns = [
            { name: "Module  Number", dataIndex: "moduleNumber", sortable: false, customStyleHeader: { width: '8%' } },
            { name: "Courses", dataIndex: "courses", sortable: false, customStyleHeader: { width: '14%' } },
            { name: "Marks", dataIndex: "marks", sortable: false, customStyleHeader: { width: '10%' } },
        ]

        return (
            <Fragment>
                <Dialog fullScreen open={open} onClose={handleClose} scroll={'paper'}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {`${selectedData.firstName} ${selectedData.lastName} - ${selectedData.studentId} - ${selectedData.degreeLabel}`}
                    </DialogTitle>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <DialogContent>
                        <div style={{
                            color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize', marginLeft: 5,
                            fontSize: 18,
                            marginBottom: 10,width:"100%"
                        }}> 
                             <Grid container spacing={2}>  
                                <Grid item xs={3}>
                                    <div style={{
                                        color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize', marginLeft: 5,
                                        fontSize: 18,
                                        marginBottom: 10
                                    }}>
                                        Programme Module
                                    </div>
                                    <div style={{height:(window.innerHeight-165),overflowY:"auto"}}>
                                        <TablePanel data={moduleData} sortingEnabled columns={modulesColumns} />
                                    </div>
                                </Grid> 
                                <Grid item xs={4}>
                                    <div style={{
                                        color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize', marginLeft: 5,
                                        fontSize: 18,
                                        marginBottom: 10
                                    }}>
                                       Student Achivements
                                    </div>
                                    <TablePanel data={achivementsData} sortingEnabled columns={achievementsColumns} />
                                </Grid>
                                <Grid item xs={5} style={{
                                    borderLeftColor:'rgb(58, 127, 187)'
                                }}>
                                    <div 
                                        style={{
                                            color: '#1d5f98', 
                                            fontWeight: 600, 
                                            textTransform: 'capitalize', 
                                            marginLeft: 5,
                                            fontSize: 18,
                                            marginBottom: 10
                                        }}
                                    >
                                        Offered Courses
                                    </div>
                                    <br/>
                                    <Autocomplete
                                        multiple
                                        fullWidth
                                        id="preCourses"
                                        disabled={readOnly}
                                        options={coursesData}
                                        value={selectedCoursesData}
                                        onChange={(event, value) =>
                                            handleSetCourses(value)
                                        }
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option.courseTitle}
                                        renderTags={(tagValue, getTagProps) =>
                                            tagValue.map((option, index) => (
                                            <Chip
                                                label={option.courseTitle}
                                                color="primary"
                                                variant="outlined"
                                                {...getTagProps({ index })}
                                            />
                                            ))
                                        }
                                        renderOption={(option , {selected}) => (
                                            <Fragment>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                                color="primary"
                                            />
                                            {option.courseTitle}
                                            </Fragment>
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Courses"
                                            placeholder="Search and Select"
                                          />
                                        )}
                                    />
                                    {/* <TablePanel data={selectedCoursesData} sortingEnabled columns={columns} /> */}
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                            {columns.map((row) => (
                                                <StyledTableCell key={"H"+row.name}>{row.name}</StyledTableCell>
                                            ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {selectedCoursesData.map((rowData, index) => (
                                            <StyledTableRow key={"R"+rowData.courseTitle}>
                                                <StyledTableCell>{rowData.courseTitle}</StyledTableCell>
                                                <StyledTableCell>{rowData.prerequisites}</StyledTableCell>
                                                <StyledTableCell>
                                                    <Fragment>
                                                        <Checkbox
                                                            style={{ marginLeft: '-20px' }}
                                                            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
                                                            checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                                                            color="primary"
                                                            checked={rowData.isRegistered === 1}
                                                            onChange={(e) => handleCheckboxChange(e, rowData, 0)}
                                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            disabled={readOnly}
                                                        />
                                                    </Fragment>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Fragment>
                                                        <Checkbox
                                                            style={{ marginLeft: '-20px' }}
                                                            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
                                                            checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                                                            color="primary"
                                                            disabled={rowData.isRegistered !== 1}
                                                            checked={rowData.isRepeat === 1}
                                                            onChange={(e) => handleCheckboxChange(e, rowData, 1)}
                                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            disabled={readOnly}
                                                        />
                                                    </Fragment>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </div>
                    </DialogContent>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <DialogActions>
                        <div style={{
                            marginRight: 30,
                        }}>
                        <Button 
                            disabled={readOnly}
                            onClick={() => onSave()}
                            color="primary" variant="contained" style={{
                                textTransform: 'capitalize',
                                width: 100,
                                //marginRight: 20,
                            }}>
                            Save
                        </Button>
                        {/* 
                        <Button onClick={() => onClear()} color="primary" variant="contained" style={{
                                textTransform: 'capitalize',
                                width: 100
                            }}>
                                Clear
                        </Button> 
                        */}
                        </div>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

StudentCourseSelectionAction.propTypes = {
    handleCheckboxChange: PropTypes.func,
    onClear: PropTypes.func,
    coursesData: PropTypes.array,
    selectedData: PropTypes.object,
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    onSave: PropTypes.func
};

StudentCourseSelectionAction.defaultProps = {
    handleCheckboxChange: fn => fn,
    handleClose: fn => fn,
    onClear: fn => fn,
    onSave: fn => fn,
    open: false,
    selectedData: {},
    coursesData: []
};


export default StudentCourseSelectionAction;