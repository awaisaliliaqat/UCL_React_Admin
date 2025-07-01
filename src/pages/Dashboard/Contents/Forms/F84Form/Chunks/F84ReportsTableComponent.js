import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress"; // Import loader component
import {
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  SortingState,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  PagingPanel,
  Table,
  TableFilterRow,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";

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
      pageSizes: [5, 10, 15, 20],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "id", width: 80 },
        { columnName: "displayName", wordWrapEnabled: true },
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

    return (
      <Paper>
        {isLoading ? ( // Show loader when isLoading is true
          <div style={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid rows={rows} columns={columns}>
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
        )}
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
