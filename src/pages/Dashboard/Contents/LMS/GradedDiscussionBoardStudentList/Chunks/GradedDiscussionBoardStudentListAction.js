import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
    root: {
        paddingBottom: '1%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 0
    },
    title: {
        color: "#1d5f98",
        fontWeight: 600,
        borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
        width: "98%",
        marginBottom: 25,
        fontSize: 20,
        textTransform: 'capitalize'
    },
    resize: {
        padding: 10
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        minWidth: 550,
        maxWidth: 500
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
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const GradedDiscussionBoardStudentListAction = (props) => {
    const { handleClose, open, data, onHandleChange, state, onSaveClick } = props;
    const classes = useStyles();
    return (
        <div>
            <Dialog fullScreen open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
                <DialogTitle id="customized-dialog-title" onClose={() => handleClose()}>
                    <Tooltip title="Back">
                        <IconButton onClick={() => handleClose()}>
                            <ArrowBackIcon fontSize="small" color="primary" />
                        </IconButton>
                    </Tooltip>
                    <span style={{
                        fontSize: 16,
                        color: '#1558a2',
                        fontWeight: 700
                    }}>Graded Discussion Marks</span>
                </DialogTitle>
                <DialogContent dividers>
                    <form id="myForm">
                        <TextField
                            type="hidden"
                            name="recordId"
                        />
                        <TextField
                            type="hidden"
                            name="gdaId"
                        />
                        <TextField
                            type="hidden"
                            name="sectionId"
                        />
                        <Grid
                            container
                            component="main"
                            className={classes.root}
                        >
                            <Grid
                                container
                                spacing={2}
                                style={{
                                    marginLeft: 5,
                                    marginRight: 10,
                                }}
                            >
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '1%',
                                            fontSize: 16

                                        }}
                                    >
                                        Nucleus Id:
            </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginLeft: 25,
                                            fontSize: 16,
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {data.studentId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '1%',
                                            fontSize: 16,

                                        }}
                                    >
                                        Student Name:
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginLeft: '2%',
                                            fontSize: 16,
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {data.studentName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '1%',
                                            fontSize: 16

                                        }}
                                    >
                                        Created On:
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginLeft: 17,
                                            fontSize: 16

                                        }}
                                    >
                                        {data.createdOn}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            fontSize: 16

                                        }}
                                    >
                                        Updated On:
            </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginLeft: '5%',
                                            fontSize: 16

                                        }}
                                    >
                                        {data.updatedOn}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '1%',
                                            fontSize: 16

                                        }}
                                    >
                                        Topic:
            </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginLeft: 60,
                                            fontSize: 16,
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {data.topic}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '1%',
                                            fontSize: 16

                                        }}
                                    >
                                        Total Marks:
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginLeft: '30px',
                                            fontSize: 16

                                        }}
                                    >
                                        {data.totalMarks}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '1%',
                                            fontSize: 16

                                        }}
                                    >
                                        Discussion Essay:
            </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={10}
                                        focused={false}
                                        InputProps={{
                                            style: {
                                                textTransform: 'capitalize',
                                                cursor: 'default'
                                            }
                                        }}
                                        value={data.discussionEssay}
                                        inputProps={{
                                            readOnly: true,
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} style={{
                                    display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',
                                }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        style={{
                                            marginRight: '20px',
                                            fontSize: 16,
                                            marginTop: 5

                                        }}
                                    >
                                        Given Marks:
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Marks"
                                        InputProps={{
                                            classes: { input: classes.resize }
                                        }}
                                        type="number"
                                        name="givenMarks"
                                        id="givenMarks"
                                        error={state.givenMarksError}
                                        helperText={state.givenMarks ? state.givenMarksError : ""}
                                        value={state.givenMarks || ""}
                                        onChange={onHandleChange}
                                        style={{
                                            width: '20%',
                                            marginRight: 20
                                        }}
                                    />
                                    <Button style={{ height: 40 }} disabled={state.isLoading} onClick={(e) => onSaveClick(e, data.id)} variant="contained" color="primary">
                                        {state.isLoading ? <CircularProgress
                                            size={24}
                                        /> : 'Save'
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <input type="submit" id="gradedDiscussionStudentSubmit" style={{ display: 'none' }} />
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}

GradedDiscussionBoardStudentListAction.propTypes = {
    handleClose: PropTypes.func,
    onHandleChange: PropTypes.func,
    onSaveClick: PropTypes.func,
    open: PropTypes.bool,
    data: PropTypes.object,
    state: PropTypes.object
}

GradedDiscussionBoardStudentListAction.defaultProps = {
    handleClose: fn => fn,
    onHandleChange: fn => fn,
    onSaveClick: fn => fn,
    open: false,
    data: {},
    givenMarks: 0,
    givenMarksError: "",
    state: {}
}

export default GradedDiscussionBoardStudentListAction;
