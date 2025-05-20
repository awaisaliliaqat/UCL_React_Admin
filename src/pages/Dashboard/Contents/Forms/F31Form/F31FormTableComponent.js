import React, { Component } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
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

class F31FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "SRNo", title: "SR#" },
        { name: "courseLabel", title: "Course" },
        { name: "sectionTypeLabel", title: "Section\xa0Type" },
        { name: "sectionLabel", title: "Section\xa0Title" },
        { name: "teacherName", title: "Teacher" },
        { name: "activeDate", title: "Effective Date" },
        { name: "action", title: "Action" },
      ],
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
        { columnName: "SRNo", width: 100 },
        { columnName: "courseLabel", wordWrapEnabled: true },
        { columnName: "sectionTypeLabel", wordWrapEnabled: true },
        { columnName: "sectionLabel", wordWrapEnabled: true },
        { columnName: "teacherName", wordWrapEnabled: true },
        { columnName: "activeDate", width: 120 },
        { columnName: "action", width: 210, align: "center" },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ],
      showFilter: true,
    };
  }

  componentDidMount() {
    this.timerID = setTimeout(
      () => this.setState({ showFilter: this.props.showFilter }),
      0
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.showFilter !== prevProps.showFilter) {
      this.setState(() => ({ showFilter: this.props.showFilter }));
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  render() {
    const {
      //rows,
      columns,
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

    const rows = this.props.rows || [];

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
              props.children != "Action" ? (
                <b>{props.children}</b>
              ) : (
                <b>&emsp;{props.children}</b>
              )
            }
          />
          {this.state.showFilter && (
            <TableFilterRow showFilterSelector={true} />
          )}
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}

export default F31FormTableComponent;

F31FormTableComponent.propTypes = {
  showFilter: PropTypes.bool,
};

F31FormTableComponent.defaultProps = {
  showFilter: true,
};
