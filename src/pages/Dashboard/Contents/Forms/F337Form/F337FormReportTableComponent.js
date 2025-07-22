import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow, } from "@devexpress/dx-react-grid-material-ui";

class F337FormReportTableComponent extends Component {
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
        { columnName: "SRNo", width: 100 },
        //{ columnName: "ID", width: 100 },
        // { columnName: "shortLabel", wordWrapEnabled: true },
        { columnName: "label", wordWrapEnabled: true },
        { columnName: "action", width: 130 },
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

    const rows = this.props.data;
    const columns = this.props.columns;
    const showFilter = this.props.showFilter;

    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
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
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          {/* <IntegratedSelection /> */}
          {/* <DragDropProvider /> */}
          <Table columnExtensions={tableColumnExtensions} />
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

export default F337FormReportTableComponent;
