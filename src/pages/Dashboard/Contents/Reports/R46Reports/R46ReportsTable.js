import React, { useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
		color: theme.palette.common.white,
		fontWeight: 500,
		border: "1px solid white",
	},
	body: {
		fontSize: 14,
		border: "1px solid rgb(29, 95, 152)",
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

const R46ReportsTable = ({ isLoading, data }) => {

	const tableRef = useRef();

	const columns = ['time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	// Optional: filter out rows with no data
	const filteredData = data.filter(row =>
		columns.some(col => col !== 'time' && row[col]?.trim() !== '')
	);

	useEffect(() => {

		if (!tableRef.current) return;

		columns.forEach((day, colIndex) => {
			if (day === 'time') return; // Skip 'time' column if needed
			let lastValue = null;
			let spanCell = null;
			let spanCount = 1;
			for (let rowIndex = 1; rowIndex < tableRef.current.rows.length; rowIndex++) {
				const row = tableRef.current.rows[rowIndex];
				const cell = row.cells[colIndex];
				if (!cell) continue;
				const currentValue = cell.innerText.trim();
				if (currentValue === '' || currentValue !== lastValue) {
					// New non-empty value or empty – reset
					spanCount = 1;
					spanCell = cell;
					lastValue = currentValue !== '' ? currentValue : null;
				} else {
					// Match and non-empty – merge
					spanCount++;
					cell.style.display = 'none';
					if (spanCell) {
						spanCell.rowSpan = spanCount;
					}
				}
			}
		});

	}, [isLoading, data]);


	return (
		<TableContainer component={Paper}>
			<Table size="small" stickyHeader ref={tableRef}>
				<TableHead>
					<StyledTableRow>
						{columns.map(col => (
							<StyledTableCell key={col} align="center" style={{ fontWeight: 'bold' }}>
								{col==='time' ? "" : col }
							</StyledTableCell>
						))}
					</StyledTableRow>
				</TableHead>
				<TableBody>
					{filteredData.length === 0 ? (
						<StyledTableRow>
							<StyledTableCell colSpan={columns.length} align="center">
								{isLoading ? <CircularProgress /> : <b>No Data</b> }
							</StyledTableCell>
						</StyledTableRow>
					) : (
						filteredData.map((row, i) => (
							<StyledTableRow key={i}>
								{columns.map(col => (
									<StyledTableCell key={`${i}-${col}`} align="center">
										{ col==="time" ? row[col].split('-').map((part, idx) => (<div key={idx} style={{minWidth:65}}>{part.trim()}</div>)) : row[col] }
									</StyledTableCell>
								))}
							</StyledTableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default R46ReportsTable;
