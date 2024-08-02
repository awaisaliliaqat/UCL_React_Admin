import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState} from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
class R314StudentsListTableComponent extends Component {
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
        { columnName: "SRNo", width: 100 },
        { columnName: "nucluesId", wordWrapEnabled: true },
        { columnName: "studentName", wordWrapEnabled: true },
        { columnName: "programmeLabel", wordWrapEnabled: true },
        { columnName: "pathway", wordWrapEnabled: true },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
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
    const TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        // eslint-disable-next-line no-alert
        onContextMenu={
          (e) => this.props.onHandleRightClick(e, row)
        }
        style={{
          cursor: 'default',
        }}
      />
    );

    const StyledTableRow = withStyles(() => ({
      root: {
        "&:hover":{
            backgroundColor:"#E5E4E2"
          }
      },
    }))(TableRow);

    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
          <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions}/>
          <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions}/>
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table  rowComponent={StyledTableRow} columnExtensions={tableColumnExtensions} />
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

R314StudentsListTableComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  showFilter: PropTypes.bool,
  onHandleRightClick: PropTypes.func
};

R314StudentsListTableComponent.defaultProps = {
  data: [],
  columns: [],
  showFilter: false,
  onHandleRightClick: fn => fn
}

export default R314StudentsListTableComponent;
