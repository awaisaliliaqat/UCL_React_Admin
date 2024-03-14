import React, { Component } from "react";
import PropTypes from 'prop-types';
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


class AnnoucementReportsTableComponent extends Component {
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
        { columnName: "groupAnouncement", sortingEnabled: false },
        { columnName: "sectionAnouncement", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "groupAnouncement", wordWrapEnabled: true },
        { columnName: "sectionAnouncement", wordWrapEnabled: true },
        { columnName: "label", wordWrapEnabled: true, width: 200 },
        { columnName: "anouncementDate", width: 200 },
        { columnName: "anouncementDetails", wordWrapEnabled: true },
        { columnName: "createdOn", width: 200 },
        { columnName: "action", width: 110 },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
        { columnName: "groupAnouncement", filteringEnabled: false },
        { columnName: "sectionAnouncement", filteringEnabled: false },
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
          {showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}

AnnoucementReportsTableComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  showFilter: PropTypes.bool
}

AnnoucementReportsTableComponent.defaultProps = {
  data: [],
  columns: [],
  showFilter: false
}

export default AnnoucementReportsTableComponent;
