import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import GridMaterial from '@material-ui/core/Grid';
import { TextField, Paper, CircularProgress, TableRow, TableCell, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@material-ui/core";
import { Plugin, Template, TemplateConnector, TemplatePlaceholder, } from '@devexpress/dx-react-core';
import { SummaryState, IntegratedSummary, DataTypeProvider, EditingState, IntegratedFiltering, FilteringState } from "@devexpress/dx-react-grid";
import { Grid, VirtualTable, TableHeaderRow, TableFixedColumns, TableEditRow, TableEditColumn, TableFilterRow } from "@devexpress/dx-react-grid-material-ui";
import { IconButton, Tooltip } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTheme } from '@material-ui/core/styles';
import F357ChatBox from "./F357ChatBox"
import { Skeleton } from "@material-ui/lab";


const Popup = ({ row, onApplyChanges, onCancelChanges, open, }) => {

	const [state, setState] = useState({ ...row });

	const theme = useTheme();

  	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		if (open) {
			setState({ ...row });
		}
	}, [open, row]);

	const formatNumber = (num) => isNaN(num = parseFloat(num)) ? 0 : Math.round((num + Number.EPSILON) * 100) / 100;

	const parseFloatSafe = (val) => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

	const handleChange = (e) => {
		const { name, value } = e.target;

		const {
			rateThisYear,
			rateNextYear,
			salaryThisYear,
			salaryNextYear,
			monthsThisYear,
			monthsNextYear,
			yearlyClaimThisYear,
			yearlyClaimNextYear,
			yearlyExpenseThisYear,
			yearlyExpenseNextYear,
			yearlySalaryNextYear
		} = state;

		let updates = {};

		switch (name) {
			case "rateThisYear": {
				const rateThisYearLocal = parseFloatSafe(value);
				const rateNextYearLocal = parseFloatSafe(rateNextYear);
				const rateIncreasePercentageLocal = ((rateNextYearLocal - rateThisYearLocal) / (rateThisYearLocal || 1)) * 100;
				updates = {
					rateThisYear: value,
					rateIncreasePercentage: formatNumber(rateIncreasePercentageLocal),
				};
				break;
			}

			case "rateNextYear": {
				const rateNextYearLocal = parseFloatSafe(value);
				const rateThisYearLocal = parseFloatSafe(rateThisYear);
				const rateIncreasePercentageLocal = ((rateNextYearLocal - rateThisYearLocal) / (rateThisYearLocal || 1)) * 100;
				updates = {
					rateNextYear: value,
					rateIncreasePercentage: formatNumber(rateIncreasePercentageLocal),
				};
				break;
			}

			case "rateIncreasePercentage": {
				const rateIncreasePercentageLocal = parseFloatSafe(value);
				const rateThisYearLocal = parseFloatSafe(rateThisYear);
				const rateNextYearLocal = rateThisYearLocal * (1 + rateIncreasePercentageLocal / 100);
				updates = {
					rateIncreasePercentage: value,
					rateNextYear: formatNumber(rateNextYearLocal),
				};
				break;
			}

			case "monthsThisYear": {
				const monthsThisLocal = parseFloatSafe(value);
				const salaryThisLocal = parseFloatSafe(salaryThisYear);
				const yearlyClaimThisLocal = parseFloatSafe(yearlyClaimThisYear);
				const yearlyExpenseNextLocal = parseFloatSafe(yearlyExpenseNextYear);

				const yearlySalaryThisLocal = salaryThisLocal * monthsThisLocal;
				const yearlyExpenseThisLocal = yearlyClaimThisLocal + yearlySalaryThisLocal;
				const percentChangeLocal = ((yearlyExpenseNextLocal - yearlyExpenseThisLocal) / (yearlyExpenseThisLocal || 1)) * 100;

				updates = {
					monthsThisYear: value,
					yearlySalaryThisYear: formatNumber(yearlySalaryThisLocal),
					yearlyExpenseThisYear: formatNumber(yearlyExpenseThisLocal),
					percentChange: formatNumber(percentChangeLocal),
				};
				break;
			}

			case "monthsNextYear": {
				const monthsNextYearLocal = parseFloatSafe(value);
				const salaryNextYearLocal = parseFloatSafe(salaryNextYear);
				const yearlyClaimNextYearLocal = parseFloatSafe(yearlyClaimNextYear);
				const yearlyExpenseThisYearLocal = parseFloatSafe(yearlyExpenseThisYear);

				const yearlySalaryNextYearLocal = salaryNextYearLocal * monthsNextYearLocal;
				const yearlyExpenseNextYearLocal = yearlyClaimNextYearLocal + yearlySalaryNextYearLocal;
				const percentChangeLocal = ((yearlyExpenseNextYearLocal - yearlyExpenseThisYearLocal) / (yearlyExpenseThisYearLocal || 1)) * 100;

				updates = {
					monthsNextYear: value,
					yearlySalaryNextYear: formatNumber(yearlySalaryNextYearLocal),
					yearlyExpenseNextYear: formatNumber(yearlyExpenseNextYearLocal),
					percentChange: formatNumber(percentChangeLocal),
				};
				break;
			}

			case "salaryThisYear": {
				const salaryThisLocal = parseFloatSafe(value);
				const salaryNextLocal = parseFloatSafe(salaryNextYear);
				const monthsThisLocal = parseFloatSafe(monthsThisYear);
				const yearlyClaimThisLocal = parseFloatSafe(yearlyClaimThisYear);
				const yearlyExpenseNextLocal = parseFloatSafe(yearlyExpenseNextYear);

				const salaryIncPerc = ((salaryNextLocal - salaryThisLocal) / (salaryThisLocal || 1)) * 100;
				const yearlySalaryThisLocal = salaryThisLocal * monthsThisLocal;
				const yearlyExpenseThisLocal = yearlyClaimThisLocal + yearlySalaryThisLocal;
				const percentChangeLocal = ((yearlyExpenseNextLocal - yearlyExpenseThisLocal) / (yearlyExpenseThisLocal || 1)) * 100;

				updates = {
					salaryThisYear: value,
					salaryIncreasePercentage: formatNumber(salaryIncPerc),
					yearlySalaryThisYear: formatNumber(yearlySalaryThisLocal),
					yearlyExpenseThisYear: formatNumber(yearlyExpenseThisLocal),
					percentChange: formatNumber(percentChangeLocal),
				};
				break;
			}

			case "salaryNextYear": {
				const salaryNextLocal = parseFloatSafe(value);
				const salaryThisLocal = parseFloatSafe(salaryThisYear);
				const monthsNextLocal = parseFloatSafe(monthsNextYear);
				const yearlyClaimNextLocal = parseFloatSafe(yearlyClaimNextYear);
				const yearlyExpenseThisLocal = parseFloatSafe(yearlyExpenseThisYear);

				const salaryIncPerc = ((salaryNextLocal - salaryThisLocal) / (salaryThisLocal || 1)) * 100;
				const yearlySalaryNextLocal = salaryNextLocal * monthsNextLocal;
				const yearlyExpenseNextLocal = yearlyClaimNextLocal + yearlySalaryNextLocal;
				const percentChangeLocal = ((yearlyExpenseNextLocal - yearlyExpenseThisLocal) / (yearlyExpenseThisLocal || 1)) * 100;

				updates = {
					salaryNextYear: value,
					salaryIncreasePercentage: formatNumber(salaryIncPerc),
					yearlySalaryNextYear: formatNumber(yearlySalaryNextLocal),
					yearlyExpenseNextYear: formatNumber(yearlyExpenseNextLocal),
					percentChange: formatNumber(percentChangeLocal),
				};
				break;
			}

			case "salaryIncreasePercentage": {
				const salaryPercLocal = parseFloatSafe(value);
				const salaryThisLocal = parseFloatSafe(salaryThisYear);
				const monthsNextLocal = parseFloatSafe(monthsNextYear);
				const yearlyClaimNextLocal = parseFloatSafe(yearlyClaimNextYear);
				const yearlyExpenseThisLocal = parseFloatSafe(yearlyExpenseThisYear);

				const calculatedSalaryNext = salaryThisLocal * (1 + salaryPercLocal / 100);
				const calcYearlySalary = calculatedSalaryNext * monthsNextLocal;
				const updatedExpense = yearlyClaimNextLocal + calcYearlySalary;
				const percentChangeLocal = ((updatedExpense - yearlyExpenseThisLocal) / (yearlyExpenseThisLocal || 1)) * 100;

				updates = {
					salaryIncreasePercentage: value,
					salaryNextYear: formatNumber(calculatedSalaryNext),
					yearlySalaryNextYear: formatNumber(calcYearlySalary),
					yearlyExpenseNextYear: formatNumber(updatedExpense),
					percentChange: formatNumber(percentChangeLocal),
				};
				break;
			}

			default:
				updates = { [name]: value };
		}

		setState((prev) => ({
			...prev,
			...updates,
		}));
	};

	
	const handleApply = () => {
		onApplyChanges(state);
	};

	return (
		<Dialog 
			open={open} 
			fullScreen={fullScreen} 
			maxWidth="md" 
			onClose={onCancelChanges}
		>
			<DialogTitle><Box color="primary.main"><b>{state.id+" - "+state.displayName || "Employee Details"}</b></Box></DialogTitle>
			<DialogContent>
				<GridMaterial container spacing={2}>
					{ state.statusId===5 &&
					<>
						<GridMaterial item xs={3}>
							<TextField type="number" name="suggestedRateNextYear" label="Suggested Rate Next Year" value={state.suggestedRateNextYear || ''} onChange={handleChange} fullWidth disabled/>
						</GridMaterial>
						<GridMaterial item xs={3}>
							<TextField type="number" name="suggestedRateIncreasePercentage" label="Suggested Rate Increase %" value={state.suggestedRateIncreasePercentage || ''} onChange={handleChange} fullWidth disabled/>
						</GridMaterial>
						<GridMaterial item xs={3}>
							<TextField type="number" name="suggestedSalaryNextYear" label="Suggested Salary Next Year" value={state.suggestedSalaryNextYear || ''} onChange={handleChange} fullWidth disabled/>
						</GridMaterial>
						<GridMaterial item xs={3}>
							<TextField type="number" name="suggestedSalaryIncreasePercentage" label="Suggested Salary Increase %" value={state.suggestedSalaryIncreasePercentage || ''} onChange={handleChange} fullWidth disabled/>
						</GridMaterial>
					</>
					}
					<GridMaterial item xs={3}>
						<TextField name="rateThisYear" label="Rate This Year" value={state.rateThisYear || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="rateNextYear" label="Rate Next Year" value={state.rateNextYear || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="rateIncreasePercentage" label="Rate Increase %" value={state.rateIncreasePercentage || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="monthsThisYear" label="Months This Year" value={state.monthsThisYear || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="salaryThisYear" label="Salary This Year" value={state.salaryThisYear || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="salaryNextYear" label="Salary Next Year" value={state.salaryNextYear || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="salaryIncreasePercentage" label="Salary Increase %" value={state.salaryIncreasePercentage || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={3}>
						<TextField name="monthsNextYear" label="Months Next Year" value={state.monthsNextYear || ''} onChange={handleChange} fullWidth />
					</GridMaterial>
					<GridMaterial item xs={6}>
						<TextField name="yearlyClaimThisYear" label="Yearly Claim This Year" value={state.yearlyClaimThisYear || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					<GridMaterial item xs={6}>
						<TextField name="yearlyClaimNextYear" label="Yearly Claim Next Year" value={state.yearlyClaimNextYear || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					<GridMaterial item xs={6}>
						<TextField name="yearlySalaryThisYear" label="Yearly Salary This Year" value={state.yearlySalaryThisYear || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					<GridMaterial item xs={6}>
						<TextField name="yearlySalaryNextYear" label="Yearly Salary Next Year" value={state.yearlySalaryNextYear || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					<GridMaterial item xs={4}>
						<TextField name="yearlyExpenseThisYear" label="Yearly Expense This Year" value={state.yearlyExpenseThisYear || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					<GridMaterial item xs={4}>
						<TextField name="yearlyExpenseNextYear" label="Yearly Expense Next Year" value={state.yearlyExpenseNextYear || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					<GridMaterial item xs={4}>
						<TextField name="percentChange" label="Percent Change" value={state.percentChange || ''} onChange={handleChange} disabled fullWidth />
					</GridMaterial>
					{/* <GridMaterial item xs={12}>
						<TextField name="comment" label="Comment" value={state.comments && state.comments.length>0  ? state.comments.at(-1) : ''} onChange={handleChange} fullWidth multiline />
					</GridMaterial> */}
				</GridMaterial>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancelChanges} color="secondary">Cancel</Button>
				<Button onClick={handleApply} color="primary">Save</Button>
			</DialogActions>
		</Dialog>
	);
};


const PopupEditing = React.memo(({ popupComponent: Popup, onCommitChanges }) => (
	<Plugin>
		<Template name="popupEditing">
			<TemplateConnector>
				{(
					{ rows, getRowId, addedRows, editingRowIds, createRowChange, rowChanges },
					{ changeRow, changeAddedRow, commitChangedRows, commitAddedRows, stopEditRows, cancelAddedRows, cancelChangedRows }
				) => {
					const isNew = addedRows.length > 0;
					let editedRow;
					let rowId;
					if (isNew) {
						rowId = 0;
						editedRow = addedRows[rowId];
					} else {
						[rowId] = editingRowIds;
						const targetRow = rows.find(row => getRowId(row) === rowId);
						editedRow = { ...targetRow, ...rowChanges[rowId] };
					}

					const applyChanges = (updatedRow) => {
						const rowIds = isNew ? [0] : editingRowIds;
						const change = isNew ? updatedRow : { [rowId]: updatedRow };

						if (isNew) {
							changeAddedRow({ rowId, change });
							commitAddedRows({ rowIds });
							if (typeof onCommitChanges === "function") {
								onCommitChanges({ added: [updatedRow] });
							}
						} else {
							changeRow({ rowId, change });
							commitChangedRows({ rowIds });
							stopEditRows({ rowIds });
							if (typeof onCommitChanges === "function") {
								onCommitChanges({ changed: { [rowId]: updatedRow } });
							}
						}
					};

					const cancelChanges = () => {
						const rowIds = isNew ? [0] : editingRowIds;
						if (isNew) cancelAddedRows({ rowIds });
						else {
							stopEditRows({ rowIds });
							cancelChangedRows({ rowIds });
						}
					};

					const open = editingRowIds.length > 0 || isNew;

					return (
						<Popup
							open={open}
							row={editedRow}
							onApplyChanges={applyChanges}
							onCancelChanges={cancelChanges}
						/>
					);
				}}
			</TemplateConnector>
		</Template>
		<Template name="root">
			<TemplatePlaceholder />
			<TemplatePlaceholder name="popupEditing" />
		</Template>
	</Plugin>
));


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

const CurrencyFormatter = ({ value }) => {
	const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
	return safeValue.toLocaleString("en-US")
};

const CurrencyTypeProvider = (props) => (
	<DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const getRowId = row => row.id;

const F357FormTableComponent = (props) => {

	const [tableColumnExtensions] = useState([
		{ columnName: "id", align: "left", width: 90 },
		{ columnName: "displayName", align: "left", wordWrapEnabled: true },
		{ columnName: "entitiesLabel", align: "left", wordWrapEnabled: true, width:150},
		{ columnName: "designationsLabel", align: "left", wordWrapEnabled: true },
		{ columnName: "rolesLabel", align: "left", wordWrapEnabled: true },
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
		{ columnName: "suggestedRateNextYear", align: "center", wordWrapEnabled: true, width:110 },
		{ columnName: "suggestedSalaryNextYear", align: "center", wordWrapEnabled: true, width:120 },
		{ columnName: "comments", align: "left", wordWrapEnabled: true, width: 300 },
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
		{ columnName: 'rolesLabel', editingEnabled: false },
		{ columnName: 'id', editingEnabled: false },
		{ columnName: 'displayName', editingEnabled: false },
		{ columnName: "entitiesLabel", editingEnabled: false},
		{ columnName: 'jobStatusLabel', editingEnabled: false },
		{ columnName: 'designationsLabel', editingEnabled: false },
		{ columnName: 'joiningDate', editingEnabled: false },
		{ columnName: 'leavingDate', editingEnabled: false },
		{ columnName: 'weeklyLoadThisYear', editingEnabled: false },
		{ columnName: 'weeklyLoadNextYear', editingEnabled: false },
		{ columnName: "weeklyClaimHoursThisYear", editingEnabled: false },
		{ columnName: "weeklyClaimHoursNextYear", editingEnabled: false },
		{ columnName: 'rateThisYear', editingEnabled: false },
		{ columnName: 'rateNextYear', editingEnabled: true },
		{ columnName: 'rateIncreasePercentage', editingEnabled: true },
		{ columnName: 'monthsThisYear', editingEnabled: true },
		{ columnName: 'monthsNextYear', editingEnabled: true },
		{ columnName: 'salaryThisYear', editingEnabled: false },
		{ columnName: 'salaryNextYear', editingEnabled: true },
		{ columnName: 'salaryIncreasePercentage', editingEnabled: true },
		{ columnName: 'yearlyClaimThisYear', editingEnabled: false },
		{ columnName: 'yearlyClaimNextYear', editingEnabled: true },
		{ columnName: 'yearlySalaryThisYear', editingEnabled: false },
		{ columnName: 'yearlySalaryNextYear', editingEnabled: false },
		{ columnName: 'yearlyExpenseThisYear', editingEnabled: false },
		{ columnName: 'yearlyExpenseNextYear', editingEnabled: false },
		{ columnName: 'percentChange', editingEnabled: false },
		{ columnName: 'suggestedRateNextYear', editingEnabled: false },
		{ columnName: 'suggestedSalaryNextYear', editingEnabled: false },
		{ columnName: 'comments', editingEnabled: false }
		// Add more as needed
	]);

	const [leftFixedColumns] = useState([TableEditColumn.COLUMN_TYPE, "id", "displayName"]);

	const { isLoading, showTableFilter, rows, columns, onCommitChanges } = props;

	const [currencyColumns] = useState(["rateThisYear", "salaryThisYear", "rateNextYear", "salaryNextYear", "yearlySalaryThisYear", "yearlySalaryNextYear", "yearlyExpenseThisYear", "yearlyExpenseNextYear"]);

	const NoDataRow = () => (
		<TableRow>
			<TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
				{isLoading ? (
					// <CircularProgress size={36} />
					<>
						<Skeleton />
						<Skeleton animation={false} />
						<Skeleton animation="wave" />
					</>
				) : (
					<Box color="primary.light" fontSize="1rem">No Data</Box>
				)}
			</TableCell>
		</TableRow>
	);

	const [editingRowIds, setEditingRowIds] = useState([]);

	const handleEditingRowIdsChange = (rowIds) => {
		const allowedIds = rowIds.filter(id => {
			const row = rows.find(row => row.id === id);
			return row?.isFinalized !== 1 && row?.isConfirmed!==1;
		});
		setEditingRowIds(allowedIds);
	};

	const EditCommandComponent = ({ id, onExecute }) => {
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
				icon = <SaveIcon />;
				tooltip = 'Save';
				style = { color: theme.palette.success ? theme.palette.success.main : theme.palette.primary.main, minWidth: 40, padding: 4 }; // ✅ success (fallback to primary)
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
				<Button onClick={onExecute} style={style}>
					{icon}
				</Button>
			</Tooltip>
		);
	};

	const EditCell = ({ row, column, children, ...restProps }) => {
		const allowEdit = row?.statusId==null || row?.statusId === 1 || row?.statusId === 5;
		return (
			<TableEditColumn.Cell {...restProps}>
				{allowEdit ? children : null}
			</TableEditColumn.Cell>
		);
	};

	// const HighlightRow = ({ row, ...restProps }) => {
	// 	const hasSuggestedValues = (parseFloat(row.suggestedRateNextYear) || 0) > 0 || (parseFloat(row.suggestedSalaryNextYear) || 0) > 0;
	// 	return (
	// 		<VirtualTable.Row
	// 			{...restProps}
	// 			row={row}
	// 			style={{
	// 				backgroundColor: hasSuggestedValues ? '#ffb74d' : undefined, // light blue background
	// 				...restProps.style,
	// 			}}
	// 		/>
	// 	);
	// };

	const HighlightCell = ({ row, column, ...restProps }) => {
		const highlight = (parseFloat(row.suggestedRateNextYear) || 0) > 0 || (parseFloat(row.suggestedSalaryNextYear) || 0) > 0;
		return (
			<VirtualTable.Cell
				{...restProps}
				row={row}
				column={column}
				style={{
					backgroundColor: highlight ? '#ffdeae' : undefined,
					...restProps.style,
				}}
			/>
		);
	};

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
				/>
				<VirtualTable
					noDataRowComponent={NoDataRow}
					columnExtensions={tableColumnExtensions}
					//rowComponent={HighlightRow} // ✅ Add this line
					cellComponent={HighlightCell} // ✅ ensure fixed cells also get colored
				/>
				<TableHeaderRow cellComponent={StickyHeaderCell} />
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
								<F357ChatBox
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
				<PopupEditing
					popupComponent={Popup}
					onCommitChanges={onCommitChanges}
				/>
				<TableEditColumn
					showEditCommand
					width={120}
					commandComponent={EditCommandComponent}
					cellComponent={EditCell}
				/>
				<TableFixedColumns
					leftColumns={leftFixedColumns}
				/>
			</Grid>
		</Paper>
	);
};

F357FormTableComponent.propTypes = {
	data: PropTypes.object,
	columns: PropTypes.array,
	expandedGroups: PropTypes.array,
	showFilter: PropTypes.bool,
};

F357FormTableComponent.defaultProps = {
	data: {},
	columns: [],
	expandedGroups: [],
	showFilter: false,
};

export default F357FormTableComponent;
