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

const F333SalaryHistoryViewTableComponent = (props) => {
  // const filteredColumns = props.columns.filter(
  //   (column) => column.name !== "totalAmount" && column.name !== "ratePerHour"
  // );
  // const updatedData = {
  //   ...props,
  //   columns: filteredColumns,
  // };

  const [tableColumnExtensions] = useState([
    { columnName: "salarySlipMonth", align: "right" },
    { columnName: "leaveInCashDays", align: "right" },
    { columnName: "leaveInCashAmount", align: "right" },
    { columnName: "netSalary", align: "right" },
    { columnName: "perMonthSalary", align: "right" },
    { columnName: "grossSalary", align: "right" },
    // { columnName: "adjustedHours", align: "right" },
    // { columnName: "netHours", align: "right" },
  ]);

  // const [tableGroupColumn] = useState([{ columnName: "employeeLabel" }]);

  const [groupSummaryItems] = useState([
    // { columnName: "perMonthSalary", type: "sum" },
    // { columnName: "grossSalary", type: "avg" },
    // { columnName: "totalHours", type: "sum" },
  ]);

  const [totalSummaryItems] = useState([
    // { columnName: "perMonthSalary", type: "sum" },
    // { columnName: "grossSalary", type: "avg" },
    // { columnName: "totalAmount", type: "sum" },
  ]);

  console.log(props.columns);

  const { data, columns } = props;
  const [currencyColumns] = useState(["perHourRate", "totalAmount"]);
  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    setExpandedGroups(data.expandedGroupsDataMonthlyUpdated);
  }, [data]);

  const onExpandedGroupChange = (groups) => {
    setExpandedGroups(groups);
  };
  const rows = data.teacherAtttendanceSheetDataMonthlyUpdated || [];
  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          // defaultGrouping={tableGroupColumn}
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
          // grouping={tableGroupColumn}
        />
        <SummaryState
          totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table />
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

F333SalaryHistoryViewTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F333SalaryHistoryViewTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F333SalaryHistoryViewTableComponent;
