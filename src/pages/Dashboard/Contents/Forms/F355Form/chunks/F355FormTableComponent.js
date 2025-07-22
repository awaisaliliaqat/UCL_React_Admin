/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Paper, CircularProgress, TableRow, TableCell } from "@material-ui/core";
import { Grid, Table, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { format } from "date-fns";

const F355FormTableComponent = (props) => {
	
	const [tableColumnExtensions] = useState([
		{ columnName:"leaveTypeLabel", align:"left" },
		{ columnName:"fromDate", align:"left", width:175 },
		{ columnName:"toDate", align:"left", width:175 },
		{ columnName:"noOfDays", align:"left", width:175 },
		{ columnName: "action", align: "center", width: 100 },
	]);

	const { isLoading, rows, columns } = props;

	const NoDataRow = () => (
		<TableRow>
			<TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
				{isLoading ? (
					<CircularProgress size={36} />
				) : (
					<Box color="primary.light" fontSize="1rem">No Data</Box>
				)}
			</TableCell>
		</TableRow>
	);

	// Custom Cell to Format Dates
	const Cell = (props) => {
		const { column, value } = props;
		let formattedValue = value;
		if (column.name === "startOnDate" || column.name === "endOnDate") {
			formattedValue = value ? format(new Date(value), "dd-MM-yyyy") : "";
		}
		if (column.name === "createdOn") {
			formattedValue = value ? format(new Date(value), "dd-MM-yyyy hh:mm a") : "";
		}
		return <Table.Cell {...props}>{formattedValue}</Table.Cell>;
	};

	// Custom Header Cell to Make Text Bold
	const HeaderCell = (props) => (
		<TableHeaderRow.Cell {...props} style={{ fontWeight: "bold" }} />
	);
	
	return (
		<Paper>
			<Grid 
				rows={rows} 
				columns={columns}
			>       
				<Table 
					columnExtensions={tableColumnExtensions} 
					noDataRowComponent={NoDataRow}
					cellComponent={Cell}
				/>
				<TableHeaderRow
					cellComponent={HeaderCell}
				/>
			</Grid>
		</Paper>
	);
};

F355FormTableComponent.propTypes = {
	rows: PropTypes.array,
	columns: PropTypes.array
};

F355FormTableComponent.defaultProps = {
	rows: [],
	columns: []
};

export default F355FormTableComponent;
