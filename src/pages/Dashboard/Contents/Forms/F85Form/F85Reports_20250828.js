import React, { Component, Fragment } from "react";
import { Box, Divider, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F85ReportsTableComponent from "./Chunks/F85ReportsTableComponent";
import { format } from "date-fns";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CircularProgress } from "@material-ui/core";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import F85ReportsFilePreviewComponent from "./Chunks/F85ReportsFilePreviewComponent";

const styles = () => ({
	root: {
		paddingBottom: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%"
	}
});

class F85Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			admissionData: [],
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			expandedGroupsData: [],
			downloadingFileId: null,
			abortController: null, // used for DOWNLOADS only (kept for row spinner)
			viewerOpen: false,
			viewerUrl: null,
			viewerType: "",
			viewerFileName: ""
		};

		// ---- preview fetch control & cache (not in state) ----
		this._activeController = null;	// AbortController for PREVIEW fetch
		this._previewCache = new Map();	// key -> { objectUrl, type, name, ts }
		this._cacheLimit = 6;	// keep up to 6 previews
	}

	// --- helpers for preview cache ---
	makeCacheKey = (userId, fileName) => `${userId}::${fileName}`;

	evictOldest = () => {
		if (this._previewCache.size <= this._cacheLimit) return;
		let oldestKey = null;
		let oldestTs = Infinity;
		this._previewCache.forEach((v, k) => {
			if (v.ts < oldestTs) { oldestTs = v.ts; oldestKey = k; }
		});
		if (oldestKey) {
			const victim = this._previewCache.get(oldestKey);
			if (victim && victim.objectUrl) {
				try { URL.revokeObjectURL(victim.objectUrl); } catch (e) { }
			}
			this._previewCache.delete(oldestKey);
		}
	};

	componentWillUnmount() {
		// Abort any in-flight preview fetch
		if (this._activeController && typeof this._activeController.abort === "function") {
			try { this._activeController.abort(); } catch (e) { }
		}
		// Revoke all cached Blob URLs
		this._previewCache.forEach(v => {
			if (v && v.objectUrl) {
				try { URL.revokeObjectURL(v.objectUrl); } catch (e) { }
			}
		});
		this._previewCache.clear();
	}

	handleOpenSnackbar = (msg, severity) => {
		this.setState({
			isOpenSnackbar: true,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") return;
		this.setState({ isOpenSnackbar: false });
	};

	getData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C85CommonUsersDocuments/View`;
		await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
		})
			.then((res) => {
				if (!res.ok) throw res;
				return res.json();
			})
			.then(
				(json) => {
					if (json.CODE === 1) {
						let expandedGroupsData = [];
						for (let i = 0; i < json.DATA.length; i++) {
							expandedGroupsData.push(json.DATA[i].userLabel);
						}
						this.setState({
							admissionData: json.DATA || [],
							expandedGroupsData
						});
					} else {
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({ isLoginMenu: true, isReload: true });
					} else {
						this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
						// eslint-disable-next-line no-console
						console.log(error);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	handleDelete = async (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C85CommonUsersDocuments/Delete`;
		await fetch(url, {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
		})
			.then((res) => {
				if (!res.ok) throw res;
				return res.json();
			})
			.then(
				(json) => {
					if (json.CODE === 1) {
						this.handleOpenSnackbar("Deleted", "success");
						this.getData();
					} else {
						this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({ isLoginMenu: true, isReload: false });
					} else {
						this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
						// eslint-disable-next-line no-console
						console.log(error);
					}
				}
			);
	};

	// --- DOWNLOAD logic (keeps row spinner & cancel) ---
	downloadFile = (userId, fileName, rowId) => {
		if (this.state.abortController) {
			try { this.state.abortController.abort(); } catch (e) { }
		}
		setTimeout(() => {
			const controller = new AbortController();
			const signal = controller.signal;
			this.setState({ downloadingFileId: rowId, abortController: controller });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUsersDocumentsFileView?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(fileName)}`;
			fetch(url, {
				method: "GET",
				headers: { Authorization: "Bearer " + localStorage.getItem("uclAdminToken") },
				signal
			})
				.then((res) => {
					if (res.ok) {
						const ct = res.headers.get("Content-Type") || this.getMimeFromFilename(fileName);
						return res.arrayBuffer().then(buf => ({ buf, ct }));
					}
					if (res.status === 401) {
						this.setState({ isLoginMenu: true, isReload: false });
						throw new Error("Unauthorized");
					}
					if (res.status === 404) {
						this.handleOpenSnackbar("File not found.", "error");
						throw new Error("File not found");
					}
					this.handleOpenSnackbar("Operation failed. Please try again later.", "error");
					throw new Error("Download failed with status " + res.status);
				})
				.then(({ buf, ct }) => {
					if (!buf) return;
					const probe = this.sniffBackendFileError(buf, ct, fileName);
					if (probe.error) {
						this.handleOpenSnackbar("File not found.", "error");
						return;
					}
					const blob = new Blob([buf], { type: ct });
					const downloadUrl = window.URL.createObjectURL(blob);
					const tempLink = document.createElement("a");
					tempLink.href = downloadUrl;
					tempLink.setAttribute("download", fileName);
					document.body.appendChild(tempLink);
					tempLink.click();
					document.body.removeChild(tempLink);
					window.URL.revokeObjectURL(downloadUrl);
				})
				.catch((error) => {
					if (error && error.name === "AbortError") {
						this.handleOpenSnackbar("Download cancelled.", "warning");
					} else {
						// eslint-disable-next-line no-console
						console.error("Download error:", error);
					}
				})
				.finally(() => {
					this.setState({ downloadingFileId: null, abortController: null });
				});
		}, 100);
	};

	getMimeFromFilename = (name = "") => {
		const ext = (name.split(".").pop() || "").toLowerCase();
		switch (ext) {
			case "pdf": return "application/pdf";
			case "png": return "image/png";
			case "jpg":
			case "jpeg": return "image/jpeg";
			case "gif": return "image/gif";
			case "webp": return "image/webp";
			case "svg": return "image/svg+xml";
			case "txt":
			case "text":
			case "log": return "text/plain";
			case "csv": return "text/csv";
			case "doc": return "application/msword";
			case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
			case "dot": return "application/msword";
			case "dotx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
			case "xls":
			case "xlt": return "application/vnd.ms-excel";
			case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			case "xlsm": return "application/vnd.ms-excel.sheet.macroEnabled.12";
			case "xlsb": return "application/vnd.ms-excel.sheet.binary.macroEnabled.12";
			case "xltx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
			case "xltm": return "application/vnd.ms-excel.template.macroEnabled.12";
			default: return "application/octet-stream";
		}
	};

	// --- Sniffer: detect "200 OK" text error pretending to be a file ---
	sniffBackendFileError = (arrayBuffer, contentType, fileName) => {
		const ext = (fileName.split(".").pop() || "").toLowerCase();

		const binaryExts = new Set([
			"pdf", "png", "jpg", "jpeg", "gif", "webp", "svg",
			"doc", "docx", "xls", "xlsx", "xlsm", "xlsb", "xltx", "xltm",
			"ppt", "pptx"
		]);

		const u8 = new Uint8Array(arrayBuffer.slice(0, 12));
		const looksZip = u8[0] === 0x50 && u8[1] === 0x4B; // 'PK' zip (docx/xlsx/pptx)
		const looksPdf = u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46; // %PDF
		const looksPng = u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4E && u8[3] === 0x47; // PNG
		const looksJpeg = u8[0] === 0xFF && u8[1] === 0xD8 && u8[2] === 0xFF; // JPEG
		const looksOle = u8[0] === 0xD0 && u8[1] === 0xCF && u8[2] === 0x11 && u8[3] === 0xE0; // legacy Office
		const likelyBinary = looksZip || looksPdf || looksPng || looksJpeg || looksOle;

		const isTextCT = (contentType || "").toLowerCase().startsWith("text/");
		const expectsBinary = binaryExts.has(ext);

		if (expectsBinary && (isTextCT || !likelyBinary)) {
			let sample = "";
			try {
				sample = new TextDecoder("utf-8").decode(arrayBuffer.slice(0, 2048)).toLowerCase();
			} catch (_) { }
			const patterns = ["not found", "no file", "does not exist", "missing", "error"];
			if (patterns.some(p => sample.includes(p))) {
				return { error: true, message: "File not found." };
			}
		}
		return { error: false };
	};

	// --- PREVIEW flow with cache + immediate open + sniffer ---
	previewInApp = (userId, fileName, rowId) => {
		// Abort any previous preview fetch
		if (this._activeController && typeof this._activeController.abort === "function") {
			try { this._activeController.abort(); } catch (e) { }
		}

		// Open dialog immediately; child can show spinner until url arrives
		this.setState({
			viewerOpen: true,
			viewerUrl: null,
			viewerType: "",
			viewerFileName: fileName
		});

		const key = this.makeCacheKey(userId, fileName);
		const cached = this._previewCache.get(key);
		if (cached) {
			// Serve from cache instantly
			this.setState({
				viewerUrl: cached.objectUrl,
				viewerType: cached.type,
				viewerFileName: fileName
			});
			return;
		}

		const controller = new AbortController();
		const signal = controller.signal;
		this._activeController = controller;

		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUsersDocumentsFileView?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(fileName)}`;
		fetch(url, {
			method: "GET",
			headers: { Authorization: "Bearer " + localStorage.getItem("uclAdminToken") },
			signal
		})
			.then(res => {
				if (!res.ok) {
					if (res.status === 401) this.setState({ isLoginMenu: true, isReload: false });
					if (res.status === 404) this.handleOpenSnackbar("File not found.", "error");
					throw new Error("HTTP " + res.status);
				}
				const ct = res.headers.get("Content-Type") || this.getMimeFromFilename(fileName);
				return res.arrayBuffer().then(buf => ({ buf, ct }));
			})
			.then(({ buf, ct }) => {
				// detect backend “200 with text error”
				const probe = this.sniffBackendFileError(buf, ct, fileName);
				if (probe.error) {
					this.handleOpenSnackbar(probe.message, "error");
					// close the viewer we opened early
					this.setState({ viewerOpen: false, viewerUrl: null, viewerType: "", viewerFileName: "" });
					return;
				}

				const blob = new Blob([buf], { type: ct });
				const blobUrl = URL.createObjectURL(blob);
				const resolvedType = blob.type || this.getMimeFromFilename(fileName);

				// Add to cache and evict if needed
				this._previewCache.set(key, {
					objectUrl: blobUrl,
					type: resolvedType,
					name: fileName,
					ts: Date.now()
				});
				this.evictOldest();

				this.setState({
					viewerUrl: blobUrl,
					viewerType: resolvedType,
					viewerFileName: fileName
				});
			})
			.catch(err => {
				if (err && err.name === "AbortError") {
					this.handleOpenSnackbar("Operation cancelled.", "warning");
				} else {
					this.handleOpenSnackbar("Failed to open file.", "error");
					// eslint-disable-next-line no-console
					console.error(err);
				}
			})
			.finally(() => {
				this._activeController = null;
			});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};

	componentDidMount() {
		const { isDrawerOpen = false, setDrawerOpen = () => { } } = this.props;
		if (isDrawerOpen) setDrawerOpen(false);
		this.getData();
	}

	render() {
		const { classes } = this.props;

		const columns = [
			{ name: "id", title: "ID" },
			{ name: "userId", title: "User ID" },
			{ name: "userLabel", title: "User Name" },
			{ name: "label", title: "Label" },
			{ name: "description", title: "Description" },
			{name: "uploadedOn", title: "Uploaded On",
				getCellValue: (row) => row.uploadedOn ? format(row.uploadedOn, "dd-MM-yyyy hh:mm a") : ""
			},
			{name: "action", title: "Action",
				getCellValue: (row) => (
					<Fragment>
						{this.state.downloadingFileId === row.id ? (
							<CircularProgress size={24} color="primary" />
						) : (
							<Fragment>
								<Box display="flex" alignItems="center">
									<Tooltip title="Preview">
										<IconButton
											color="primary"
											onClick={() => this.previewInApp(row.userId, row.documentName, row.id)}
											aria-label="open"
										>
											<OpenInBrowserIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Download">
										<IconButton
											color="primary"
											onClick={() => this.downloadFile(row.userId, row.documentName, row.id)}
											aria-label="download"
										>
											<CloudDownloadIcon />
										</IconButton>
									</Tooltip>
									<EditDeleteTableComponent
										recordId={row.id}
										deleteRecord={this.handleDelete}
										hideEditAction={true}
										editRecord={() => window.location.replace(`#/dashboard/F85Reports`)}
									/>
								</Box>
							</Fragment>
						)}
					</Fragment>
				)
			}
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid
					container
					justifyContent="center"
					alignContent="center"
					spacing={2}
					className={classes.root}
				>
					<Grid item xs={12}>
						<Typography
							style={{ color: "#1d5f98", fontWeight: 600, textTransform: "capitalize" }}
							variant="h5"
							component="span"
						>
							<Tooltip title="Back">
								<IconButton onClick={() => window.location.replace("#/dashboard/F85Form")}>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Document Center Reports
						</Typography>
						<div style={{ float: "right" }}>
							<Tooltip title="Table Filter">
								<IconButton onClick={() => this.handleToggleTableFilter()}>
									<FilterIcon color="primary" />
								</IconButton>
							</Tooltip>
						</div>
						<Divider className={classes.divider} />
					</Grid>

					<F85ReportsTableComponent
						rows={this.state.admissionData}
						columns={columns}
						expandedGroupsData={this.state.expandedGroupsData}
						showFilter={this.state.showTableFilter}
						isLoading={this.state.isLoading}
					/>
				</Grid>

				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					isLoading={this.state.isLoading}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={() => this.handleCloseSnackbar()}
				/>

				<F85ReportsFilePreviewComponent
					open={this.state.viewerOpen}
					url={this.state.viewerUrl}
					type={this.state.viewerType}
					name={this.state.viewerFileName}
					// If your child implemented a "loading" prop, it'll show a spinner before url arrives.
					loading={!this.state.viewerUrl && this.state.viewerOpen}
					onDownload={() => {
						if (!this.state.viewerUrl) return;
						const a = document.createElement("a");
						a.href = this.state.viewerUrl;
						a.download = this.state.viewerFileName || "file";
						a.click();
					}}
					onClose={() => {
						// Do NOT revoke here (we cache). We free memory on eviction/unmount.
						this.setState({ viewerOpen: false, viewerUrl: null, viewerType: "", viewerFileName: "" });
					}}
				/>
			</Fragment>
		);
	}
}

export default withStyles(styles)(F85Reports);
