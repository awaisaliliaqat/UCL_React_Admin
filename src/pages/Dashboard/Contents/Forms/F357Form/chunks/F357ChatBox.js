import React, { useState, useEffect } from "react";
import { Box, Chip, TextField, Button, Avatar, Tooltip } from "@material-ui/core";
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';

const F357ChatBox = React.memo(({ salaryIncrementRevisionSheetId, salaryIncrementRevisionSheetEmployeesId, employeeId, statusId, value = [], onChange = () => { } }) => {

	const [F357ChatBoxText, updateF357ChatBoxText] = useState(value);

	const [comment, updateComment] = useState("");

	// Update local state only when the prop `value` changes
	useEffect(() => {
		updateF357ChatBoxText(value);
	}, [value]);

	const handleAdd = () => {
		const trimmed = comment.trim();
		if (!trimmed) return;
		handleCommentSave();
		const commentObj = {comment: trimmed};
		const updatedList = [...F357ChatBoxText, commentObj];
		updateF357ChatBoxText(updatedList);
		onChange(updatedList); // Notify parent only on change
		updateComment("");
	};

	const handleCommentSave = async() => {
        let data =  new FormData();
		data.append("salaryIncrementRevisionSheetEmployeesId", salaryIncrementRevisionSheetEmployeesId);
		data.append("salaryIncrementRevisionSheetId", salaryIncrementRevisionSheetId);
        data.append("employeeId", employeeId);
        data.append("comment", comment.trim());
        // setIsLoading((prevState) => {
        //     return ({ ...prevState, employeeComments: true });
        // });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/CommentSave`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					// handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
                    // handleEmployeeCommentsView();
				} else {
					// handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					
				} else {
					console.error(error);
					// handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
        // setIsLoading((prevState) => {
        //     return ({ ...prevState, employeeComments: false });
        // });
    }

	return (
		<>
			<Box display="flex" flexWrap="wrap" gap={8} mb={1} style={{ maxWidth: "100%" }} >
				{F357ChatBoxText.length !== 0 && (
					F357ChatBoxText.map((obj, index) => (
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
							style={{ borderRadius: 8, width: "100%", whiteSpace: "normal", height: "auto", margin: "2px 0px", justifyContent:"flex-start" }}
						/>
					))
				)}
			</Box>
			<TextField
				id={`F357ChatBox-${salaryIncrementRevisionSheetEmployeesId}`}
				name="F357ChatBox"
				size="small"
				multiline
				minRows={1}
				fullWidth
				value={comment}
				placeholder="Comment"
				disabled={statusId!==1 && statusId!==5}
				onChange={(e) => updateComment(e.target.value)}
				InputProps={{
					endAdornment: (
						<Tooltip title="Add Comment">
							<span>
								<Button
									color="primary"
									size="small"
									disabled={statusId!==1 && statusId!==5}
									onClick={handleAdd}
									style={{ minWidth: 24, padding: 0 }}
								>
									<AddCommentOutlinedIcon fontSize="small" />
								</Button>
							</span>
						</Tooltip>
					),
				}}
			/>
		</>
	);
});

export default F357ChatBox;
