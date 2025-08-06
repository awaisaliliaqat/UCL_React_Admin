import React, { Component } from "react";
import { Paper, Box, CircularProgress, TableRow, TableCell, Button } from "@material-ui/core"; // Import loader component
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow, ColumnChooser, TableColumnVisibility, Toolbar } from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";
import { Skeleton } from "@material-ui/lab";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";

class R86ReportsTableComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filters: [],
			hiddenColumnNames: [],
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
			pageSizes: [10, 25, 50, 100],
			defaultSorting: [],
			sortingStateColumnExtensions: [
				{ columnName: "action", sortingEnabled: false },
			],
			tableColumnExtensions: [
				{ columnName: "id", width: 80 },
				{ columnName: "displayName", wordWrapEnabled: true },
				{ columnName: "cnicNumber", width: 125 },
				{ columnName: "mobileNo", wordWrapEnabled: true, width: 110 },
				{ columnName: "email", wordWrapEnabled: true },
				{ columnName: "jobStatusLabel", wordWrapEnabled: true, width: 80 },
				{ columnName: "createdOn", wordWrapEnabled: true, width: 100 },
				{ columnName: "statusLabel", wordWrapEnabled: true, width: 80 },
				{ columnName: "bankAccountNumber1", wordWrapEnabled: true, width: 80 },
				{ columnName: "bankAccountNumber2", wordWrapEnabled: true, width: 180 },
				{ columnName: "leavingDateLabel", wordWrapEnabled: true, width: 100 },
				{ columnName: "rolesLabel", wordWrapEnabled: true, width: 110 },
				{ columnName: "entitiesLabel", wordWrapEnabled: true },
				{ columnName: "departmentsLabel", wordWrapEnabled: true },
				{ columnName: "subDepartmentsLabel", wordWrapEnabled: true },
				{ columnName: "designationsLabel", wordWrapEnabled: true },
				{ columnName: "address", wordWrapEnabled: true, width: 200 },
				{ columnName: "bloodGroup", wordWrapEnabled: true },
				{ columnName: "emergencyContactName", wordWrapEnabled: true },
				{ columnName: "emergencyContactNumber", wordWrapEnabled: true },
				{ columnName: "action", width: 100, align: "center" },
			],
			resizingMode: "widget",
			defaultFilters: [],
			filteringStateColumnExtensions: [
				{ columnName: "action", filteringEnabled: false },
			],
		};
	}

	exportToExcel = async () => {
		const { rows, columns } = this.props;
		const { filters, hiddenColumnNames } = this.state;

		// 1. Apply filtering manually
		const filteredRows = rows.filter((row) =>
			filters.every(({ columnName, value }) =>
				(row[columnName] || "").toString().toLowerCase().includes(value.toLowerCase())
			)
		);

		// 2. Get visible columns
		const visibleColumns = columns.filter(
			(col) => !hiddenColumnNames.includes(col.name)
		);

		// 3. Create workbook and worksheet
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Filtered Data");

		// 4. Add filters at the top
		if (filters.length > 0) {
			worksheet.addRow(["Filters Applied:"]);
			filters.forEach(({ columnName, value }) => {
				const col = columns.find((c) => c.name === columnName);
				const title = col?.title || columnName;
				worksheet.addRow([title, value]);
			});
			worksheet.addRow([]); // spacer row
		}

		// 5. Add header row
		const headerTitles = visibleColumns.map(col => col.title || col.name);
		const headerRow = worksheet.addRow(headerTitles);

		// Style header
		headerRow.eachCell((cell) => {
			cell.font = { 
				bold: true 
			};
			cell.alignment = { 
				horizontal: "center", 
				vertical: "middle" 
			};
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "dfdfdf" }
			};
			cell.border = {
				top: { style: "thin" },
				left: { style: "thin" },
				right: { style: "thin" },
				bottom: { style: "thin" }
			};
		});

		// 6. Add data rows
		filteredRows.forEach((row) => {
			const rowData = visibleColumns.map(col => row[col.name]);
			const newRow = worksheet.addRow(rowData);

			// Apply border to ALL cells, even empty ones
			newRow.eachCell({ includeEmpty: true }, (cell) => {
				cell.border = {
					top: { style: "thin" },
					left: { style: "thin" },
					right: { style: "thin" },
					bottom: { style: "thin" }
				};
			});
		});

		// 7. Auto-size columns
		worksheet.columns.forEach((column) => {
			let maxLength = 10;
			column.eachCell({ includeEmpty: true }, (cell) => {
				const text = cell.value ? cell.value.toString() : "";
				if (text.length > maxLength) maxLength = text.length;
			});
			column.width = maxLength + 2;
		});

		// 8. Generate file
		const buffer = await workbook.xlsx.writeBuffer();
		const dateStr = format(new Date(), "dd-MM-yyyy_hh-mm-ss_a");
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
		});
		saveAs(blob, `Employee_Profile_${dateStr}.xlsx`);
	};

	render() {
		
		const cellComponent = ({ cellProps, ...restProps }) => {
			return (
				<Table.Cell
					{...restProps}
					style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
				/>
			);
		};

		const {
			tableColumnExtensions,
			defaultSorting,
			sortingStateColumnExtensions,
			filteringStateColumnExtensions,
			defaultFilters,
			pageSizes,
		} = this.state;

		const { rows, columns, showFilter, isLoading } = this.props; // Get isLoading prop

		const NoDataRow = () => (
			<TableRow>
				<TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
					{isLoading ? (
						Array(10).fill(0).map((_,i)=>
							<React.Fragment key={"_"+i}>
								<Skeleton />
								<Skeleton animation={false} />
								<Skeleton animation="wave" />
								<br/>
							</React.Fragment>
						)
					) : (
						<Box color="primary.light" fontSize="1rem">No Data</Box>
					)}
				</TableCell>
			</TableRow>
		);

		return (

			<Paper>
				<Grid
					rows={isLoading ? [] : rows}
					columns={columns}
				>
					<FilteringState
						// defaultFilters={defaultFilters}
						filters={this.state.filters}
						onFiltersChange={(filters) => this.setState({ filters })}
						columnExtensions={filteringStateColumnExtensions}
					/>
					<SortingState
						defaultSorting={defaultSorting}
						columnExtensions={sortingStateColumnExtensions}
					/>
					<PagingState defaultCurrentPage={0} defaultPageSize={pageSizes[0]} />
					<IntegratedFiltering />
					<IntegratedSorting />
					<IntegratedPaging />
					<Table
						noDataRowComponent={NoDataRow}
						cellComponent={cellComponent}
						columnExtensions={tableColumnExtensions}
					/>
					<TableHeaderRow
						showSortingControls={true}
						titleComponent={(props) =>
							props.children !== "Action" ? (
								<b>{props.children}</b>
							) : (
								<b>&emsp;{props.children}</b>
							)
						}
					/>
					<TableColumnVisibility
						// defaultHiddenColumnNames={[]}
						hiddenColumnNames={this.state.hiddenColumnNames}
						onHiddenColumnNamesChange={(hiddenColumnNames) =>
							this.setState({ hiddenColumnNames })
						}
					/>
					<Toolbar />
					<ColumnChooser />
					{showFilter && <TableFilterRow showFilterSelector={true} />}
					<PagingPanel pageSizes={pageSizes} />
				</Grid>
			</Paper>
		);
	}
}

R86ReportsTableComponent.propTypes = {
	columns: PropTypes.array,
	rows: PropTypes.array,
	showFilter: PropTypes.bool,
	isLoading: PropTypes.bool, // Add PropTypes for isLoading
};

R86ReportsTableComponent.defaultProps = {
	columns: [],
	rows: [],
	showFilter: false,
	isLoading: false, // Set default prop for isLoading
};

export default React.forwardRef((props, ref) => {
	class ExportWrapper extends Component {
		render() {
			return <R86ReportsTableComponentInner {...this.props} />;
		}
	}

	class R86ReportsTableComponentInner extends R86ReportsTableComponent {
		componentDidMount() {
			if (ref) {
				ref.current = {
					exportToExcel: this.exportToExcel
				};
			}
			// Properly call parent class's componentDidMount if it exists
			if (super.componentDidMount) {
				super.componentDidMount();
			}
		}
	}

	return <ExportWrapper {...props} />;
});


