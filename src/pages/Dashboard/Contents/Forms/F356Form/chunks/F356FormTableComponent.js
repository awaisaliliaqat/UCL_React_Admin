import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, CircularProgress, TableRow, TableCell, Box } from "@material-ui/core";
import { SummaryState, GroupingState, IntegratedGrouping, IntegratedSummary, DataTypeProvider, } from "@devexpress/dx-react-grid";
import { Grid, VirtualTable, TableHeaderRow, TableGroupRow, TableSummaryRow, TableFixedColumns, } from "@devexpress/dx-react-grid-material-ui";

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
	return (
		<VirtualTable.Cell
			{...restProps}
			style={{
				...style,
				top: 0,
				zIndex: 10,
				position: "sticky",
				background: "#fff",
				borderBottom: "1px solid #ccc",
			}}
		/>
	);
};

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
	<DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const F356FormTableComponent = (props) => {
	const [tableColumnExtensions] = useState([
		{ columnName: "id", align: "left" },
		{ columnName: "displayName", align: "left", wordWrapEnabled: true},
		{ columnName: "rolesLabel", align: "center", wordWrapEnabled: true },
		{ columnName: "employmentStatus", align: "center", wordWrapEnabled: true},
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

	const { isLoading, rows, columns} = props;
	const [currencyColumns] = useState(["perHourRate", "totalAmount"]);

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
			<Grid rows={isLoading ? [] : rows} columns={columns}>
				<CurrencyTypeProvider for={currencyColumns} />
				<SummaryState
					totalItems={totalSummaryItems}
					groupItems={groupSummaryItems}
				/>
				<IntegratedSummary />
				<VirtualTable
					noDataRowComponent={NoDataRow} 
					columnExtensions={tableColumnExtensions} 
				/>
				<TableHeaderRow cellComponent={StickyHeaderCell} />
				{/* Sticky header */}
				{/* <TableGroupRow /> */}
				{/* <TableSummaryRow /> */}
				<TableFixedColumns leftColumns={["id", "displayName"]} />
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
