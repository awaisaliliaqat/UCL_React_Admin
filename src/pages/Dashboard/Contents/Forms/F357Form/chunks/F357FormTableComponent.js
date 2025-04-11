import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, CircularProgress, TableRow, TableCell, Box } from "@material-ui/core";
import { SummaryState, GroupingState, IntegratedGrouping, IntegratedSummary, DataTypeProvider, FilteringState, SortingState, IntegratedFiltering, IntegratedSorting } from "@devexpress/dx-react-grid";
import { Grid, VirtualTable, TableHeaderRow, TableGroupRow, TableSummaryRow, TableFixedColumns, Table, TableFilterRow,  } from "@devexpress/dx-react-grid-material-ui";

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
	<DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const F357FormTableComponent = (props) => {
	const [tableColumnExtensions] = useState([
		{ columnName: "id", align: "center", width:150  },
		{ columnName: "displayName", align: "left", wordWrapEnabled: true},
		{ columnName: "rolesLabel", align: "left", wordWrapEnabled: true},
		{ columnName: "entitiesLabel", align: "left", wordWrapEnabled: true},
		{ columnName: "action", align: "center", width:100 }
	]);

	const [groupSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [totalSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [defaultSorting, setDefaultSorting] = useState([]);
	const [defaultFilters, setDefaultFilters] = useState([]);

	const [sortingStateColumnExtensions, setSortingStateColumnExtensions] = useState([
		{ columnName: "action", sortingEnabled: false },
	]);
	const [filteringStateColumnExtensions, setFilteringStateColumnExtensions] = useState([
		{ columnName: "action", filteringEnabled: false },
	]);

	const { isLoading, showFilter, rows, columns} = props;
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
					onSortingChange={setDefaultSorting}
				/>
				<IntegratedFiltering />
				<IntegratedSorting />
				<Table
					noDataRowComponent={NoDataRow} 
					columnExtensions={tableColumnExtensions} 
				/>
				<TableHeaderRow 
					showSortingControls={true}
					cellComponent={HeaderCell}
				/>
				{showFilter && <TableFilterRow showFilterSelector={true} /> }
			</Grid>
		</Paper>
	);
};

F357FormTableComponent.propTypes = {
	data: PropTypes.object,
	columns: PropTypes.array,
	expandedGroups: PropTypes.array,
	showFilter: PropTypes.bool,
};

F357FormTableComponent.defaultProps = {
	data: {},
	columns: [],
	expandedGroups: [],
	showFilter: true,
};

export default F357FormTableComponent;
