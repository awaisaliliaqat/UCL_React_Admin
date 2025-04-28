import React, { useState } from "react";
import PropTypes from "prop-types";
import { Paper, CircularProgress, TableRow, TableCell, Box } from "@material-ui/core";
import { SummaryState, IntegratedSummary, DataTypeProvider, EditingState, IntegratedFiltering, FilteringState } from "@devexpress/dx-react-grid";
import { Grid, VirtualTable, TableHeaderRow, TableFixedColumns, TableEditRow, TableEditColumn, TableFilterRow } from "@devexpress/dx-react-grid-material-ui";

// Sticky header logic
const StickyHeaderCell = ({
	style,
	getCellWidth,
	onWidthDraft,
	onWidthDraftCancel,
	onWidthDraftStart,
	onWidthDraftUpdate,
	onWidthChange,
	resizingEnabled,
	draggingEnabled,
	...restProps
}) => {
	console.log(restProps);
	return (
		<VirtualTable.Cell
			{...restProps}
			style={{
				...style,
				// top: 0,
				// zIndex: 10,
				// position: "sticky",
				// background: "#fff",
				// borderBottom: "1px solid #ccc",
			}}
		/>
	);
};

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
	<DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const getRowId = row => row.id;

const F356FormTableComponent = (props) => {
	const [tableColumnExtensions] = useState([
		{ columnName: "id", align: "left" },
		{ columnName: "displayName", align: "left", wordWrapEnabled: true},
		{ columnName: "rolesLabel", align: "center", wordWrapEnabled: true },
		{ columnName: "jobStatusLabel", align: "center", wordWrapEnabled: true},
		{ columnName: "weeklyLoadThisYear", align: "center", wordWrapEnabled: true},
		{ columnName: "weeklyLoadNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "monthsThisYear", align: "center", wordWrapEnabled: true},
		{ columnName: "monthsNextYear", align: "center", wordWrapEnabled: true},
		{ columnName: "yearlyClaimThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlyClaimNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlySalaryThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlySalaryNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlyExpenseThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlyExpenseNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "rateNextYear", align: "right", wordWrapEnabled: true },
		{ columnName: "rateIncreasePercentage", align: "center", wordWrapEnabled: true },
		{ columnName: "salaryNextYear", align: "right", wordWrapEnabled: true },
		{ columnName: "salaryIncreasePercentage", align: "center", wordWrapEnabled: true },
		{ columnName: "comments", align: "center", wordWrapEnabled: true, width:250 }
	]);

	const [groupSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [totalSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [editingColumnExtensions] = useState([
		{ columnName: 'rolesLabel', editingEnabled: false },
		{ columnName: 'id', editingEnabled: false },
		{ columnName: 'displayName', editingEnabled: false },
		{ columnName: 'jobStatusLabel', editingEnabled: false },
		{ columnName: 'position', editingEnabled: false },
		{ columnName: 'joiningDate', editingEnabled: false },
		{ columnName: 'leavingDate', editingEnabled: false },
		{ columnName: 'weeklyLoadThisYear', editingEnabled: false },
		{ columnName: 'weeklyLoadNextYear', editingEnabled: false },
		{ columnName: 'text61', editingEnabled: true },
		{ columnName: 'text62', editingEnabled: true },
		{ columnName: 'rateThisYear', editingEnabled: false },
		{ columnName: 'rateNextYear', editingEnabled: false },
		{ columnName: 'rateIncreasePercentage', editingEnabled: false },
		{ columnName: 'monthsThisYear', editingEnabled: false },
		{ columnName: 'monthsNextYear', editingEnabled: false },
		{ columnName: 'salaryThisYear', editingEnabled: false },
		{ columnName: 'salaryNextYear', editingEnabled: false },
		{ columnName: 'salaryIncreasePercentage', editingEnabled: false },
		{ columnName: 'yearlyClaimThisYear', editingEnabled: false },
		{ columnName: 'yearlyClaimNextYear', editingEnabled: false },
		{ columnName: 'yearlySalaryThisYear', editingEnabled: false },
		{ columnName: 'yearlySalaryNextYear', editingEnabled: false },
		{ columnName: 'yearlyExpenseThisYear', editingEnabled: false },
		{ columnName: 'yearlyExpenseNextYear', editingEnabled: false },
		{ columnName: 'percentChange', editingEnabled: false },
		{ columnName: 'comments', editingEnabled: false },
		{ columnName: 'evaluationScore', editingEnabled: false }
		// Add more as needed
	  ]);
	

	const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE, "id", "displayName"]);

	const { isLoading, rows, columns, onCommitChanges} = props;

	const [currencyColumns] = useState(["rateNextYear", "salaryNextYear"]);

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

	return (
		<Paper>
			<Grid 
				rows={isLoading ? [] : rows} 
				columns={columns}
				getRowId={getRowId}
			>
				<FilteringState />
				<IntegratedFiltering />
				<CurrencyTypeProvider 
					for={currencyColumns} 
				/>
				<SummaryState
					totalItems={totalSummaryItems}
					groupItems={groupSummaryItems}
				/>
				<IntegratedSummary />
				<EditingState
					columnExtensions={editingColumnExtensions}
					onCommitChanges={onCommitChanges}
				/>
				<VirtualTable
					noDataRowComponent={NoDataRow} 
					columnExtensions={tableColumnExtensions} 
				/>
				<TableHeaderRow cellComponent={StickyHeaderCell} />
				{/* <TableFilterRow showFilterSelector /> */}
				<TableEditRow />
				<TableEditColumn
					showEditCommand
					width={170}
				/>
				<TableFixedColumns 
					leftColumns={leftFixedColumns} 
				/>
			</Grid>
		</Paper>
	);
};

F356FormTableComponent.propTypes = {
	data: PropTypes.object,
	columns: PropTypes.array,
	expandedGroups: PropTypes.array,
	showFilter: PropTypes.bool,
};

F356FormTableComponent.defaultProps = {
	data: {},
	columns: [],
	expandedGroups: [],
	showFilter: false,
};

export default F356FormTableComponent;
