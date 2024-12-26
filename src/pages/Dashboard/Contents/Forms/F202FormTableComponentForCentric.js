import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { GroupingState, IntegratedGrouping } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableGroupRow,
} from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";

class F202FormTableComponentForCentric extends Component {
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
      tableColumnExtensions: [
        { columnName: "serialNo", width: 120 },
        { columnName: "termLabel", wordWrapEnabled: true },
      ],

      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [],
    };
  }

  render() {

    // eslint-disable-next-line no-unused-vars
    const GroupCellContent = ({ column, row }) => (
        <span>
          <strong>
            {row.value}
          </strong>
        </span>
      );

    const { tableColumnExtensions } = this.state;

    const { rows, columns } = this.props;

    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
          <GroupingState grouping={[{ columnName: "sectionLabel" }]} />
          <IntegratedGrouping />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow
            showSortingControls={false}
            titleComponent={(props) =>
              props.children != "Action" ? (
                <b>{props.children}</b>
              ) : (
                <b>&emsp;{props.children}</b>
              )
            }
          />
          <TableGroupRow contentComponent={GroupCellContent} />
        </Grid>
      </Paper>
    );
  }
}

F202FormTableComponentForCentric.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  showFilter: PropTypes.bool,
};

F202FormTableComponentForCentric.defaultProps = {
  columns: [],
  rows: [],
  showFilter: false,
};

export default F202FormTableComponentForCentric;
