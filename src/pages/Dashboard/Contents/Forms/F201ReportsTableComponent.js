import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import { FilteringState, IntegratedFiltering, IntegratedPaging,
  IntegratedSorting, PagingState, SortingState } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";

class F201FormTableComponentForCentric extends Component {
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
        { columnName: "action", sortingEnabled: false }
      ],
      tableColumnExtensions: [
        { columnName: "academicsSessionLabel", wordWrapEnabled: true },
        { columnName: "programmeGroupLabel", wordWrapEnabled: true },
        { columnName: "sessionTermLabel", wordWrapEnabled: true },
        { columnName: "sectionLabel", wordWrapEnabled: true },
        { columnName: "noOfAssessment", width: 100, align:"center" },
        { columnName: "action", width: 100, align:"center"}
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ],
    };
  }

  render() {
    const {
      tableColumnExtensions,
      defaultSorting,
      sortingStateColumnExtensions,
      filteringStateColumnExtensions,
      defaultFilters,
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
              props.children!="Action" ? (
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

F201FormTableComponentForCentric.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  showFilter: PropTypes.bool,


}

F201FormTableComponentForCentric.defaultProps = {
  columns: [],
  data: [],
  showFilter: false,
}

export default F201FormTableComponentForCentric;
