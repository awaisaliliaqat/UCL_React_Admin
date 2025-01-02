import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import { Column, FilteringState, GroupingState, IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSelection, IntegratedSorting, PagingState, SelectionState, SortingState, DataTypeProvider, DataTypeProviderProps, } from "@devexpress/dx-react-grid";
import { DragDropProvider, Grid, GroupingPanel, PagingPanel, Table, TableFilterRow, TableGroupRow, TableHeaderRow, TableSelection, Toolbar, VirtualTable, TableColumnResizing, } from "@devexpress/dx-react-grid-material-ui";

class F82ReportsTableComponent extends Component {
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
        { columnName: "featureLabels", filteringEnabled: false },
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "srNo", width: 100 },
        { columnName: "id", width: 100 },
        { columnName: "label", wordWrapEnabled: true },
        { columnName: "featureLabels", wordWrapEnabled: true },
        { columnName: "action", width: 120 },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "featureLabels", filteringEnabled: false },
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
          <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions}/>
          <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions}/>
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table columnExtensions={tableColumnExtensions} />
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
      </Paper>
    );
  }
}

export default F82ReportsTableComponent;
