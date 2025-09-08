// F85ReportsFilePreviewComponent.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import FileViewer from "react-file-viewer";
import * as XLSX from "xlsx";

const useStyles = makeStyles(() => ({
	paper: { width: "90vw", maxWidth: 1600 },
	content: { padding: 0 },
	viewer: { width: "100%", height: "100%", border: 0 }
}));

/** Normalize extension from name or mime (handles .text/.log/.jpeg etc.) */
function extFromNameOrMime(name = "", mime = "") {
	const byName = (name.split(".").pop() || "").toLowerCase();
	// normalize common aliases
	const alias = { text: "txt", log: "txt", jpeg: "jpg" };
	if (byName) return alias[byName] || byName;

	const m = (mime || "").toLowerCase();
	if (!m) return "";
	if (m.includes("pdf")) return "pdf";
	if (m.startsWith("image/")) return m.split("/")[1]; // png, jpeg, webp...
	if (m.includes("msword")) return "doc";
	if (m.includes("wordprocessingml")) return "docx";

	// Excel family
	if (m.includes("spreadsheetml.sheet")) return "xlsx";          // xlsx
	if (m.includes("sheet.macroenabled")) return "xlsm";           // xlsm
	if (m.includes("sheet.binary")) return "xlsb";                 // xlsb
	if (m.includes("template.macroenabled")) return "xltm";        // xltm
	if (m.includes("spreadsheetml.template")) return "xltx";       // xltx
	if (m.includes("vnd.ms-excel")) return "xls";                  // xls/xlt

	if (m.includes("presentationml")) return "pptx";
	if (m.includes("vnd.ms-powerpoint")) return "ppt";
	if (m.includes("csv")) return "csv";
	if (m.includes("text")) return "txt";   // text/plain → txt
	return "";
}

/** Types we’ll pass to react-file-viewer (we handle pdf/images/txt ourselves) */
const RFV_SUPPORTED = new Set([ "doc", "docx", "csv" ]);

/** Route all of these through SheetJS (safer than react-file-viewer for Excel) */
const EXCEL_EXTS = new Set(["xls", "xlsx", "xlsm", "xlsb", "xltx", "xltm"]);

/** Minimal Excel preview using SheetJS -> HTML (first sheet) */
function XlsxHtmlPreview({ url, height }) {

	const containerRef = React.useRef(null);
	const [error, setError] = React.useState("");
	
	React.useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(url);
				const ab = await res.arrayBuffer();
				const wb = XLSX.read(ab);
				const ws = wb.Sheets[wb.SheetNames[0]];
				const html = XLSX.utils.sheet_to_html(ws, { id: "xlsx-preview-table" });
				if (!cancelled && containerRef.current) {
					containerRef.current.innerHTML = html;

					// quick style tweaks
					const tbl = containerRef.current.querySelector("#xlsx-preview-table");
					if (tbl) {
						tbl.style.width = "100%";
						tbl.style.borderCollapse = "collapse";
					}
					const ths = containerRef.current.querySelectorAll("#xlsx-preview-table th, #xlsx-preview-table td");
					ths.forEach(el => {
						el.style.border = "1px solid #e0e0e0";
						el.style.padding = "6px 8px";
					});
				}
			} catch (e) {
				console.error(e);
				if (!cancelled) setError("Unable to render Excel preview. Please download the file.");
			}
		})();
		return () => { cancelled = true; };
	}, [url]);

	if (error) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height={height} p={2} textAlign="center">
				<Typography variant="body2">{error}</Typography>
			</Box>
		);
	}

	return (
		<Box ref={containerRef} style={{ height, overflow: "auto", padding: 8, background: "#fff" }} />
	);
}

/** Simple, robust text previewer */
function TextPreview({ url, height }) {
	const [txt, setTxt] = React.useState("Loading...");
	React.useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(url);
				const t = await res.text();
				if (!cancelled) setTxt(t);
			} catch (e) {
				console.error(e);
				if (!cancelled) setTxt("Unable to render text. Please use Download.");
			}
		})();
		return () => { cancelled = true; };
	}, [url]);

	return (
		<Box style={{ height, overflow: "auto", padding: 12, background: "#fff" }}>
			<pre style={{ margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{txt}</pre>
		</Box>
	);
}

/** Error boundary so a failed viewer doesn't crash the dialog */
class ViewerBoundary extends React.Component {
	constructor(props) { super(props); this.state = { hasError: false }; }
	static getDerivedStateFromError() { return { hasError: true }; }
	componentDidCatch(err) { console.error("Viewer error:", err); }
	render() {
		if (this.state.hasError) {
			return (
				<Box display="flex" alignItems="center" justifyContent="center" height={this.props.height} p={2}>
					<Typography variant="body2">
						Preview failed to load. Please use <b>Download</b> to view this file.
					</Typography>
				</Box>
			);
		}
		return this.props.children;
	}
}

export default function F85ReportsFilePreviewComponent({
		open, url, type, name, onClose, onDownload
	}) {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const ext = React.useMemo(() => extFromNameOrMime(name, type), [name, type]);
	const isPdf = (type || "").startsWith("application/pdf") || ext === "pdf";
	const isImage = (type || "").startsWith("image/") || ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext);

	const height = fullScreen ? "calc(100vh - 64px)" : "80vh";
	const viewerKey = `${ext}:${url || ""}`;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullScreen={fullScreen}
			PaperProps={{ className: classes.paper }}
			aria-labelledby="file-preview-title"
		>
			<DialogTitle disableTypography style={{ display: "flex", alignItems: "center" }}>
				<Typography
					id="file-preview-title"
					variant="subtitle1"
					style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
				>
					{name}
				</Typography>
				<IconButton size="small" onClick={onDownload} aria-label="download" color="primary">
					<CloudDownloadIcon />
				</IconButton>
				<IconButton size="small" onClick={onClose} aria-label="close" color="secondary">
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent className={classes.content}>
				<Box style={{ width: "90vw", maxWidth: 1600, height }}>
					<ViewerBoundary height={height}>
						{EXCEL_EXTS.has(ext) ? (
							<XlsxHtmlPreview key={viewerKey} url={url} height={height} />
						) : ext === "txt" ? (
							<TextPreview key={viewerKey} url={url} height={height} />
						) : RFV_SUPPORTED.has(ext) ? (
							<FileViewer
								key={viewerKey}
								fileType={ext}   // doc/docx/csv
								filePath={url}   // Blob URL from parent
								onError={(e) => { throw e; }} // let boundary handle
							/>
						) : isPdf ? (
							<object data={url} type="application/pdf" className={classes.viewer}>
								<iframe title="pdf-preview" src={url} className={classes.viewer} />
							</object>
						) : isImage ? (
							<Box display="flex" alignItems="center" justifyContent="center" style={{ width: "100%", height: "100%" }}>
								<img src={url} alt={name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
							</Box>
						) : ["ppt", "pptx"].includes(ext) ? (
							<Box display="flex" alignItems="center" justifyContent="center" height={height} p={2} textAlign="center">
								<Typography variant="body2">
									Preview for {ext.toUpperCase()} isn’t supported in-app. Please use <b>Download</b>.
								</Typography>
							</Box>
						) : (
							<iframe title="file-preview" src={url} className={classes.viewer} />
						)}
					</ViewerBoundary>
				</Box>
			</DialogContent>
		</Dialog>
	);
}