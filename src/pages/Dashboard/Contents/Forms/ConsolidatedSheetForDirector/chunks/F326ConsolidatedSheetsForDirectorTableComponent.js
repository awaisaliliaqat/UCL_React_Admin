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

const F326ConsolitdatedSheetsForDirectorTableComponent = (props) => {
  console.log(props);
  const [tableColumnExtensions] = useState([
    { columnName: "monthLabel", align: "right" },
    { columnName: "totalSchedules", align: "right" },
    { columnName: "totalAttended", align: "right" },
    { columnName: "durationPerSession", align: "right" },
    { columnName: "totalHours", align: "right" },
    { columnName: "ratePerHour", align: "right" },
    { columnName: "totalAmount", align: "right" },
    { columnName: "totalAdjustedHours", align: "right" },
    { columnName: "adjustmentRemarks", align: "right" },
    { columnName: "totalNetHours", align: "right" },
  ]);

  // const [groupSummaryItems] = useState([
  //   { columnName: "totalHours", type: "sum" },
  //   { columnName: "ratePerHour", type: "avg" },
  //   { columnName: "totalAmount", type: "sum" },
  // ]);

  const [totalSummaryItems] = useState([
    { columnName: "totalNetHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    { columnName: "totalAmount", type: "sum" },
  ]);

  const { data, columns } = props;
  const [currencyColumns] = useState(["ratePerHour", "totalAmount"]);
  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    setExpandedGroups(props.expandedGroups);
  }, [props.expandedGroups]);

  const onExpandedGroupChange = (groups) => {
    setExpandedGroups(groups);
  };

  // Transforming the data to include month labels
  const transformedData = data.teachersAttendanceSheetData
    .map((monthData) => {
      return monthData.detail.map((item) => ({
        ...item,
        monthLabel: `${monthData.monthLabel} (${
          monthData.year ? monthData.year : ""
        })`,
        teacherLabel: item.teacherLabel,
      }));
    })
    .flat();

  return (
    <Paper>
      <Grid rows={transformedData} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          defaultGrouping={[
            { columnName: "monthLabel" },
            { columnName: "teacherLabel" },
          ]}
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
        />
        <SummaryState
          totalItems={totalSummaryItems}
          // groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow />
        <TableGroupRow />
        <TableSummaryRow />
      </Grid>
    </Paper>
  );
};

F326ConsolitdatedSheetsForDirectorTableComponent.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F326ConsolitdatedSheetsForDirectorTableComponent.defaultProps = {
  expandedGroups: [],
  showFilter: false,
};

export default F326ConsolitdatedSheetsForDirectorTableComponent;
