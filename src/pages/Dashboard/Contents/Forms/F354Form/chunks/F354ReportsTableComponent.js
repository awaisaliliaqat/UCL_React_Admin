/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Paper, CircularProgress, TableRow, TableCell } from "@material-ui/core";
import { Grid, Table, TableHeaderRow, TableFilterRow, PagingPanel } from "@devexpress/dx-react-grid-material-ui";
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState } from "@devexpress/dx-react-grid";

const F354ReportsTableComponent = ({isLoading=false, rows=[], columns=[], showFilter=false}) => {
	
	const [tableColumnExtensions] = useState([
        { columnName: "userLabel", align:"left"},
        { columnName:"leaveTypeLabel", align:"left", width:175 },
        { columnName:"startOnDate", align:"left", width:125 },
        { columnName:"endOnDate", align:"left", width:125 },
        { columnName:"noOfDays", align:"left", width:75 },
        { columnName:"approvalStatus", align:"left", width:150 },
        { columnName:"statusChangedOn", align:"left", width:175 },
        { columnName:"statusChangedBy", align:"left", width:200 },
        { columnName: "action", align: "center", width: 100 },
    ]);

	const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [pageSizes] = useState([10, 25, 50, 100]);
    const [availableFilterOperations, setAvailableFilterOperations] = useState([
        "equal",
        "notEqual",
        "greaterThan",
        "greaterThanOrEqual",
        "lessThan",
        "lessThanOrEqual",
    ]);
    const [sortingStateColumnExtensions, setSortingStateColumnExtensions] = useState([
        { columnName: "action", sortingEnabled: false },
    ]);
    const [filteringStateColumnExtensions, setFilteringStateColumnExtensions] = useState([
        { columnName: "action", filteringEnabled: false },
    ]);

	const [defaultSorting, setDefaultSorting] = useState([]);
	const [defaultFilters, setDefaultFilters] = useState([]);

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

	// Custom Cell to Format Dates and Apply Styles
    const Cell = ({ column, value, row}) => {
        let formattedValue = value;
        let cellStyle = {};
        if (column.name === "approvalStatus") {
            if (row.isApproved == 1) {
                cellStyle = { color: 'green' }; // success color
            } else if (row.isDeclined == 1) {
                cellStyle = { color: 'red' }; // error color
            } else {
                cellStyle = { color: 'orange' }; // warning color
            }
        }

        return <TableCell style={cellStyle}>{formattedValue}</TableCell>;
    };

    // Custom Header Cell to Make Text Bold
    const HeaderCell = (props) => (
        <TableHeaderRow.Cell {...props} style={{ fontWeight: "bold" }} />
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
                    onSortingChange={setDefaultSorting}
                />
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                />
                <IntegratedPaging />
                <IntegratedFiltering />
                <IntegratedSorting />
                <Table
                    showSortingControls={true}
                    columnExtensions={tableColumnExtensions} 
                    noDataRowComponent={NoDataRow}
                    cellComponent={Cell}
                />
                <TableHeaderRow
                    cellComponent={HeaderCell}
                    showSortingControls={true}
                />
                {showFilter && <TableFilterRow showFilterSelector={true} /> }
                <PagingPanel
                    pageSizes={pageSizes}
                />
            </Grid>
        </Paper>
	);
};

F354ReportsTableComponent.propTypes = {
	rows: PropTypes.array,
	columns: PropTypes.array,
	showFilter: PropTypes.bool,
};

F354ReportsTableComponent.defaultProps = {
	rows: [],
	columns: [],
	showFilter: false,
};

export default F354ReportsTableComponent;
