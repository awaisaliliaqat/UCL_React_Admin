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

const CustomCell = ({ column, value, style, ...restProps }) => {
  const isTopAligned =
    column.name === "id" ||
    column.name === "displayName" ||
    column.name === "totalWorkingDays" ||
    column.name === "totalAttendedDays" ||
    column.name === "totalAttendanceMissingDays" ||
    column.name === "missingAttendanceDates" ||
    column.name === "totalLateDays" ||
    column.name === "adjustedLateDays" ||
    column.name === "remarks";
  return (
    <Table.Cell
      {...restProps}
      style={{
        ...style,
        verticalAlign: isTopAligned ? "top" : "inherit",
        paddingTop: isTopAligned ? "20px" : "inherit",
        height: isTopAligned ? "100%" : "inherit",
      }}
    >
      {value}
    </Table.Cell>
  );
};

const F336MonthlyEmployeeAttendanceTableComponent = (props) => {
  const [tableColumnExtensions] = useState([
    { columnName: "id", align: "left" },
    { columnName: "displayName", align: "left" },
    { columnName: "totalWorkingDays", align: "right" },
    { columnName: "totalAttendedDays", align: "right" },
    { columnName: "totalAttendanceMissingDays", align: "right" },
    { columnName: "missingAttendanceDates", align: "right" },
    { columnName: "totalLateDays", align: "right" },
    { columnName: "lateDates", align: "right" },
    { columnName: "adjustedLateDays", align: "left", width: "150px" },
    { columnName: "checkOut2", align: "left", width: "200px" },
    { columnName: "remarks", align: "left" },
  ]);

  // const [groupSummaryItems] = useState([
  //   { columnName: "totalNetHours", type: "sum" },
  //   { columnName: "ratePerHour", type: "avg" },
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
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
        />
        <SummaryState
        //  groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table
          columnExtensions={tableColumnExtensions}
          cellComponent={(props) => <CustomCell {...props} />}
        />
        <TableHeaderRow />
        <TableGroupRow />
        <TableSummaryRow />
      </Grid>
    </Paper>
  );
};

F336MonthlyEmployeeAttendanceTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F336MonthlyEmployeeAttendanceTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F336MonthlyEmployeeAttendanceTableComponent;
