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
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

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
        const { coursesData, handleCheckboxChange, selectedData, open, handleClose, onClear, onSave } = this.props;
        const columns = [
            { name: "Course Id", dataIndex: "courseId", sortable: false, customStyleHeader: { width: '8%' } },
            { name: "Course Code", dataIndex: "courseCode", sortable: false, customStyleHeader: { width: '14%' } },
            {
                name: "Course Title", renderer: rowData => {
                    return (
                        <Fragment>{rowData.courseTitle}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '20%' }
            },
            { name: "Prerequisite Course", dataIndex: "prerequisites", sortable: false, customStyleHeader: { width: '20%' } },
            {
                name: "Register", renderer: rowData => {
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
                            marginBottom: 10
                        }}>
                            Offered Courses
                        </div>
                        <TablePanel isShowIndexColumn data={coursesData} sortingEnabled columns={columns} />
                    </DialogContent>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <DialogActions>
                        <div style={{
                            marginRight: 30,
                        }}>
                            <Button onClick={() => onSave()}
                                color="primary" variant="contained" style={{
                                    textTransform: 'capitalize',
                                    width: 100,
                                    marginRight: 20,
                                }}>
                                Save
                        </Button>
                            <Button onClick={() => onClear()} color="primary" variant="contained" style={{
                                textTransform: 'capitalize',
                                width: 100
                            }}>
                                Clear
                        </Button>
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