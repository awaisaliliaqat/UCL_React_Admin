import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTableComponent from './DialogTableComponent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ScrollToTop from '../../../../../../components/ScrollToTop/ScrollToTop';

const useStyles = makeStyles(() => ({
    resize: {
        padding: 9
    },
    label: {
        marginTop: 9,
        fontSize: 16,
        color: 'rgb(28, 86, 150)',
        fontWeight: 800,
        marginRight: 10,
        width: 150
    },
}));


const DecisionActionMenu = props => {

    const classes = useStyles();

    const { handleClose, onConfirmClick, open, data, onAutoCompleteChange, isLoading } = props;

    const renderEditableField = (rowData, fieldName) => (
        <TextField
            type="number"
            size="small"
            name={fieldName}
            value={rowData[fieldName] || ""}
            onChange={(e) => {
                const updated = data.mainData.map(item =>
                    item.id === rowData.id
                        ? { ...item, [fieldName]: e.target.value }
                        : item
                );
                data.setMainData(updated);
            }}
        />
    );

    const columns = [
        { name: "courseLabel", title: "Course Label" },
        { name: "sectionTypeLabel", title: "Class Type" },
        { name: "label", title: "Section" },
        { name: "weeklyWorkLoad", title: "Weekly Work Load",
            getCellValue: (rowData) => renderEditableField(rowData, "weeklyWorkLoad")    
        },
        { name: "claimHours", title: "Claim Hours",
             getCellValue: (rowData) => renderEditableField(rowData, "claimHours")
         },
        //{ name: "degreeProgram", title: "Degree Program" },
    ]

    const selectionData = data.mainData.filter(item => item.isChecked === true) || [];

    return (
        <div>
            <Dialog fullWidth={false}
                maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">
                    <span style={{
                        fontSize: 20,
                        color: '#1558a2',
                        fontWeight: 700
                    }}>Assign Teacher</span>
                    <Divider />
                    <div style={{
                        display: 'flex',
                        marginTop: 20
                    }}>
                        <div className={classes.label}>Select Teacher</div>
                        <Autocomplete
                            id="teacherId"
                            getOptionLabel={(option) => option.displayName}
                            fullWidth
                            value={data.teachersObject}
                            onChange={onAutoCompleteChange}
                            size="small"
                            options={data.teachersData}
                            renderInput={(params) => <TextField error={data.teachersObjectError} variant="outlined" placeholder="Teachers" {...params}
                            />}
                        />
                    </div>
                </DialogTitle>
                <DialogContent style={{
                    width: 650,
                }}>
                    <div>
                        <DialogTableComponent
                            rows={selectionData}
                            columns={columns}
                            showFilter={false}
                        />
                    </div>
                    <ScrollToTop />
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    <Button disabled={isLoading} variant="contained" style={{
                        backgroundColor: '#235a97',
                        width: 80
                    }} onClick={() => onConfirmClick()} color="primary">
                        {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Save"}
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
    isLoading: PropTypes.bool,
    data: PropTypes.object,
    onHandleChange: PropTypes.func,
    onAutoCompleteChange: PropTypes.func
};

DecisionActionMenu.defaultProps = {
    handleClose: fn => fn,
    onConfirmClick: fn => fn,
    submitLoading: false,
    open: false,
    isLoading: false,
    data: {},
    onHandleChange: fn => fn,
    onAutoCompleteChange: fn => fn
};

export default DecisionActionMenu;