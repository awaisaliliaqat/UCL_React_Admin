/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import {
    Button, Card,
    CardContent, Typography
} from '@material-ui/core';
import { useDropzone } from "react-dropzone";
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import TablePanel from '../../../../../../components/ControlledTable/RerenderTable/TablePanel';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import DeleteIcon from '@material-ui/icons/Delete';

function MyDropzone(props) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

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
            Please click here to  select and upload a tuition fees file
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

class UploadTutionFeesAction extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {

        const { values, downloadFile, handleFileChange, handleSubmit, handleUploadButtonClick } = this.props;

        const columns = [
            { name: "Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '8%' } },
            { name: "File", dataIndex: "fileName", sortable: false, customStyleHeader: { width: '30%' } },
            { name: "Upload Date", dataIndex: "uploadedOn", sortable: false, customStyleHeader: { width: '17%' } },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Fragment>
                            <div style={{ display: 'flex', margin: '-10px' }}>
                                <IconButton onClick={() =>
                                    downloadFile(rowData.fileName)
                                } aria-label="download">
                                    <CloudDownloadIcon />
                                </IconButton>
                                {/* <IconButton onClick={() => deleteFile(rowData.id)
                                } aria-label="download">
                                    <DeleteIcon />
                                </IconButton> */}
                            </div>
                        </Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
        ]

        return (
            <Fragment>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div style={{
                        marginBottom: 20,
                        marginTop: 30,
                        display: 'flex'
                    }}>

                        <div style={{
                            width: '100%'
                        }}>
                            <MyDropzone files={values.files} onChange={handleFileChange} disabled={false} />
                            <div style={{
                                textAlign: 'center',
                                marginTop: 10
                            }}>
                                <span style={{
                                    color: '#ff2d2d'
                                }}>{values.filesError}</span>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUploadButtonClick()}
                            style={{
                                height: 40,
                                marginTop: 5,
                                marginLeft: 15,
                                textTransform: 'capitalize',
                                width: 90
                            }}
                            disabled={values.uploadLoading || values.isLoading}
                        > {(values.uploadLoading || values.isLoading) ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Upload"}</Button>
                        <input id="submit-button" type="submit" style={{ display: 'none' }} />

                    </div>
                </form>
                <div style={{ marginTop: 20 }}>
                    <TablePanel isShowIndexColumn data={values.documentData} isLoading={values.isLoading} sortingEnabled={false} columns={columns} />
                </div>
            </Fragment>
        );
    }
}
UploadTutionFeesAction.propTypes = {
    values: PropTypes.object,
    handleUploadButtonClick: PropTypes.func,
    handleFileChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    downloadFile: PropTypes.func,
    deleteFile: PropTypes.func

}

UploadTutionFeesAction.defaultProps = {
    values: {},
    handleUploadButtonClick: fn => fn,
    handleFileChange: fn => fn,
    handleSubmit: fn => fn,
    downloadFile: fn => fn,
    deleteFile: fn => fn

}
export default UploadTutionFeesAction;