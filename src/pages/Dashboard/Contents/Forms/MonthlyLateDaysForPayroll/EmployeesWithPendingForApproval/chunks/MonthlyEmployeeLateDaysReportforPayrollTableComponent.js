// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Paper } from "@material-ui/core";
// import {
//   SummaryState,
//   GroupingState,
//   IntegratedGrouping,
//   IntegratedSummary,
//   DataTypeProvider,
// } from "@devexpress/dx-react-grid";
// import {
//   Grid,
//   Table,
//   TableHeaderRow,
//   TableGroupRow,
//   TableSummaryRow,
// } from "@devexpress/dx-react-grid-material-ui";

// const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

// const CurrencyTypeProvider = (props) => (
//   <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
// );

// const CustomCell = ({ column, value, style, ...restProps }) => {
//   const isTopAligned =
//     column.name === "id" ||
//     column.name === "displayName" ||
//     column.name === "totalWorkingDays" ||
//     column.name === "totalAttendedDays" ||
//     column.name === "totalAttendanceMissingDays" ||
//     column.name === "missingAttendanceDates" ||
//     column.name === "totalLateDays" ||
//     column.name === "adjustedLateDays" ||
//     column.name === "adjustedAbsentDays" ||
//     column.name === "remarks";
//   return (
//     <Table.Cell
//       {...restProps}
//       style={{
//         ...style,
//         verticalAlign: isTopAligned ? "top" : "inherit",
//         paddingTop: isTopAligned ? "20px" : "inherit",
//         height: isTopAligned ? "100%" : "inherit",
//       }}
//     >
//       {value}
//     </Table.Cell>
//   );
// };

// const MonthlyEmployeeLateDaysReportforPayrollTableComponent = (props) => {
//   const [tableColumnExtensions] = useState([
//     { columnName: "id", align: "left" },
//     { columnName: "displayName", align: "left" },
//     { columnName: "totalWorkingDays", align: "right" },
//     { columnName: "totalAttendedDays", align: "right" },
//     { columnName: "totalAttendanceMissingDays", align: "right" },
//     { columnName: "missingAttendanceDates", align: "right" },
//     { columnName: "totalLateDays", align: "right" },
//     { columnName: "lateDates", align: "right" },
//     { columnName: "adjustedLateDays", align: "left", width: "150px" },
//     { columnName: "checkOut2", align: "left", width: "200px" },
//     { columnName: "remarks", align: "left" },
//   ]);

//   // const [groupSummaryItems] = useState([
//   //   { columnName: "totalNetHours", type: "sum" },
//   //   { columnName: "ratePerHour", type: "avg" },
//   // ]);

//   const { data, columns } = props;
//   const [currencyColumns] = useState(["perHourRate", "totalAmount"]);
//   const [expandedGroups, setExpandedGroups] = useState([]);

//   useEffect(() => {
//     setExpandedGroups(data.expandedGroupsData);
//   }, [data]);

//   const onExpandedGroupChange = (groups) => {
//     setExpandedGroups(groups);
//   };
//   const rows = data.teachersAttendanceSheetData || [];
//   return (
//     <Paper>
//       <Grid rows={rows} columns={columns}>
//         <CurrencyTypeProvider for={currencyColumns} />
//         <GroupingState
//           defaultExpandedGroups={expandedGroups}
//           expandedGroups={expandedGroups}
//           onExpandedGroupsChange={onExpandedGroupChange}
//         />
//         <SummaryState
//         //  groupItems={groupSummaryItems}
//         />
//         <IntegratedGrouping />
//         <IntegratedSummary />
//         <Table
//           columnExtensions={tableColumnExtensions}
//           cellComponent={(props) => <CustomCell {...props} />}
//         />
//         <TableHeaderRow />
//         <TableGroupRow />
//         <TableSummaryRow />
//       </Grid>
//     </Paper>
//   );
// };

// MonthlyEmployeeLateDaysReportforPayrollTableComponent.propTypes = {
//   data: PropTypes.object,
//   columns: PropTypes.array,
//   expandedGroups: PropTypes.array,
//   showFilter: PropTypes.bool,
// };

// MonthlyEmployeeLateDaysReportforPayrollTableComponent.defaultProps = {
//   data: {},
//   columns: [],
//   expandedGroups: [],
//   showFilter: false,
// };

// export default MonthlyEmployeeLateDaysReportforPayrollTableComponent;

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
    column.name === "adjustedAbsentDays" ||
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
const MonthlyEmployeeLateDaysReportforPayrollTableComponent = (props) => {
  // const filteredColumns = props.columns.filter(
  //   (column) => column.name !== "totalAmount" && column.name !== "ratePerHour"
  // );
  // const updatedData = {
  //   ...props,
  //   columns: filteredColumns,
  // };
  const [tableColumnExtensions] = useState([
    { columnName: "id", align: "left", width: "80px" },
    { columnName: "displayName", align: "left", width: "110px" },
    { columnName: "totalWorkingDays", align: "right", width: "50px" },
    { columnName: "totalAttendedDays", align: "right", width: "70px" },
    {
      columnName: "totalAttendanceMissingDays",
      align: "right",
      width: "100px",
    },
    { columnName: "missingAttendanceDates", align: "right", width: "150px" },
    { columnName: "pendingForApprovalFrom", align: "left", width: "200px" },
    { columnName: "lateDates", align: "right", width: "150px" },
    { columnName: "adjustedLateDays", align: "right", width: "300px" },
    { columnName: "checkOut2", align: "left", width: "150px" },
    { columnName: "sumLateTime", align: "left", width: "100px" },
    { columnName: "sumEarlyDeparture", align: "left", width: "120px" },
    { columnName: "sumBreakTime", align: "left", width: "100px" },
    { columnName: "sumOverTime", align: "left", width: "100px" },
    { columnName: "sumShortTime", align: "left", width: "100px" },
    { columnName: "adjustedAbsentDays", align: "right", width: "300px" },
    { columnName: "remarks", align: "left", width: "250px" },
  ]);

  // const [tableGroupColumn] = useState([{ columnName: "teacherLabel" }]);

  const [groupSummaryItems] = useState([
    { columnName: "netHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalHours", type: "sum" },
  ]);

  const [totalSummaryItems] = useState([
    { columnName: "netHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalAmount", type: "sum" },
  ]);

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
      {/* <div
        style={{
          maxHeight: "300px",
          overflow: "auto",
        }}
      > */}
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
        <Table
          columnExtensions={tableColumnExtensions}
          // cellComponent={(props) => <CustomCell {...props} />}
        />
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
      {/* </div> */}
    </Paper>
  );
};

MonthlyEmployeeLateDaysReportforPayrollTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

MonthlyEmployeeLateDaysReportforPayrollTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default MonthlyEmployeeLateDaysReportforPayrollTableComponent;
