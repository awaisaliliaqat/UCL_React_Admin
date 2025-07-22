/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import {
  SummaryState,
  GroupingState,
  IntegratedGrouping,
  IntegratedSummary,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableGroupRow,
  TableSummaryRow,
} from "@devexpress/dx-react-grid-material-ui";

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const F324ViewRecordForHODTableComponent = (props) => {
  // const filteredColumns = props.columns.filter(
  //   (column) => column.name !== "totalAmount" && column.name !== "ratePerHour"
  // );
  // const updatedData = {
  //   ...props,
  //   columns: filteredColumns,
  // };
  const [tableColumnExtensions] = useState([
    { columnName: "totalSchedules", align: "right" },
    { columnName: "totalAttended", align: "right" },
    { columnName: "durationPerSession", align: "right" },
    { columnName: "totalHours", align: "right" },
    { columnName: "totalAdjustedHours", align: "right" },
    { columnName: "totalNetHours", align: "right" },
    { columnName: "ratePerHour", align: "right" },
    { columnName: "totalAmount", align: "right" },
  ]);

  const [tableGroupColumn] = useState([{ columnName: "teacherLabel" }]);

  const [groupSummaryItems] = useState([
    { columnName: "totalNetHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalNetHours", type: "sum" },
  ]);

  // const [totalSummaryItems] = useState([
  //   { columnName: "totalNetHours", type: "sum" },
  //   { columnName: "ratePerHour", type: "avg" },
  //   // { columnName: "totalNetHours", type: "sum" },
  // ]);

  const { data, columns } = props;
  const [currencyColumns] = useState(["perHourRate", "totalAmount"]);
  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    setExpandedGroups(data.expandedGroupsData);
  }, [data]);

  const onExpandedGroupChange = (groups) => {
    setExpandedGroups(groups);
  };
  const rows = data.teachersAttendanceSheetData || [];
  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          defaultGrouping={tableGroupColumn}
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
          grouping={tableGroupColumn}
        />
        <SummaryState
          // totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow
          titleComponent={(props) =>
            props.children === "Action" ? (
              <b>&emsp;{props.children}</b>
            ) : (
              <b>{props.children}</b>
            )
          }
        />
        <TableGroupRow icon />
        <TableSummaryRow />
      </Grid>
    </Paper>
  );
};

F324ViewRecordForHODTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F324ViewRecordForHODTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F324ViewRecordForHODTableComponent;
