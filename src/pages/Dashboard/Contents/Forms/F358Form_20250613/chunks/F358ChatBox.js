import React, { useState, useEffect } from "react";
import { Box, Chip, TextField, Button, Avatar, Tooltip } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

const F358ChatBox = React.memo(({ id, value = [], onChange = () => {} }) => {

  const [F358chatBoxText, updateF358ChatBoxText] = useState(value);
  
  const [comment, updateComment] = useState("");

  // Update local state only when the prop `value` changes
  useEffect(() => {
    updateF358ChatBoxText(value);
  }, [value]);

  const handleAdd = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
	const commentObj = {comment: trimmed};
    const updatedList = [...F358chatBoxText, commentObj];
    updateF358ChatBoxText(updatedList);
    onChange(updatedList); // Notify parent only on change
    updateComment("");
  };

	console.log("Hello");

	return (
		<>
			<Box
				display="flex"
				flexWrap="wrap"
				gap={8}
				mb={1}
				style={{ maxWidth: "100%" }}
			>
				{F358chatBoxText.length !== 0 && (
					F358chatBoxText.map((obj, index) => (
						<Chip
							key={`comment-${index}`}
							label={
								<Box
									component="span"
									sx={{
										display: 'block',
										whiteSpace: 'normal',
										wordBreak: 'break-word',
										padding: '2px 0px',
										textAlign: 'justify',
										marginLeft:-5
									}}
								>
									{obj.comment}
								</Box>
							}
							color="primary"
							variant="outlined"
        					avatar={<Tooltip title={obj.createdByLabel}><Avatar style={{margin:"4px 0px 4px 4px"}}>{obj.createdByLabel?.charAt(0).toUpperCase()}</Avatar></Tooltip>}
							style={{
								borderRadius: 8,
								width: "100%",
								whiteSpace: "normal",
								height: "auto",
								margin: "2px 0px",
								justifyContent:"flex-start"
							}}
						/>
					))
				)}
			</Box>
			<TextField
				id={`F358chatBox-${id}`}
				name="F358chatBox"
				size="small"
				multiline
				minRows={1}
				fullWidth
				value={comment}
				placeholder="Message"
				onChange={(e) => updateComment(e.target.value)}
				InputProps={{
					endAdornment: (
						<Tooltip title="Add">
							<Button
								color="primary"
								size="small"
								onClick={handleAdd}
								style={{ minWidth: 24, padding: 0 }}
							>
								<SendIcon fontSize="small" />
							</Button>
						</Tooltip>
					),
				}}
			/>
		</>
	);
});

export default F358ChatBox;
