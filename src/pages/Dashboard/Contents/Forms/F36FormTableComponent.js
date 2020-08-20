import React, { Component } from "react";
import { Paper, Input, Typography } from "@material-ui/core";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  responsiveFontSizes,
} from "@material-ui/core/styles";
import {
  Column,
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
  DataTypeProviderProps,
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  Grid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableFilterRow,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  Toolbar,
  VirtualTable,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";

class F36FormTableComponent extends Component {
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
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "sectionLabel", wordWrapEnabled: true },
        { columnName: "courseLabel", wordWrapEnabled: true },
        { columnName: "label", wordWrapEnabled: true },
        { columnName: "nucleusId", width: 130},
        { columnName: "studentName", wordWrapEnabled:true},
        { columnName: "startDateReport", width: 130 },
        { columnName: "dueDateReport", width: 130 },
        { columnName: "totalMarks", width:130, align:"center" },
        { columnName: "fileDownload", width:130, align:"center" },
        { columnName: "instruction", wordWrapEnabled: true },
        { columnName: "action", width: 120, align:"center" },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
        { columnName: "fileDownload", filteringEnabled: false },
      ],
      defaultGrouping:[
        //{ columnName: 'programmeGroupLabel'},
      ],
      groupingStateColumnExtensions:[
        { columnName: 'SRNo', groupingEnabled: false},
        { columnName: 'fileDownload', groupingEnabled: false },
        { columnName: 'action', groupingEnabled: false }
      ],
      tableGroupColumnExtension:[
        { columnName:"programmeGroupLabel", showWhenGrouped: false }
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
      defaultGrouping,
      tableGroupColumnExtension,
      groupingStateColumnExtensions
    } = this.state;

    const rows = this.props.data;
    const columns = this.props.columns;
    const showFilter = this.props.showFilter;

    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
          <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions}/>
          <SortingState   defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions}/>
          <GroupingState defaultGrouping={defaultGrouping} columnExtensions={groupingStateColumnExtensions}/>
          <DragDropProvider />
          <PagingState defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <IntegratedGrouping />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow
            showGroupingControls
            showSortingControls={true}
            titleComponent={(props) =>
              props.children != "Action" && props.children != "Download" ? (
                <b>{props.children}</b>
              ) : (
                <b>&emsp;{props.children}</b>
              )
            }
          />
          <TableGroupRow icon columnExtensions={tableGroupColumnExtension}/>
          <Toolbar />
          <GroupingPanel showGroupingControls/>
          {showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}

export default F36FormTableComponent;
