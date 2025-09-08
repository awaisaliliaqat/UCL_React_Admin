// ./Chunks/EmployeeProfileFilePreviewComponent.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, useMediaQuery, } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const useStyles = makeStyles(() => ({
  paper: { width: "90vw", maxWidth: "1600px" },
  content: { padding: 0 },
  viewer: { width: "100%", height: "80vh", border: 0 },
}));

const EmployeeProfileFilePreviewComponent = ({ open, url, type, name, onClose, onDownload }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isImage = (type || "").startsWith("image/");
  const isPdf = type === "application/pdf";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      PaperProps={{ className: classes.paper }}
      aria-labelledby="employee-file-preview-title"
    >
      <DialogTitle disableTypography style={{ display: "flex", alignItems: "center" }}>
        <Typography
          id="employee-file-preview-title"
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
        <Box style={{ width: "90vw", maxWidth: 1600, height: fullScreen ? "calc(100vh - 64px)" : "80vh" }}>
          {isPdf ? (
            <object data={url} type="application/pdf" className={classes.viewer}>
              <iframe title="pdf-preview" src={url} className={classes.viewer} />
            </object>
          ) : isImage ? (
            <Box display="flex" alignItems="center" justifyContent="center" style={{ width: "100%", height: "100%" }}>
              <img src={url} alt={name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </Box>
          ) : (
            <iframe title="file-preview" src={url} className={classes.viewer} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProfileFilePreviewComponent;
