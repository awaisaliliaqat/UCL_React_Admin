import React, { useState, useEffect } from "react";
import { Box, Chip, TextField, Button, Avatar, Tooltip } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

const F357ChatBox = React.memo(({ id, value = [], onChange = () => { } }) => {

	const [F357ChatBoxText, updateF357ChatBoxText] = useState(value);

	const [comment, updateComment] = useState("");

	// Update local state only when the prop `value` changes
	useEffect(() => {
		updateF357ChatBoxText(value);
	}, [value]);

	const handleAdd = () => {
		const trimmed = comment.trim();
		if (!trimmed) return;

		const updatedList = [...F357ChatBoxText, trimmed];
		updateF357ChatBoxText(updatedList);
		onChange(updatedList); // Notify parent only on change
		updateComment("");
	};

	return (
		<>
			<Box display="flex" flexWrap="wrap" gap={8} mb={1} style={{ maxWidth: "100%" }} >
				{F357ChatBoxText.length !== 0 && (
					F357ChatBoxText.map((text, index) => (
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
									{text}
								</Box>
							}
							color="primary"
							variant="outlined"
        					avatar={<Avatar style={{margin:"4px 0px 4px 4px"}}>U</Avatar>}
							style={{ borderRadius: 8, width: "100%", whiteSpace: "normal", height: "auto", margin: "2px 0px", justifyContent:"flex-start" }}
						/>
					))
				)}
			</Box>
			<TextField
				id={`F357ChatBox-${id}`}
				name="F357ChatBox"
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

export default F357ChatBox;
