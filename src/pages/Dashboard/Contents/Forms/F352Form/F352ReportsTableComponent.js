import React, { Component } from "react";
import { Box, CircularProgress, Paper, TableCell, TableRow } from "@material-ui/core";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState } from "@devexpress/dx-react-grid";

class F352ReportsTableComponent extends Component {
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
      pageSizes: [10, 25, 50, 100],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "srNo", width: 100 },
        { columnName: "label", wordWrapEnabled: true },
        // { columnName: "defaultQuota", width: 100 },
        { columnName: "action", width: 120 },
      ],
      defaultColumnWidths: [
        { columnName: "ID", minWidth: 100, maxWidth: 100 },
        // { columnName: "shortLabel", minWidth: 100, maxWidth: 100 },
        { columnName: "label", minWidth: 100, maxWidth: 100 },
        { columnName: "action", minWidth: 100, maxWidth: 100 },
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
      defaultColumnWidths,
      columnBands,
      pageSizes,
    } = this.state;

    const {isLoading, rows, columns,  showFilter} = this.props;

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
          <FilteringState
            defaultFilters={defaultFilters}
            columnExtensions={filteringStateColumnExtensions}
          />
          <SortingState
            defaultSorting={defaultSorting}
            columnExtensions={sortingStateColumnExtensions}
          />
          {/* <SelectionState />  */}
          {/* <GroupingState defaultGrouping={[{ columnName: 'product' }]} defaultExpandedGroups={['EnviroCare Max']} /> */}
          <PagingState defaultCurrentPage={1} defaultPageSize={pageSizes[1]} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          {/* <IntegratedSelection /> */}
          {/* <DragDropProvider /> */}
          <Table columnExtensions={tableColumnExtensions} noDataRowComponent={NoDataRow} />
          {/* <TableColumnResizing columnExtensions={defaultColumnWidths}/> */}
          {/* <TableSelection showSelectAll={true} /> */}
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
          {/* <Toolbar /> */}
        </Grid>
      </Paper>
    );
  }
}

export default F352ReportsTableComponent;
