/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Divider, TextField
} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
    },
    resize: {
        padding: 9
    },
    label: {
        marginTop: 9,
        fontSize: 16,
        color: 'rgb(28, 86, 150)',
        fontWeight: 800,
        marginRight: 10,
        width: 200,
        marginLeft: 15
    },
    button: {
        width: 70,
        height: 35,
        textTransform: 'capitalize',
        backgroundColor: '#245e9e'
    },
    imageContainer: {
        height: 100,
        width: 100,
        border: '1px solid #ccc3c3',
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 17,
        marginRight: 15,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
    },
    itemLabel: {
        textAlign: 'left',
        font: 'bold 20px Lato',
        marginRight: 20,
        letterSpacing: 0,
        color: '#174A84',
        opacity: 1,
        marginTop: 5,
        marginBottom: 5,
        inlineSize: 'max-content'
    },
}));

const AssignAcccountIdMenu = props => {
    const { values, handleClose, open, onSaveClick, onHandleChange } = props;
    const classes = useStyles();
    const { selectedData = {}, sendLoading, uploadLoading, saveLoading } = values;

    return (
        <div>
            <Dialog disableBackdropClick disableEscapeKeyDown fullWidth={false}
                maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">
                    <span style={{
                        fontSize: 16,
                        color: '#1558a2',
                        fontWeight: 700
                    }}>Application ID: {selectedData.id || 0}</span>
                    <Divider />
                </DialogTitle>
                <DialogContent style={{
                    width: 500,
                    marginTop: '-15px',
                }}>
                    <div style={{ display: 'flex' }}>
                        <div className={classes.imageContainer} style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${selectedData.imageName})`,
                        }} />
                        <div style={{
                            marginLeft: 15,
                            marginTop: 12,
                            width: '67%',
                        }}>
                            <Typography style={{
                                textTransform: 'capitalize'
                            }} component="h5" variant="h5">
                                {`${selectedData.firstName || "Ucl"} ${selectedData.lastName || "Student"}`}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {selectedData.genderLabel || "No Data"}, {selectedData.email || "No Data"}
                            </Typography>

                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        marginBottom: 10
                    }}>
                        <div className={classes.label}>Assign Account Id</div>
                        <TextField
                            placeholder="Account Id"
                            variant="outlined"
                            fullWidth
                            InputProps={{ classes: { input: classes.resize } }}
                            name="accountId"
                            value={values.accountId}
                            onChange={e => {
                                onHandleChange(e)
                            }}
                        />
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    {selectedData.statusId !== 6 &&
                        <Button disabled={!values.accountId || saveLoading} variant="contained"
                            onClick={(e) => onSaveClick(e, selectedData.id)}
                            style={{
                                width: 90
                            }} color="primary">
                            {saveLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Assign"}
                        </Button>
                    }
                    <Button disabled={uploadLoading || sendLoading} style={{
                        width: 90
                    }} variant="outlined" onClick={handleClose} color="primary">
                        Close
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AssignAcccountIdMenu.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    values: PropTypes.object,
    onHandleChange: PropTypes.func,
    onSaveClick: PropTypes.func
};

AssignAcccountIdMenu.defaultProps = {
    handleClose: fn => fn,
    open: false,
    values: {},
    onSaveClick: fn => fn,
    onHandleChange: fn => fn
};

export default AssignAcccountIdMenu;