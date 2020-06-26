import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";

const ControlledTable = props => {
    const { rows, columns, onRemove, hideAction, dense, height, width } = props;

    return (
        <TableContainer component={Paper}>
            {rows.length > 0 &&
                (
                    <Table style={{ height: `${height}`, minWidth: `${width}` }} aria-label="simple table" size={dense ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, i) => (
                                    <TableCell key={i}>{column.label}</TableCell>
                                ))}
                                {!hideAction && <TableCell align="right">Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key} component="th" scope="row">
                                            {row[column.key] || '--'}
                                        </TableCell>
                                    ))}
                                    {!hideAction && <TableCell align="right"> <IconButton onClick={(e, i = index) => onRemove(e, i)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton></TableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            {rows.length <= 0 &&
                <Fragment>
                    <Table style={{ height: `${height}`, minWidth: `${width}` }} aria-label="simple table" size={dense ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, i) => (
                                    <TableCell key={i}>{column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                    </Table>
                    <Paper style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 50
                    }}>No Data</Paper>
                </Fragment>
            }
        </TableContainer >

    );
}

ControlledTable.propTypes = {
    rows: PropTypes.array,
    onRemove: PropTypes.func,
    columns: PropTypes.array,
    hideAction: PropTypes.bool,
    dense: PropTypes.bool,
    height: PropTypes.string,
    width: PropTypes.string
};

ControlledTable.defaultProps = {
    rows: [],
    columns: [],
    onRemove: fn => fn,
    hideAction: false,
    dense: false,
    height: '400px',
    width: '650px'
};

export default ControlledTable;