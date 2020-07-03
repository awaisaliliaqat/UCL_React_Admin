/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Divider, Card,
    CardContent
} from '@material-ui/core';
import { useDropzone } from "react-dropzone";
import Typography from "@material-ui/core/Typography";
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

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

function MyDropzone(props) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'application/pdf' });

    const files = acceptedFiles.map((file, index) => {
        const size = file.size > 0 ? (file.size / 1000).toFixed(2) : file.size;
        return (
            <Typography key={index} variant="subtitle1" color="primary">
                {file.path} - {size} Kb
                <input type="hidden" name="file_name" value={file.path}></input>
            </Typography>
        )
    });

    let msg = files || [];
    if (msg.length <= 0 || props.files.length <= 0) {
        msg = <Typography variant="subtitle1">
            Please click here to  select and upload an offer letter
    </Typography>;
    }
    return (
        <div
            style={{ textAlign: "center" }}
            {...getRootProps({ className: "dropzone", onChange: event => props.onChange(event) })}
        >
            <Card style={{ backgroundColor: "#c7c7c7" }}>
                <CardContent style={{
                    paddingBottom: 10,
                    paddingTop: 10
                }}>
                    <input name="contained-button-file" {...getInputProps()} disabled={props.disabled} />
                    {msg}

                </CardContent>
            </Card>
        </div>
    );
}

const OfferLetterMenu = props => {
    const { values, onDeleteClick, onDownloadClick, handleClose, onUploadFile, handleFileChange, open, handleOnBtnClick, onSendClick } = props;
    const classes = useStyles();
    const { selectedData = {}, sendLoading, uploadLoading, isLoading, files = [], filesError } = values;
    const columns = [
        //{ name: "SR#", dataIndex: "serialNo", sortable: false, customStyleHeader: { width: '7%' } },
        { name: "Id", dataIndex: "offerLetterId", sortable: false, customStyleHeader: { width: '12%', textAlign: 'center' } },
        {
            // eslint-disable-next-line react/display-name
            name: "File", renderer: rowData => {
                return <Fragment>
                    <span>{rowData.offerLetterFileName}</span>
                </Fragment>
            }, sortable: false, customStyleHeader: { width: '35%' }
        },
        {
            // eslint-disable-next-line react/display-name
            name: "Action", renderer: rowData => {
                return (
                    <Fragment>
                        <div style={{ display: 'flex', margin: '-10px' }}>
                            <IconButton disabled={isLoading || uploadLoading || sendLoading} onClick={(e) =>
                                onDownloadClick(e, rowData)
                            } aria-label="download">
                                <CloudDownloadIcon />
                            </IconButton>
                            {selectedData.statusId !== 6 &&
                                <IconButton disabled={isLoading || uploadLoading || sendLoading} onClick={(e) => onDeleteClick(e, rowData)
                                } aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            }
                        </div>
                    </Fragment>
                )
            }, sortable: false, customStyleHeader: { width: '15%' }
        },
    ]

    const onClickHandler = (e) => {
        e.preventDefault();
        if (handleOnBtnClick()) {
            document.getElementById('btn-submit').click();
        }
    }

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
                    {selectedData.isOfferLetterUploaded !== 1 &&
                        <form autoComplete="off" onSubmit={e => onUploadFile(e, selectedData.id)}>
                            <input name="applicationId" type="hidden" value={selectedData.id || 0} />
                            <div style={{
                                marginBottom: 20,
                                display: 'flex'
                            }}>

                                <div style={{
                                    width: '100%'
                                }}>
                                    <MyDropzone files={files} onChange={event => handleFileChange(event)} disabled={uploadLoading} />
                                    <div style={{
                                        textAlign: 'center',
                                        marginTop: 10
                                    }}>
                                        <span style={{
                                            color: '#ff2d2d'
                                        }}>{filesError}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || sendLoading}
                                    onClick={(e) => onClickHandler(e)}
                                    style={{
                                        height: 40,
                                        marginTop: 5,
                                        marginLeft: 15,
                                        textTransform: 'capitalize',
                                        width: 90
                                    }}
                                > {uploadLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Upload"}</Button>
                                <input id="btn-submit" type="submit" style={{ display: 'none' }} />

                            </div>
                        </form>
                    }
                    <div style={{
                        marginTop: '-20px'
                    }}>
                        <TablePanel isShowIndexColumn data={selectedData.isOfferLetterUploaded === 1 ? [selectedData] : []} sortingEnabled columns={columns} />

                        <div style={{
                            textAlign: 'center',
                            marginBottom: 20,
                            marginTop: 10
                        }}>{selectedData.isOfferLetterUploaded === 1 ? '' : 'No File Uploaded'}</div>
                    </div>

                </DialogContent>
                <Divider />
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    {selectedData.statusId !== 6 &&
                        <Button disabled={selectedData.isOfferLetterUploaded !== 1 || isLoading || uploadLoading} variant="contained"
                            onClick={(e) => onSendClick(e, selectedData.id)}
                            style={{
                                width: 90
                            }} color="primary">
                            {sendLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Send"}
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

OfferLetterMenu.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    values: PropTypes.object,
    onUploadFile: PropTypes.func,
    handleFileChange: PropTypes.func,
    handleOnBtnClick: PropTypes.func,
    onSendClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onDownloadClick: PropTypes.func
};

OfferLetterMenu.defaultProps = {
    handleClose: fn => fn,
    open: false,
    values: {},
    onUploadFile: fn => fn,
    onSendClick: fn => fn,
    handleFileChange: fn => fn,
    handleOnBtnClick: fn => fn,
    onDeleteClick: fn => fn,
    onDownloadClick: fn => fn
};

export default OfferLetterMenu;