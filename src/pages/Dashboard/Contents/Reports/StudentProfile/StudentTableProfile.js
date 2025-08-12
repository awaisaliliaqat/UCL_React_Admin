import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle, Fragment } from "react";
import PropTypes from "prop-types";
import { Paper, Box, IconButton, Tooltip, TableRow, TableCell, Divider, Menu, MenuItem, Checkbox, ListItemText } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FolderIcon from "@material-ui/icons/Folder";
import { Skeleton } from "@material-ui/lab";
import { Grid, VirtualTable, TableHeaderRow, TableFixedColumns, TableFilterRow } from "@devexpress/dx-react-grid-material-ui";
import { FilteringState, IntegratedFiltering, DataTypeProvider } from "@devexpress/dx-react-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format as formatDate } from "date-fns";

/* ---------- helpers ---------- */
const getRowId = (row) => row.studentId;
const DATE_COLS = new Set(["dateOfBirth"]);
const fmtDOB = (v) => {
	if (v == null || v === "") return "";
	const n = Number(v);
	const d = Number.isFinite(n) ? new Date(n) : new Date(v);
	return isNaN(d.getTime()) ? String(v) : formatDate(d, "dd/MM/yyyy");
};

/* ---------- action column ---------- */
const ActionCell = ({ value, onOpenFileRepository }) => (
	<Box display="flex" alignItems="center" justifyContent="center" gridGap={6}>
		<Tooltip title="View Profile">
			<IconButton
				size="small"
				color="primary"
				onClick={(e) => {
					e.stopPropagation();
					if (value?.viewProfileUrl) window.open(value.viewProfileUrl, "_blank");
				}}
				style={{ padding: 6 }}
			>
				<VisibilityIcon fontSize="small" />
			</IconButton>
		</Tooltip>
		<Tooltip title="File Repository">
			<IconButton
				size="small"
				color="primary"
				onClick={(e) => {
					e.stopPropagation();
					if (onOpenFileRepository && value?.fullStudentData) {
						onOpenFileRepository(value.fullStudentData);
					}
				}}
				style={{ padding: 6 }}
			>
				<FolderIcon fontSize="small" />
			</IconButton>
		</Tooltip>
	</Box>
);

const ActionFormatter = ({ value, onOpenFileRepository }) => (
	<ActionCell value={value} onOpenFileRepository={onOpenFileRepository} />
);

const ActionTypeProvider = ({ for: forCols, onOpenFileRepository }) => (
	<DataTypeProvider
		for={forCols}
		formatterComponent={(props) => (
			<ActionFormatter {...props} onOpenFileRepository={onOpenFileRepository} />
		)}
	/>
);

/* ---------- main ---------- */
const StudentTableProfile = forwardRef(function StudentTableProfile(
	{
		rows = [],
		columns = [],
		isLoading = false,
		showFilter = false,
		onOpenFileRepository,
	},
	ref
) {
	// header bold + taller + wrapping (lets long labels stack on multiple lines)
	const HeaderCell = (props) => (
		<TableHeaderRow.Cell
			{...props}
			style={{
				...props.style,
				fontWeight: 600,
				lineHeight: 1.2,
				whiteSpace: "normal",
				wordBreak: "break-word",
				minHeight: 64,
				paddingTop: 8,
				paddingBottom: 8,
			}}
		/>
	);

	// widths / fixed columns (tweak as needed)
	const [tableColumnExtensions] = useState([
		{ columnName: "action", width: 100 },
		{ columnName: "studentId", width: 130 },
		{ columnName: "name", wordWrapEnabled: true, width: 220 },
		{ columnName: "displayName", wordWrapEnabled: true, width: 240 },
	]);
	const [leftFixedColumns] = useState(["action","studentId", "name"]);

	// column chooser (controlled internally; opened via ref)
	const [hiddenColumnNames, setHiddenColumnNames] = useState([]);
	const chooserAnchorRef = useRef(null);
	const [chooserOpen, setChooserOpen] = useState(false);

	const visibleColumns = useMemo(() => {
		const actionCol = columns.find(c => c.name === "action");
		const rest = columns.filter(c => c.name !== "action" && !hiddenColumnNames.includes(c.name));
		return actionCol ? [actionCol, ...rest] : rest;
	}, [columns, hiddenColumnNames]);

	const [filters, setFilters] = useState([]);

useEffect(() => {
	if (!showFilter && filters.length) setFilters([]);
}, [showFilter, filters.length]);

	// Filtering ops: enable 6 options on text-ish columns, none for "action"
	const textOps = ["equal", "notEqual", "contains", "notContains", "startsWith", "endsWith"];
	const filteringColumnExtensions = useMemo(
		() =>
			(columns || []).map((c) =>
				c.name === "action"
					? { columnName: c.name, filteringEnabled: false }
					: { columnName: c.name, availableFilterOperations: textOps }
			),
		[columns]
	);

	// filtered rows (to reuse for export) — mirrors grid logic
	const filteredRows = useMemo(() => {
		if (!filters.length) return rows;
		return rows.filter((r) =>
			filters.every(({ columnName, value, operation }) => {
				if (!value) return true;
				const col = columns.find((c) => c.name === columnName);
				const raw = col?.getCellValue ? col.getCellValue(r) : r[columnName];
				const text = DATE_COLS.has(columnName) ? fmtDOB(raw) : (raw ?? "").toString();
				const left = text.toLowerCase();
				const right = String(value).toLowerCase();

				switch (operation) {
					case "equal": return left === right;
					case "notEqual": return left !== right;
					case "contains": return left.includes(right);
					case "notContains": return !left.includes(right);
					case "startsWith": return left.startsWith(right);
					case "endsWith": return left.endsWith(right);
					default: // fallback to contains
						return left.includes(right);
				}
			})
		);
	}, [rows, filters, columns]);

	// expose API to parent
	useImperativeHandle(ref, () => ({
		exportToExcel: async () => {
			const cols = visibleColumns.filter((c) => c.name !== "action");
			const workbook = new ExcelJS.Workbook();
			const ws = workbook.addWorksheet("Student Profile");

			const headers = cols.map((c) => c.title || c.name);
			const headerRow = ws.addRow(headers);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.alignment = { horizontal: "center", vertical: "middle" };
				cell.border = {
					top: { style: "thin" }, left: { style: "thin" },
					right: { style: "thin" }, bottom: { style: "thin" },
				};
			});

			filteredRows.forEach((r) => {
				const vals = cols.map((c) => {
					const raw = typeof c.getCellValue === "function" ? c.getCellValue(r) : r[c.name];
					return DATE_COLS.has(c.name) ? fmtDOB(raw) : raw;
				});
				ws.addRow(vals);
			});

			const lastRowNumber = ws.lastRow ? ws.lastRow.number : 1;
			for (let r = 1; r <= lastRowNumber; r++) {
			   ws.getRow(r).eachCell({ includeEmpty: true }, (cell) => {
			     cell.border = { top:{style:"thin"}, left:{style:"thin"}, right:{style:"thin"}, bottom:{style:"thin"} };
			   });
			}

			ws.columns.forEach((col) => {
				let max = 10;
				col.eachCell({ includeEmpty: true }, (cell) => {
					const text = cell.value == null ? "" : String(cell.value);
					if (text.length > max) max = text.length;
				});
				col.width = Math.min(max + 2, 60);
			});

			const buf = await workbook.xlsx.writeBuffer();
			saveAs(
				new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
				`Student_Profile_${formatDate(new Date(), "yyyy-MM-dd_HH-mm-ss")}.xlsx`
			);
		},

		openColumnChooser: (anchor) => {
			chooserAnchorRef.current = anchor || null;
			setChooserOpen(true);
		},
	}));

	// skeleton / no data
	const NoDataRow = () => (
		<TableRow>
			<TableCell colSpan={visibleColumns.length} style={{ textAlign: "center", padding: 20 }}>
				{isLoading ? (
					Array(6).fill(0).map((_, i) => (
						<Fragment key={i}>
							<Skeleton /><Skeleton animation={false} /><Skeleton animation="wave" /><br />
						</Fragment>
					))
				) : (
					<Box color="primary.light">No Data</Box>
				)}
			</TableCell>
		</TableRow>
	);

	// cell renderer: format DOB nicely; render action cell
	const Cell = (props) => {
		const { column, value } = props;
		if (column.name === "action") {
			return (
				<VirtualTable.Cell {...props} style={{ ...props.style, textAlign: "center" }}>
					<ActionCell value={value} onOpenFileRepository={onOpenFileRepository} />
				</VirtualTable.Cell>
			);
		}
		if (DATE_COLS.has(column.name)) {
			return (
				<VirtualTable.Cell {...props} style={{ ...props.style }}>
					{fmtDOB(value)}
				</VirtualTable.Cell>
			);
		}
		return <VirtualTable.Cell {...props} style={{ ...props.style }} />;
	};

	return (
		<Paper>
			<Divider />
			<Menu
				anchorEl={chooserAnchorRef.current}
				keepMounted
				open={chooserOpen}
				onClose={() => setChooserOpen(false)}
			>
				<MenuItem disabled><b>Columns</b></MenuItem>
				<Divider />
				{columns
					.filter((c) => c.name !== "action")
					.map((col) => {
						const checked = !hiddenColumnNames.includes(col.name);
						return (
							<MenuItem
								key={col.name}
								dense
								onClick={() =>
									setHiddenColumnNames((prev) =>
										checked ? [...prev, col.name] : prev.filter((n) => n !== col.name)
									)
								}
							>
								<Checkbox checked={checked} color="primary" tabIndex={-1} disableRipple />
								<ListItemText primary={col.title || col.name} />
							</MenuItem>
						);
					})}
				<Divider />
				<MenuItem onClick={() => setHiddenColumnNames([])}>
					<Box color="primary.main" fontWeight={600}>Show All</Box>
				</MenuItem>
			</Menu>
			<Grid
				rows={isLoading ? [] : rows}
				columns={visibleColumns}
				getRowId={getRowId}
			>
				<FilteringState
					filters={filters}
					onFiltersChange={setFilters}
					columnExtensions={filteringColumnExtensions}
				/>
				<IntegratedFiltering />
				<ActionTypeProvider for={["action"]} onOpenFileRepository={onOpenFileRepository} />
				<VirtualTable
					noDataRowComponent={NoDataRow}
					columnExtensions={tableColumnExtensions}
					cellComponent={Cell}
				/>
				<TableHeaderRow cellComponent={HeaderCell} />
				{showFilter && <TableFilterRow showFilterSelector /> }
				<TableFixedColumns leftColumns={leftFixedColumns} />
			</Grid>
		</Paper>
	);
});

StudentTableProfile.propTypes = {
	rows: PropTypes.array,
	columns: PropTypes.array,
	isLoading: PropTypes.bool,
	showFilter: PropTypes.bool,
	onOpenFileRepository: PropTypes.func,
};

export default StudentTableProfile;
