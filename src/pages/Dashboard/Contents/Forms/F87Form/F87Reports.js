import React, { Component, Fragment } from "react";
import { Box, Divider, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F87ReportsTableComponent from "./Chunks/F87ReportsTableComponent";
import { format } from "date-fns";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CircularProgress } from "@material-ui/core";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import F87ReportsFilePreviewComponent from "./Chunks/F87ReportsFilePreviewComponent";

const styles = () => ({
  root: { paddingBottom: 50, paddingLeft: 20, paddingRight: 20 },
  divider: { backgroundColor: "rgb(58, 127, 187)", opacity: "0.3", width: "100%" }
});

class F87Reports extends Component {
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
      abortController: null,

      // viewer state
      viewerOpen: false,
      viewerUrl: null,
      viewerType: "",
      viewerFileName: ""
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({ isOpenSnackbar: true, snackbarMessage: msg, snackbarSeverity: severity });
  };
  handleCloseSnackbar = (_, reason) => { if (reason !== "clickaway") this.setState({ isOpenSnackbar: false }); };

  // --- MIME helpers (same spirit as F85, plus byte sniffing) ---
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
      case "txt": return "text/plain";
      case "csv": return "text/csv";
      case "doc": return "application/msword";
      case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
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

  // Quick signature sniff (PNG/JPEG/GIF/PDF). Fallback to filename-based type.
  sniffMime = (buf, fileName) => {
    const b = new Uint8Array(buf);
    const startsWith = (...sig) => sig.every((v, i) => b[i] === v);

    if (b.length >= 8 && startsWith(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) return "image/png";           // PNG
    if (b.length >= 3 && startsWith(0xFF, 0xD8, 0xFF)) return "image/jpeg";                                       // JPEG
    if (b.length >= 6 && (startsWith(0x47, 0x49, 0x46, 0x38, 0x37, 0x61) || startsWith(0x47, 0x49, 0x46, 0x38, 0x39, 0x61))) return "image/gif"; // GIF87a/89a
    if (b.length >= 4 && startsWith(0x25, 0x50, 0x44, 0x46)) return "application/pdf";                             // %PDF

    return this.getMimeFromFilename(fileName);
  };

  getData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/View`;
    await fetch(url, {
      method: "GET",
      headers: new Headers({ Authorization: "Bearer " + localStorage.getItem("uclAdminToken") })
    })
      .then(res => { if (!res.ok) throw res; return res.json(); })
      .then(json => {
        if (json.CODE === 1) {
          const expandedGroupsData = (json.DATA || []).map(x => String(x.studentNucleusId));
          this.setState({ admissionData: json.DATA || [], expandedGroupsData });
        } else {
          this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
        }
      })
      .catch(error => {
        if (error.status === 401) this.setState({ isLoginMenu: true, isReload: true });
        else this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
        console.log(error);
      });
    this.setState({ isLoading: false });
  };

  handleDelete = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C87CommonStudentsDocuments/Delete`;
    await fetch(url, {
      method: "POST", body: data,
      headers: new Headers({ Authorization: "Bearer " + localStorage.getItem("uclAdminToken") })
    })
      .then(res => { if (!res.ok) throw res; return res.json(); })
      .then(json => {
        if (json.CODE === 1) { this.handleOpenSnackbar("Deleted", "success"); this.getData(); }
        else this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
      })
      .catch(error => {
        if (error.status === 401) this.setState({ isLoginMenu: true, isReload: false });
        else this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
        console.log(error);
      });
  };

  downloadFile = (studentId, fileName, rowId) => {
    if (this.state.abortController) this.state.abortController.abort();
    setTimeout(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      this.setState({ downloadingFileId: rowId, abortController: controller });

      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonStudentsDocumentsFileView?studentId=${encodeURIComponent(studentId)}&fileName=${encodeURIComponent(fileName)}`;
      fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("uclAdminToken") },
        signal
      })
        .then(res => {
          if (res.ok) return res.blob();
          if (res.status === 401) { this.setState({ isLoginMenu: true, isReload: false }); throw new Error("Unauthorized"); }
          if (res.status === 404) { this.handleOpenSnackbar("File not found.", "error"); throw new Error("File not found"); }
          this.handleOpenSnackbar("Operation failed. Please try again later.", "error");
          throw new Error(`Download failed with status ${res.status}`);
        })
        .then(blob => {
          if (!blob) return;
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl; a.download = fileName;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          window.URL.revokeObjectURL(downloadUrl);
        })
        .catch(error => {
          if (error.name === "AbortError") this.handleOpenSnackbar("Download cancelled.", "warning");
          else console.error("Download error:", error);
        })
        .finally(() => this.setState({ downloadingFileId: null, abortController: null }));
    }, 100);
  };

  // ---------- NEW: in‑app preview (robust MIME detection) ----------
  previewInApp = (studentId, fileName, rowId) => {
    if (this.state.abortController?.abort) this.state.abortController.abort();
    const controller = new AbortController();
    const signal = controller.signal;
    this.setState({ downloadingFileId: rowId, abortController: controller });

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonStudentsDocumentsFileView?studentId=${encodeURIComponent(studentId)}&fileName=${encodeURIComponent(fileName)}`;
    fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("uclAdminToken") },
      signal
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) this.setState({ isLoginMenu: true, isReload: false });
          if (res.status === 404) this.handleOpenSnackbar("File not found.", "error");
          throw new Error(`HTTP ${res.status}`);
        }
        return res.arrayBuffer().then(buf => {
          // 1) sniff magic bytes; 2) fallback to filename; ignore generic headers
          const mime = this.sniffMime(buf, fileName);
          return new Blob([buf], { type: mime });
        });
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        this.setState({
          viewerOpen: true,
          viewerUrl: blobUrl,
          viewerType: blob.type || this.getMimeFromFilename(fileName),
          viewerFileName: fileName
        });
      })
      .catch(err => {
        if (err.name === "AbortError") this.handleOpenSnackbar("Operation cancelled.", "warning");
        else this.handleOpenSnackbar("Failed to open file.", "error");
        console.error(err);
      })
      .finally(() => this.setState({ downloadingFileId: null, abortController: null }));
  };

  onHandleChange = (e) => { const { name, value } = e.target; this.setState({ [name]: value }); };
  handleToggleTableFilter = () => this.setState({ showTableFilter: !this.state.showTableFilter });

  componentDidMount() {
    const { isDrawerOpen = false, setDrawerOpen = () => {} } = this.props;
    if (isDrawerOpen) setDrawerOpen(false);
    this.getData();
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "id", title: "ID" },
      { name: "studentNucleusId", title: "Nucleus ID" },
      { name: "studentLabel", title: "Student Name" },
      { name: "label", title: "Label" },
      { name: "sortOrder", title: "Sort Order" },
      { name: "description", title: "Description" },
      { name: "uploadedByLabel", title: "Uploaded By" },
      { name: "uploadedOn", title: "Uploaded On",
        getCellValue: (row) => row.uploadedOn ? format(row.uploadedOn, "dd-MM-yyyy hh:mm a") : "" },
      { name: "action", title: "Action",
        getCellValue: (row) => (
          <Fragment>
            {this.state.downloadingFileId === row.id ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              <Box display="flex" alignItems="center">
                <Tooltip title="Preview">
                  <IconButton
                    color="primary"
                    onClick={() => this.previewInApp(row.studentId, row.documentName, row.id)}
                    aria-label="open"
                  >
                    <OpenInBrowserIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton
                    color="primary"
                    onClick={() => this.downloadFile(row.studentId, row.documentName, row.id)}
                    aria-label="download"
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                </Tooltip>
                <EditDeleteTableComponent
                  recordId={row.id}
                  deleteRecord={this.handleDelete}
                  hideEditAction={true}
                  editRecord={() => window.location.replace(`#/dashboard/F87Reports`)}
                />
              </Box>
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
        <Grid container justifyContent="center" alignContent="center" spacing={2} className={classes.root}>
          <Grid item xs={12}>
            <Typography style={{ color: "#1d5f98", fontWeight: 600, textTransform: "capitalize" }} variant="h5" component="span">
              <Tooltip title="Back">
                <IconButton onClick={() => window.location.replace("#/dashboard/F87Form")}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Students Document Center Reports
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

          <F87ReportsTableComponent
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

        {/* File preview dialog */}
        <F87ReportsFilePreviewComponent
          open={this.state.viewerOpen}
          url={this.state.viewerUrl}
          type={this.state.viewerType}
          name={this.state.viewerFileName}
          onDownload={() => {
            const a = document.createElement("a");
            a.href = this.state.viewerUrl;
            a.download = this.state.viewerFileName || "file";
            a.click();
          }}
          onClose={() => {
            if (this.state.viewerUrl) URL.revokeObjectURL(this.state.viewerUrl);
            this.setState({ viewerOpen: false, viewerUrl: null, viewerType: "", viewerFileName: "" });
          }}
        />
      </Fragment>
    );
  }
}
export default withStyles(styles)(F87Reports);
