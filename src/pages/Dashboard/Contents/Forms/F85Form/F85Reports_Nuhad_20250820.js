import React, { Component, Fragment } from "react";
import { Box, Divider, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F85ReportsTableComponent from "./Chunks/F85ReportsTableComponent";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { format } from "date-fns";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CircularProgress } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

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
      downloadingFileId : null,
      abortController : null
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      isOpenSnackbar: false,
    });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C85CommonUsersDocuments/View`;
    await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
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
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  handleDelete = async (event) => {
    event.preventDefault()
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
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then(
      (json) => {
        if (json.CODE === 1) {
          this.handleOpenSnackbar("Deleted", "success");
          this.getData();
        } else {
          this.handleOpenSnackbar( json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error" );
        }
      },
      (error) => {
        if (error.status === 401) {
          this.setState({
            isLoginMenu: true,
            isReload: false,
          });
        } else {
          this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
          console.log(error);
        }
      }
    );
  };

  downloadFile = (userId, storageName, displayName, rowId) => {
    if (this.state.abortController) this.state.abortController.abort();

    setTimeout(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      this.setState({ downloadingFileId: rowId, abortController: controller });

      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUsersDocumentsFileView?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(storageName)}`;

      fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("uclAdminToken") },
        signal,
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              this.setState({ isLoginMenu: true, isReload: false });
            }
            throw new Error(`Download failed (${res.status})`);
          }
          return res.blob();
        })
        .then((blob) => {
          if (!blob) return;
          const objUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objUrl;
          a.setAttribute("download", displayName || storageName || "file");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(objUrl);
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            this.handleOpenSnackbar("Download cancelled.", "warning");
          } else {
            console.error("Download error:", err);
            this.handleOpenSnackbar("Operation failed. Please try again later.", "error");
          }
        })
        .finally(() => {
          this.setState({ downloadingFileId: null, abortController: null });
        });
    }, 100);
  };

guessMimeFromExt = (name = "") => {
  const ext = (name.split(".").pop() || "").toLowerCase();
  const map = {
    // images
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    // documents
    pdf: "application/pdf",
    txt: "text/plain",
    log: "text/plain",
    csv: "text/csv",
    json: "application/json",
    xml: "application/xml",
    html: "text/html",
  };
  return map[ext];
};

// Detect MIME from the first bytes (basic “magic bytes” sniffing)
sniffMimeFromBytes = async (blob) => {
  const buf = await blob.slice(0, 16).arrayBuffer();
  const b = new Uint8Array(buf);
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return "image/png";     // PNG
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return "image/jpeg";                       // JPEG
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";       // GIF
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "application/pdf"; // PDF
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) return "image/webp";      // WEBP (RIFF...WEBP)
  if (b[0] === 0x3C) return "text/html";                                                           // likely HTML/SVG/XML
  return "";
};

openFile = async (userId, storageName, displayName, rowId) => {
  // Open a tab immediately (ties to user click; popup blockers are happy)
  const win = window.open("", "_blank");
  if (!win) {
    this.handleOpenSnackbar("Please allow pop-ups to preview files.", "warning");
    return;
  }

  // Lightweight loading shell
  win.document.open();
  win.document.write(`<!doctype html><html><head><meta charset="utf-8">
    <title>${displayName || "Preview"}</title>
    <style>
      html,body{height:100%;margin:0;background:#fff;font-family:sans-serif}
      .bar{padding:8px 12px;border-bottom:1px solid #eee;display:flex;gap:12px;align-items:center}
      .bar b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70vw}
    </style>
  </head><body>
    <div class="bar"><b>${displayName || storageName || "file"}</b><span>Loading…</span></div>
  </body></html>`);
  win.document.close();

  this.setState({ downloadingFileId: rowId });

  const url =
    `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/` +
    `CommonUsersDocumentsFileView?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(storageName)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("uclAdminToken") },
    });
    if (!res.ok) {
      if (res.status === 401) this.setState({ isLoginMenu: true, isReload: false });
      throw new Error(`HTTP ${res.status}`);
    }

    const headerType = res.headers.get("Content-Type") || "";
    const blob = await res.blob();

    // Decide the best MIME so the browser knows how to render
    const magicType = await this.sniffMimeFromBytes(blob);
    const extType = this.guessMimeFromExt(displayName || storageName);
    const chosenType = magicType || extType || headerType || blob.type || "application/octet-stream";

    // Use the child window’s URL object for blob URL creation
    const childURL = win.URL || win.webkitURL || URL;
    const typedBlob = chosenType === blob.type ? blob : new Blob([blob], { type: chosenType });

    // What kind of thing is it?
    const isImage = chosenType.startsWith("image/");
    const isPdf = chosenType === "application/pdf" || chosenType.includes("pdf");
    const isTextLike =
      chosenType.startsWith("text/") ||
      chosenType.includes("json") ||
      chosenType.includes("xml") ||
      chosenType.includes("csv");

    let contentHtml = "";

    if (isImage) {
      const objUrl = childURL.createObjectURL(typedBlob);
      contentHtml = `<img src="${objUrl}" style="max-width:100vw;max-height:calc(100vh - 41px);display:block;margin:0 auto" />`;
      const cleanup = () => { try { childURL.revokeObjectURL(objUrl); } catch {} };
      win.addEventListener("unload", cleanup, { once: true });
      setTimeout(cleanup, 5 * 60 * 1000);
    } else if (isPdf) {
      const objUrl = childURL.createObjectURL(typedBlob);
      contentHtml = `<iframe src="${objUrl}" style="border:0;width:100vw;height:calc(100vh - 41px)"></iframe>`;
      const cleanup = () => { try { childURL.revokeObjectURL(objUrl); } catch {} };
      win.addEventListener("unload", cleanup, { once: true });
      setTimeout(cleanup, 5 * 60 * 1000);
    } else if (isTextLike) {
      // Render text directly (pretty-print JSON)
      const raw = await typedBlob.text();
      let pretty = raw;
      if (chosenType.includes("json")) {
        try { pretty = JSON.stringify(JSON.parse(raw), null, 2); } catch {}
      }
      const escaped = pretty
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      contentHtml = `<pre style="white-space:pre-wrap;word-break:break-word;margin:12px">${escaped}</pre>`;
    } else {
      // Unknown type → show a download link
      const objUrl = childURL.createObjectURL(typedBlob);
      const name = displayName || storageName || "file";
      contentHtml = `<div style="padding:16px">
        File type <code>${chosenType}</code> can’t be previewed.
        <a href="${objUrl}" download="${name}">Download file</a>
      </div>`;
      const cleanup = () => { try { childURL.revokeObjectURL(objUrl); } catch {} };
      win.addEventListener("unload", cleanup, { once: true });
      setTimeout(cleanup, 5 * 60 * 1000);
    }

    const html = `<!doctype html><html><head><meta charset="utf-8">
      <title>${displayName || "Preview"}</title>
      <style>
        html,body{height:100%;margin:0;background:#fff;font-family:sans-serif}
        .bar{padding:8px 12px;border-bottom:1px solid #eee;display:flex;gap:12px;align-items:center}
        .bar b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70vw}
      </style>
    </head><body>
      <div class="bar"><b>${displayName || storageName || "file"}</b><a href="javascript:window.print()">Print</a></div>
      ${contentHtml}
    </body></html>`;

    win.document.open(); win.document.write(html); win.document.close();
  } catch (e) {
    try {
      win.document.open();
      win.document.write(`<!doctype html><html><body style="padding:16px;color:#b00020;font-family:sans-serif">
        Failed to open file.<br/><pre style="white-space:pre-wrap">${String(e && e.message ? e.message : e)}</pre>
      </body></html>`);
      win.document.close();
    } catch {}
    this.handleOpenSnackbar("Failed to open file.", "error");
  } finally {
    this.setState({ downloadingFileId: null });
  }
};


  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  componentDidMount() {
    const { isDrawerOpen = false, setDrawerOpen = () => { } } = this.props;
    if (isDrawerOpen) {
      setDrawerOpen(false);
    }
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
      { name: "uploadedByLabel", title: "Uploaded By" },
      { name: "uploadedOn", title: "Uploaded On",
        getCellValue: (row) => row.uploadedOn ? format(row.uploadedOn, "dd-MM-yyyy hh:mm a") : ""
      },
      {
        name: "action",
        title: "Action",
        getCellValue : (row) => (
          <Fragment>
            {this.state.downloadingFileId === row.id ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              <Fragment>
                <Box display="flex" alignItems="center">
                  <Tooltip title="Open">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        this.openFile(
                          row.userId,
                          row.documentName,                       // stored filename for API
                          row.fileName || row.documentName,       // nice display name
                          row.id
                        )
                      }
                      aria-label="open"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        this.downloadFile(
                          row.userId,
                          row.documentName,                       // stored filename for API
                          row.fileName || row.documentName,       // download name
                          row.id
                        )
                      }
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
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
              component="span"
            >
              <Tooltip title="Back">
                <IconButton
                  onClick={() =>
                    window.location.replace("#/dashboard/F85Form")
                  }
                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Document Center Reports
            </Typography>
            <div style={{ float: "right" }}>
              <Tooltip title="Table Filter">
                <IconButton
                  onClick={() => this.handleToggleTableFilter()}
                >
                  <FilterIcon color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Divider
              className={classes.divider}
            />
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
      </Fragment>
    );
  }
}
export default withStyles(styles)(F85Reports);
