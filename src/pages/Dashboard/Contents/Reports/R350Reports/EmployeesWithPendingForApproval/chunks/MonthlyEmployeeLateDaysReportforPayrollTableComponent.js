/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { SummaryState, GroupingState, IntegratedGrouping, IntegratedSummary, DataTypeProvider, } from "@devexpress/dx-react-grid";
import { Grid, Table, TableHeaderRow, TableGroupRow, TableSummaryRow, } from "@devexpress/dx-react-grid-material-ui";

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);


const MonthlyEmployeeLateDaysReportforPayrollTableComponent = (props) => {

  const [tableColumnExtensions] = useState([
    { columnName: "userId", align: "center", width: "80px" },
    { columnName: "userLabel", wordWrapEnabled:true },
    { columnName: "createdBy", wordWrapEnabled:true  },
    { columnName: "submittedTo", wordWrapEnabled:true  },
    { columnName: "pendingForApprovalFrom", wordWrapEnabled:true },
    { columnName: "adjustedLateDays", align: "center", width: "130px", wordWrapEnabled:true  },
    { columnName: "adjustedAbsentDays", align: "center", width: "120px", wordWrapEnabled:true },
    { columnName: "adjustedOverTime", align: "center", width: "120px", wordWrapEnabled:true },
    { columnName: "remarks", wordWrapEnabled:true },
  ]);


  const [groupSummaryItems] = useState([
    { columnName: "netHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" }
  ]);

  const [totalSummaryItems] = useState([
    { columnName: "netHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
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
      <Grid rows={rows} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
        />
        <SummaryState
          totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table
          columnExtensions={tableColumnExtensions}
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
