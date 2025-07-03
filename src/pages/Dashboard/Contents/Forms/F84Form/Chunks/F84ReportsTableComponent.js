import React, { Component } from "react";
import {Paper, TableRow, TableCell, Box} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress"; // Import loader component
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, GroupingState, IntegratedGrouping } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, VirtualTable, TableFilterRow, TableHeaderRow, TableGroupRow} from "@devexpress/dx-react-grid-material-ui"; import PropTypes from "prop-types";

class F84ReportsTableComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			columns: [],
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
			pageSizes: [5, 10, 25, 50, 100],
			defaultSorting: [],
			sortingStateColumnExtensions: [
				{ columnName: "action", sortingEnabled: false },
			],
			tableColumnExtensions: [
				{ columnName: "userId", width: 80 },
				{ columnName: "userLabel", wordWrapEnabled: true },
				{ columnName: "fromDateLabel", width: 120 },
				{ columnName: "roles", wordWrapEnabled: true, width: 110},
				{ columnName: "entities", wordWrapEnabled: true },
				{ columnName: "departments", wordWrapEnabled: true },
				{ columnName: "subDepartments", wordWrapEnabled: true },
				{ columnName: "action", width: 120 },
			],
			resizingMode: "widget",
			defaultFilters: [],
			filteringStateColumnExtensions: [
				{ columnName: "action", filteringEnabled: false },
			],
		};
	}

	render() {

		const {
			tableColumnExtensions,
			defaultSorting,
			sortingStateColumnExtensions,
			filteringStateColumnExtensions,
			defaultFilters,
			pageSizes,
		} = this.state;

		const { rows, columns, showFilter, expandedGroupsData, isLoading } = this.props; // Get isLoading prop

		console.log({ expandedGroupsData });

		const containerHeight = window.innerHeight * 0.75;

		const Root = props => <Grid.Root {...props} style={{ height: '100%' }} />;

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
			<Paper style={{ height: `${containerHeight}px` }}>
				<Grid
					rows={isLoading ? [] : rows}
					columns={columns}
					rootComponent={Root}
				>
					<FilteringState
						defaultFilters={defaultFilters}
						columnExtensions={filteringStateColumnExtensions}
					/>
					<SortingState
						defaultSorting={defaultSorting}
						columnExtensions={sortingStateColumnExtensions}
					/>
					{/* <PagingState defaultCurrentPage={0} defaultPageSize={5} /> */}
					<GroupingState
						grouping={[{ columnName: 'userLabel' }]}
						expandedGroups={expandedGroupsData}
					/>
					<IntegratedFiltering />
					<IntegratedSorting />
					{/* <IntegratedPaging /> */}
					<IntegratedGrouping />
					<VirtualTable
						height="auto"
						noDataRowComponent={NoDataRow}
						columnExtensions={tableColumnExtensions}
						cellComponent={props => (
							<VirtualTable.Cell
								{...props}
								style={{ whiteSpace: 'pre-line' }}
							/>
						)}
					/>
					<TableHeaderRow
						showSortingControls={true}
						titleComponent={(props) =>
							props.children !== "Action" ? (
								<b>{props.children}</b>
							) : (
								<b>&emsp;{props.children}</b>
							)
						}
					/>
					<TableGroupRow 
						showColumnsWhenGrouped
					/>
					{showFilter ? <TableFilterRow showFilterSelector={false} /> : ""}
					{/* <PagingPanel pageSizes={pageSizes} /> */}
				</Grid>
			</Paper>
		);
	}
}

F84ReportsTableComponent.propTypes = {
	columns: PropTypes.array,
	rows: PropTypes.array,
	showFilter: PropTypes.bool,
	isLoading: PropTypes.bool, // Add PropTypes for isLoading
};

F84ReportsTableComponent.defaultProps = {
	columns: [],
	rows: [],
	showFilter: false,
	isLoading: false, // Set default prop for isLoading
};

export default F84ReportsTableComponent;
