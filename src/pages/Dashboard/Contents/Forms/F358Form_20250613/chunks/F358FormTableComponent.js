import React, { useState } from "react";
import PropTypes from "prop-types";
import { Paper, CircularProgress, TableRow, TableCell, Box, Button } from "@material-ui/core";
import { SummaryState, IntegratedSummary, DataTypeProvider, EditingState, IntegratedFiltering, FilteringState } from "@devexpress/dx-react-grid";
import { Grid, VirtualTable, TableHeaderRow, TableFixedColumns, TableEditRow, TableEditColumn, TableFilterRow } from "@devexpress/dx-react-grid-material-ui";
import { Tooltip } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTheme } from '@material-ui/core/styles';
import debounce from 'lodash.debounce'
import ChatBox from "./F358ChatBox";

// Sticky header logic
const StickyHeaderCell = ({
	style,
	getCellWidth,
	onWidthDraft,
	onWidthDraftCancel,
	onWidthDraftStart,
	onWidthDraftUpdate,
	onWidthChange,
	resizingEnabled,
	draggingEnabled,
	...restProps
}) => {
	return (
		<VirtualTable.Cell
			{...restProps}
			style={{
				...style,
				// top: 0,
				// zIndex: 10,
				// position: "sticky",
				// background: "#fff",
				// borderBottom: "1px solid #ccc",
			}}
		/>
	);
};

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
	<DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const EditCell = ({ errors, ...props }) => {
	const { children } = props;
	return (
	  <TableEditColumn.Cell {...props}>
		{React.Children.map(children, child => (
		  child?.props.id === 'commit'
			? React.cloneElement(child, { disabled: errors[props.tableRow.rowId] })
			: child
		))}
	  </TableEditColumn.Cell>
	);
  };
  
  // Maps the rows to a single object in which each field are is a row IDs
  // and the field's value is true if the cell value is invalid (a column is required
  // but the cell value is empty)
//   const validate = (rows, columns) => Object.entries(rows).reduce(
// 	(acc, [rowId, row]) => ({
// 	  ...acc,
// 	  [rowId]: columns.some(column => column.required && (row[column.name] === '' || !isFinite(Number(row[column.name])) || Number(row[column.name])<=0)),
// 	}), {},
//   );

const validate = (rows, columns) =>
	Object.entries(rows).reduce((acc, [rowId, row]) => {
	  const finalRate = Number(row.finalRateNextYear);
	  const finalSalary = Number(row.finalSalaryNextYear);
	  console.info(row.finalRateNextYear+" - "+row.finalSalaryNextYear);
	  console.info(finalRate+" - "+finalSalary);
	  const hasValidRate = isFinite(finalRate);
	  const hasValidSalary = isFinite(finalSalary);
	  const oneIsGreaterThanZero = finalRate > 0 || finalSalary > 0;
	  const isInvalid = !(hasValidRate && hasValidSalary && oneIsGreaterThanZero);
	  return { ...acc, [rowId]: isInvalid };
	}, {});

const getRowId = row => row.id; 

const F358FormTableComponent = (props) => {

	const [tableColumnExtensions] = useState([
		{ columnName: "finalRateNextYear", align: "center", wordWrapEnabled: true, width:90 },
		{ columnName: "finalSalaryNextYear", align: "center", wordWrapEnabled: true, width:90 },
		{ columnName: "id", align: "left", width: 90 },
		{ columnName: "displayName", align: "left", wordWrapEnabled: true },
		{ columnName: "designationsLabel", align: "left", wordWrapEnabled: true },
		{ columnName: "rolesLabel", align: "center", wordWrapEnabled: true },
		{ columnName: "jobStatusLabel", align: "center", wordWrapEnabled: true },
		{ columnName: "weeklyLoadThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "weeklyLoadNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "weeklyClaimHoursThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "weeklyClaimHoursNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "monthsThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "monthsNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlyClaimThisYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlyClaimNextYear", align: "center", wordWrapEnabled: true },
		{ columnName: "yearlySalaryThisYear", align: "right", wordWrapEnabled: true },
		{ columnName: "yearlySalaryNextYear", align: "right", wordWrapEnabled: true },
		{ columnName: "yearlyExpenseThisYear", align: "right", wordWrapEnabled: true },
		{ columnName: "yearlyExpenseNextYear", align: "right", wordWrapEnabled: true },
		{ columnName: "rateThisYear", align: "right", wordWrapEnabled: true },
		{ columnName: "rateNextYear", align: "right", wordWrapEnabled: true },
		{ columnName: "rateIncreasePercentage", align: "center", wordWrapEnabled: true },
		{ columnName: "salaryNextYear", align: "right", wordWrapEnabled: true },
		{ columnName: "salaryIncreasePercentage", align: "center", wordWrapEnabled: true },
		{ columnName: "percentChange", align: "center", wordWrapEnabled: true },
		{ columnName: "comment", align: "left", wordWrapEnabled: true, width: 250 },
		{ columnName: "chat", align: "left", wordWrapEnabled: true, width: 300 },
	]);

	const [groupSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [totalSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [editingColumnExtensions] = useState([
		{ columnName: 'finalRateNextYear', editingEnabled: true },
		{ columnName: 'finalSalaryNextYear', editingEnabled: true },
		{ columnName: 'rolesLabel', editingEnabled: false },
		{ columnName: 'id', editingEnabled: false },
		{ columnName: 'displayName', editingEnabled: false },
		{ columnName: 'jobStatusLabel', editingEnabled: false },
		{ columnName: 'weeklyLoadThisYear', editingEnabled: false },
		{ columnName: 'weeklyLoadNextYear', editingEnabled: false },
		{ columnName: "weeklyClaimHoursThisYear", editingEnabled: false },
		{ columnName: "weeklyClaimHoursNextYear", editingEnabled: false },
		{ columnName: 'designationsLabel', editingEnabled: false },
		{ columnName: 'joiningDate', editingEnabled: false },
		{ columnName: 'leavingDate', editingEnabled: false },
		{ columnName: 'weeklyLoadThisYear', editingEnabled: false },
		{ columnName: 'weeklyLoadNextYear', editingEnabled: false },
		{ columnName: 'rateThisYear', editingEnabled: false },
		{ columnName: 'rateNextYear', editingEnabled: false },
		{ columnName: 'rateIncreasePercentage', editingEnabled: false },
		{ columnName: 'monthsThisYear', editingEnabled: false },
		{ columnName: 'monthsNextYear', editingEnabled: false },
		{ columnName: 'salaryThisYear', editingEnabled: false },
		{ columnName: 'salaryNextYear', editingEnabled: false },
		{ columnName: 'salaryIncreasePercentage', editingEnabled: false },
		{ columnName: 'yearlyClaimThisYear', editingEnabled: false },
		{ columnName: 'yearlyClaimNextYear', editingEnabled: false },
		{ columnName: 'yearlySalaryThisYear', editingEnabled: false },
		{ columnName: 'yearlySalaryNextYear', editingEnabled: false },
		{ columnName: 'yearlyExpenseThisYear', editingEnabled: false },
		{ columnName: 'yearlyExpenseNextYear', editingEnabled: false },
		{ columnName: 'percentChange', editingEnabled: false },
		{ columnName: 'comment', editingEnabled: false },
		{ columnName: 'chat', editingEnabled: false }
		// Add more as needed
	]);

	const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE, "finalRateNextYear", "finalSalaryNextYear", "id", "displayName"]);

	const { isLoading, showTableFilter, rows, columns, onCommitChanges } = props;

	const [currencyColumns] = useState(["finalRateNextYear","finalSalaryNextYear","rateThisYear", "salaryThisYear", "rateNextYear", "salaryNextYear", "yearlySalaryThisYear", "yearlySalaryNextYear", "yearlyExpenseThisYear", "yearlyExpenseNextYear"]);

	const NoDataRow = () => (
		<TableRow>
			<TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
				{isLoading ? (
					<CircularProgress size={36} />
				) : (
					<Box color="primary.light" fontSize="1rem">No Data</Box>
				)}
			</TableCell>
		</TableRow>
	);

	const EditCommandComponent = (props) => {
		//console.log(props);
		const { id, onExecute, disabled } = props;
		const theme = useTheme();
		let icon = null;
		let tooltip = '';
		let style = {};
		switch (id) {
			case 'edit':
				icon = <EditIcon />;
				tooltip = 'Edit';
				style = { color: theme.palette.warning.main, minWidth: 40, padding: 4 }; // 🟠 warning color
				break;
			case 'delete':
				icon = <DeleteIcon />;
				tooltip = 'Delete';
				style = { color: theme.palette.error.main, minWidth: 40, padding: 4 }; // 🔴 error color
				break;
			case 'commit':
				icon = <DoneAllOutlinedIcon />;
				tooltip = 'Finalize';
				style = disabled ? { color: theme.palette.grey ? theme.palette.grey.light : theme.palette.primary.main, minWidth: 40, padding: 4 } : 
									{ color: theme.palette.success ? theme.palette.success.main : theme.palette.primary.main, minWidth: 40, padding: 4 }; // ✅ success (fallback to primary)
				
				break;
			case 'cancel':
				icon = <CancelIcon />;
				tooltip = 'Cancel';
				style = { color: theme.palette.error.main, minWidth: 40, padding: 4 };
				break;
			default:
				return null;
		}
		return (
			<Tooltip title={tooltip}>
				<span>
					<Button 
						onClick={onExecute} 
						style={style}
						disabled={disabled}
					>
						{icon}
					</Button>
				</span>
			</Tooltip>
		);
	};

	const [editingRowIds, setEditingRowIds] = useState([]);

	const [errors, setErrors] = useState({});

	const handleEditingRowIdsChange = (rowIds) => {
		const allowedIds = rowIds.filter(id => {
			const row = rows.find(row => row.id === id);
			return row?.isFinalized !== 1;
		});
		setEditingRowIds(allowedIds);
	};

	const EditCellCustom = (props) => {
		//console.info("EditCellCustomProps : ", props);
		const { row, column, children, ...restProps } = props;
		const isFinalized = row?.isFinalized !== 1;
		return (
			<TableEditColumn.Cell {...restProps}>
				{isFinalized ? children : <Box color="primary.main">Finalized</Box>}
			</TableEditColumn.Cell>
		);
	};
	
	// const onEdited = debounce(edited => setErrors(validate(edited, columns)), 250);
	const onEdited = debounce((edited) => {
		const merged = Object.entries(edited).reduce((acc, [rowId, changes]) => {
		  const existingRow = rows.find((r) => r.id === Number(rowId)) || {};
		  acc[rowId] = { ...existingRow, ...changes };
		  return acc;
		}, {});
		setErrors(validate(merged, columns));
	  }, 250);

	return (
		<Paper>
			<Grid
				rows={isLoading ? [] : rows}
				columns={columns}
				getRowId={getRowId}
			>
				<FilteringState />
				<IntegratedFiltering />
				<CurrencyTypeProvider
					for={currencyColumns}
				/>
				<SummaryState
					totalItems={totalSummaryItems}
					groupItems={groupSummaryItems}
				/>
				<IntegratedSummary />
				<EditingState
					editingRowIds={editingRowIds}
					onEditingRowIdsChange={handleEditingRowIdsChange}
					columnExtensions={editingColumnExtensions}
					onCommitChanges={onCommitChanges}
					onRowChangesChange={onEdited}
				/>
				<VirtualTable
					noDataRowComponent={NoDataRow}
					columnExtensions={tableColumnExtensions}
				/>
				<TableHeaderRow 
					cellComponent={StickyHeaderCell} 
				/>
				{showTableFilter ? <TableFilterRow showFilterSelector /> : null}
				{/* <TableEditRow /> */}
				<TableEditRow
					cellComponent={(props) => {
						if (props.column.name === 'chat') {
						const rowId = props.row.id;
						const value = Array.isArray(props.row.chat) ? props.row.chat : [];

						const handleChatChange = (newChatList) => {
							props.onValueChange({ ...props.row, chat: newChatList });
						};

						return (
							<TableCell style={{ padding: 8 }}>
							<ChatBox
								id={rowId}
								value={value}
								onChange={handleChatChange}
							/>
							</TableCell>
						);
						}

						return <TableEditRow.Cell {...props} />;
					}}
				/>
				<TableEditColumn
					showEditCommand
					width={130}
					commandComponent={EditCommandComponent}
					//cellComponent={EditCell}
					cellComponent={(props) => {
						const row = props.tableRow?.row;
						const isFinalized = row?.isFinalized === 1;
						return isFinalized ? <EditCellCustom {...props} /> : <EditCell {...props} errors={errors} />;
					}}
				/>
				<TableFixedColumns
					leftColumns={leftFixedColumns}
				/>
			</Grid>
		</Paper>
	);
};

F358FormTableComponent.propTypes = {
	data: PropTypes.object,
	columns: PropTypes.array,
	expandedGroups: PropTypes.array,
	showFilter: PropTypes.bool,
};

F358FormTableComponent.defaultProps = {
	data: {},
	columns: [],
	expandedGroups: [],
	showFilter: false,
};

export default F358FormTableComponent;
