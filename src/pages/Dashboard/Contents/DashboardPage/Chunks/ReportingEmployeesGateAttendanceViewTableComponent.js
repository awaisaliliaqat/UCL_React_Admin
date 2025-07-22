import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow, } from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";
import { CircularProgress, TableRow, TableCell, Box } from "@material-ui/core";

class ReportingEmployeesGateAttendanceViewTableComponent extends Component {
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
      pageSizes: [100, 200, 500, 1000],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "id", width: 100 },
        { columnName: "edit", width: 70 },
        { columnName: "approve", width: 70 },
        { columnName: "reject", width: 70 },
      ],

      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ],
    };
  }

  render() {

    const { rows, columns, showFilter, isLoading  } = this.props;

    const { tableColumnExtensions, defaultSorting, sortingStateColumnExtensions, filteringStateColumnExtensions, defaultFilters, pageSizes, } = this.state;

    // eslint-disable-next-line no-unused-vars
    const cellComponent = ({ cellProps, ...restProps }) => {
      return (
        <Table.Cell
          {...restProps}
          style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        />
      );
    };

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
      <div style={{ overflowX: "auto", width: "100%" }}>
        <Grid rows={isLoading ? [] : rows} columns={columns}>
          <FilteringState
            defaultFilters={defaultFilters}
            columnExtensions={filteringStateColumnExtensions}
          />
          <SortingState
            defaultSorting={defaultSorting}
            columnExtensions={sortingStateColumnExtensions}
          />
          <PagingState defaultCurrentPage={0} defaultPageSize={pageSizes[0]} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table
            cellComponent={cellComponent}
            columnExtensions={tableColumnExtensions}
            noDataRowComponent={NoDataRow}
          />
          <TableHeaderRow
            showSortingControls={true}
            titleComponent={(props) =>
              props.children != "Action" ? (
                <b>{props.children}</b>
              ) : (
                <b>&emsp;{props.children}</b>
              )
            }
          />

          {showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </div>
    );
  }
}

ReportingEmployeesGateAttendanceViewTableComponent.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  showFilter: PropTypes.bool,
  isLoading: PropTypes.bool
};

ReportingEmployeesGateAttendanceViewTableComponent.defaultProps = {
  columns: [],
  rows: [],
  showFilter: false,
  isLoading: false
};

export default ReportingEmployeesGateAttendanceViewTableComponent;
