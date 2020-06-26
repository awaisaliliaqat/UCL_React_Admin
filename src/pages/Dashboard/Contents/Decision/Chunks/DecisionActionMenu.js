import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';

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
        width: 340
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

const DecisionActionMenu = props => {

    const classes = useStyles();
    const { handleClose, onConfirmClick, submitLoading, open, degreeId, DecisionId, degreeData, onHandleChange, data, DecisionData } = props;

    return (
        <div>
            <Dialog fullWidth={false}
                maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">
                    <span style={{
                        fontSize: 16,
                        color: '#1558a2',
                        fontWeight: 700
                    }}>Application ID: {data.id}</span>
                    <Divider />
                </DialogTitle>
                <DialogContent style={{
                    width: 500,
                    marginTop: '-15px',
                }}>
                    <div style={{ display: 'flex' }}>
                        <div className={classes.imageContainer} style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${data.imageName})`,
                        }} />
                        <div style={{
                            marginLeft: 15,
                            marginTop: 12,
                            width: '67%',
                        }}>
                            <Typography style={{
                                textTransform: 'capitalize'
                            }} component="h5" variant="h5">
                                {`${data.firstName} ${data.lastName}`}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {data.genderLabel}, {data.email}
                            </Typography>

                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        marginBottom: 20
                    }}>
                        <div className={classes.label}>Admission Decision</div>
                        <TextField
                            placeholder="Status"
                            variant="outlined"
                            fullWidth
                            name="DecisionId"
                            value={DecisionId}
                            onChange={e => {
                                onHandleChange(e)
                            }}
                            InputProps={{ classes: { input: classes.resize } }}
                            select
                        >
                            {DecisionData.map((item, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={item.ID}
                                    >
                                        {item.Label}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </div>
                    <div style={{
                        display: 'flex',
                        marginBottom: 10
                    }}>
                        <div className={classes.label}>Change Degree Programme</div>
                        <TextField
                            placeholder="Degree Programme"
                            variant="outlined"
                            fullWidth
                            select
                            disabled={DecisionId !== 3 && DecisionId !== 7}
                            InputProps={{ classes: { input: classes.resize } }}
                            value={degreeId}
                            name="degreeId"
                            onChange={e => {
                                onHandleChange(e)

                            }}
                        >
                            {degreeData.map((item, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        disabled={!item.id}
                                        value={item.id}
                                    >
                                        {item.label}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </div>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    <Button variant="contained" style={{
                        backgroundColor: '#235a97'
                    }} onClick={e => onConfirmClick(e, data.id)} color="primary">
                        {submitLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Submit"}
                    </Button>
                    <Button variant="outlined" onClick={handleClose} color="primary">
                        Cancel
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

DecisionActionMenu.propTypes = {
    handleClose: PropTypes.func,
    onConfirmClick: PropTypes.func,
    submitLoading: PropTypes.bool,
    open: PropTypes.bool,
    data: PropTypes.object,
    degreeData: PropTypes.array,
    onHandleChange: PropTypes.func,
    degreeId: PropTypes.number,
    DecisionId: PropTypes.number,
    DecisionData: PropTypes.array
};

DecisionActionMenu.defaultProps = {
    handleClose: fn => fn,
    onConfirmClick: fn => fn,
    submitLoading: false,
    open: false,
    data: {},
    degreeData: [],
    DecisionData: [],
    degreeId: 0,
    DecisionId: 1,
    onHandleChange: fn => fn
};

export default DecisionActionMenu;