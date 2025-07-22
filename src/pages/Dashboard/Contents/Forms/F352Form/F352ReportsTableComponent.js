import React, { Component } from "react";
import { Box, CircularProgress, Paper, TableCell, TableRow } from "@material-ui/core";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow, TableGroupRow, TableSummaryRow  } from "@devexpress/dx-react-grid-material-ui";
import { FilteringState, GroupingState, IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSorting, PagingState, SortingState, SummaryState, IntegratedSummary } from "@devexpress/dx-react-grid";
import { format } from "date-fns";

class F352ReportsTableComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			columns: [
				{ name: "srNo", title: "SR#" },
				{ name: "userLabel", title: "Employee" },
				{ name: "leaveTypeLabel", title: "Leave Type" },
				{ name: "startOnDate", title: "From Date" },
				{ name: "endOnDate", title: "To Date" },
				{ name: "noOfDays", title: "No of Days" },
				{ name: "createdOn", title: "Created On" },
				{ name: "action", title: "Action" },
			],
			rows: [],
			formatColumns: [],
			currencyColumns: [],
			availableFilterOperations: [
				"equal",
				"notEqual",
				"greaterThan",
				"greaterThanOrEqual",
				"lessThan",
				"lessThanOrEqual",
			],
			pageSizes: [10, 25, 50, 100],
			defaultSorting: [],
			sortingStateColumnExtensions: [
				{ columnName: "srNo", filteringEnabled: true },
				{ columnName: "userLabel", filteringEnabled: true },
				{ columnName: "leaveTypeLabel", filteringEnabled: true },
				{ columnName: "startOnDate", filteringEnabled: true },
				{ columnName: "endOnDate", filteringEnabled: true },
				{ columnName: "createdOn", filteringEnabled: true },
				{ columnName: "action", sortingEnabled: false },
			],
			tableColumnExtensions: [
				{ columnName: "srNo", width: 100 },
				{ columnName: "label", wordWrapEnabled: true },
				{ columnName: "noOfDays", width: 120 },
				{ columnName: "action", width: 120 },
			],
			defaultColumnWidths: [
				{ columnName: "srNo", minWidth: 100, maxWidth: 100 },
				{ columnName: "noOfDays", minWidth: 100, maxWidth: 100 },
				{ columnName: "action", minWidth: 100, maxWidth: 100 },
			],
			resizingMode: "widget",
			defaultFilters: [],
			filteringStateColumnExtensions: [
				{ columnName: "srNo", filteringEnabled: true },
				{ columnName: "userLabel", filteringEnabled: true },
				{ columnName: "leaveTypeLabel", filteringEnabled: true },
				{ columnName: "startOnDate", filteringEnabled: true },
				{ columnName: "endOnDate", filteringEnabled: true },
				{ columnName: "noOfDays", filteringEnabled: true },
				{ columnName: "createdOn", filteringEnabled: true },
				{ columnName: "action", filteringEnabled: false },
			],
			summaryItems: [
				{ columnName: "noOfDays", type: "sum" }
			],
		};
	}

	render() {
		const {
			columns,
			formatColumns,
			currencyColumns,
			availableFilterOperations,
			CurrencyEditor,
			tableColumnExtensions,
			resizingMode,
			defaultSorting,
			sortingStateColumnExtensions,
			filteringStateColumnExtensions,
			defaultFilters,
			summaryItems,
			defaultColumnWidths,
			columnBands,
			pageSizes,
		} = this.state;

		const {isLoading, rows, showFilter} = this.props;

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
				<Grid rows={isLoading ? [] : rows} columns={columns}>
					<FilteringState
						defaultFilters={defaultFilters}
						columnExtensions={filteringStateColumnExtensions}
					/>
					<SortingState
						defaultSorting={defaultSorting}
						columnExtensions={sortingStateColumnExtensions}
					/>
					<GroupingState
						defaultGrouping={[{ columnName: "userLabel" }]}
						defaultExpandedGroups={rows.map(row => row.userLabel)}
					/>
					<PagingState
						defaultCurrentPage={0}
						defaultPageSize={pageSizes[1]}
					/>
					<SummaryState 
						groupItems={summaryItems}
						totalItems={summaryItems}
					/>
					<IntegratedGrouping />
					<IntegratedSummary />
					<IntegratedFiltering />
					<IntegratedSorting />
					<IntegratedPaging />
					<Table
						columnExtensions={tableColumnExtensions}
						noDataRowComponent={NoDataRow}
						cellComponent={Cell}
					/>
					<TableHeaderRow  
						showSortingControls={true}
						cellComponent={HeaderCell}
					/>
					<TableGroupRow showColumnsWhenGrouped />
					<TableSummaryRow />
					{showFilter && <TableFilterRow showFilterSelector={true}  /> }
					<PagingPanel pageSizes={pageSizes} />
				</Grid>
			</Paper>
		);
	}
}

export default F352ReportsTableComponent;