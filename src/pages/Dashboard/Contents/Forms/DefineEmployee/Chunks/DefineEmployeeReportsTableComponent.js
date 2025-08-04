import React, { Component } from "react";
import {Paper, Box, CircularProgress, TableRow, TableCell} from "@material-ui/core"; // Import loader component
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";
import { Skeleton } from "@material-ui/lab";

class DefineEmployeeReportsTableComponent extends Component {
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
			pageSizes: [5, 10, 15, 20],
			defaultSorting: [],
			sortingStateColumnExtensions: [
				{ columnName: "action", sortingEnabled: false },
			],
			tableColumnExtensions: [
				{ columnName: "id", width: 80 },
				{ columnName: "displayName", wordWrapEnabled: true },
				{ columnName: "cnicNumber", width: 125 },
				{ columnName: "mobileNo", wordWrapEnabled: true, width: 110 },
				{ columnName: "email", wordWrapEnabled: true },
				{ columnName: "jobStatusLabel", wordWrapEnabled: true, width: 80 },
				{ columnName: "createdOn", wordWrapEnabled: true, width: 100 },
				{ columnName: "statusLabel", wordWrapEnabled: true, width: 80 },
				{ columnName: "bankAccountNumber1", wordWrapEnabled: true, width: 80 },
				{ columnName: "bankAccountNumber2", wordWrapEnabled: true, width: 180 },
				{ columnName: "leavingDateLabel", wordWrapEnabled: true, width: 100 },
				{ columnName: "rolesLabel", wordWrapEnabled: true, width: 110 },
				{ columnName: "entitiesLabel", wordWrapEnabled: true },
				{ columnName: "departmentsLabel", wordWrapEnabled: true },
				{ columnName: "subDepartmentsLabel", wordWrapEnabled: true },
				{ columnName: "designationsLabel", wordWrapEnabled: true },
				{ columnName: "address", wordWrapEnabled: true, width: 200 },
				{ columnName: "bloodGroup", wordWrapEnabled: true },
				{ columnName: "emergencyContactName", wordWrapEnabled: true },
				{ columnName: "emergencyContactNumber", wordWrapEnabled: true },
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
		const cellComponent = ({ cellProps, ...restProps }) => {
			return (
				<Table.Cell
					{...restProps}
					style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
				/>
			);
		};

		const {
			tableColumnExtensions,
			defaultSorting,
			sortingStateColumnExtensions,
			filteringStateColumnExtensions,
			defaultFilters,
			pageSizes,
		} = this.state;

		const { rows, columns, showFilter, isLoading } = this.props; // Get isLoading prop

		const NoDataRow = () => (
			<TableRow>
				<TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
					{isLoading ? (
						<>
							<Skeleton />
							<Skeleton animation={false} />
							<Skeleton animation="wave" />
						</>
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
					>
						<FilteringState
							defaultFilters={defaultFilters}
							columnExtensions={filteringStateColumnExtensions}
						/>
						<SortingState
							defaultSorting={defaultSorting}
							columnExtensions={sortingStateColumnExtensions}
						/>
						<PagingState defaultCurrentPage={0} defaultPageSize={5} />
						<IntegratedFiltering />
						<IntegratedSorting />
						<IntegratedPaging />
						<Table
							noDataRowComponent={NoDataRow}
							cellComponent={cellComponent}
							columnExtensions={tableColumnExtensions}
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
						{showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
						<PagingPanel pageSizes={pageSizes} />
					</Grid>
			</Paper>
		);
	}
}

DefineEmployeeReportsTableComponent.propTypes = {
	columns: PropTypes.array,
	rows: PropTypes.array,
	showFilter: PropTypes.bool,
	isLoading: PropTypes.bool, // Add PropTypes for isLoading
};

DefineEmployeeReportsTableComponent.defaultProps = {
	columns: [],
	rows: [],
	showFilter: false,
	isLoading: false, // Set default prop for isLoading
};

export default DefineEmployeeReportsTableComponent;
