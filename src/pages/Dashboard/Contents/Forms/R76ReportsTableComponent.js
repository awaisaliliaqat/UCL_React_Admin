import React, { Component } from "react";
import { Paper, Input, Typography } from "@material-ui/core";
import {createStyles, withStyles, WithStyles, Theme, responsiveFontSizes,} from "@material-ui/core/styles";
import {Column, FilteringState, GroupingState, IntegratedFiltering, IntegratedGrouping,
  IntegratedPaging, IntegratedSelection, IntegratedSorting, PagingState, SelectionState,
  SortingState, DataTypeProvider, DataTypeProviderProps} from "@devexpress/dx-react-grid";
import {DragDropProvider, Grid, GroupingPanel, PagingPanel, Table, TableFilterRow, TableGroupRow,
  TableHeaderRow, TableSelection, Toolbar, VirtualTable, TableColumnResizing} from "@devexpress/dx-react-grid-material-ui";

class R76ReportsTableComponent extends Component {
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
        { columnName: "fileDownload", sortingEnabled: false },
        { columnName: "solutionFileDownload", sortingEnabled: false },
        { columnName: "helpingMaterialFileDownload", filteringEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "teacher", wordWrapEnabled: true },
        { columnName: "startTimestampReport", width: 180 },
        { columnName: "endTimestampReport", width: 180 },
        { columnName: "totalMarks", width: 100, align:"center" },
        { columnName: "fileDownload", width: 75, align:"center" },
        { columnName: "label", wordWrapEnabled: true },
        { columnName: "sectionLabel", wordWrapEnabled: true },
        { columnName: "instruction", wordWrapEnabled: true },
        { columnName: "action", width: 120 },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
        { columnName: "fileDownload", filteringEnabled: false },
        { columnName: "solutionFileDownload", filteringEnabled: false },
        { columnName: "helpingMaterialFileDownload", filteringEnabled: false },
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
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow
            showSortingControls={true}
            titleComponent={(props) =>
              props.children!="Action" && props.children!="Exam" ? (
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

export default R76ReportsTableComponent;