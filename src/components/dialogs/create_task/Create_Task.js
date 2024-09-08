import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Server from "../../../server/ServerDetails";
import { SnackbarMessage } from "../../message_snackbar/Message_Snackbar";

export const CreateTaskDialog = ({ open, setOpenCreateTask, tasks }) => {
  const [oCreatedTask, SetCreatedTask] = React.useState({
    Title: "",
    Description: "",
    Priority: "",
  });
  const [bOpenSnackBar, setOpenSnackBar] = React.useState(false);
  const [sErrorMessage, setErrorMessage] = React.useState("");
  const [sMessageType, setMessageType] = React.useState("");

  const handleClose = () => {
    setOpenCreateTask(false);
    handleClearState();
  };

  const handleOnChange = (oEvent, sField) => {
    SetCreatedTask((prevState) => ({
      ...prevState,
      [sField]: oEvent.target.value,
    }));
  };

  const handleClearState = () => {
    SetCreatedTask({
      Title: "",
      Description: "",
      CreatedAt: "",
      Priority: "",
    });
  };

  const handleCreateTask = async () => {
    let errorMessages = [];

    if (!oCreatedTask.Title) {
      errorMessages.push("Task title is required.");
    }
    if (!oCreatedTask.Description) {
      errorMessages.push("Task description is required.");
    }
    if (!oCreatedTask.Priority) {
      errorMessages.push("Task priority is required.");
    }

    if (errorMessages.length > 0) {
      setOpenSnackBar(true);
      setErrorMessage(errorMessages.join(" "));
    } else {
      try {
        const creatTaskresponse = await Server.post(
          "task/create",
          oCreatedTask
        );
        if (creatTaskresponse.status === 201) {
          var data = creatTaskresponse.data.data;
          tasks["todo"].push({ ...oCreatedTask, id: data._id, CreatedAt: oCreatedTask.CreatedAt });
          setErrorMessage(creatTaskresponse.data.message);
          setMessageType("success");
          setOpenSnackBar(true);
          handleClearState();
        }
      } catch (error) {
        let message;
        if (error.response?.data) {
          message = error.response.data.message;
        } else {
          message = error.message;
        }
        setErrorMessage(message);
        setMessageType("error");
        setOpenSnackBar(true);
        handleClearState();
        console.log(error.message);
      }
      setOpenCreateTask(false);
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="task-title"
                  label="Task Title"
                  variant="outlined"
                  placeholder="Enter task title"
                  value={oCreatedTask.Title}
                  onChange={(oEvent) => handleOnChange(oEvent, "Title")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="task-description"
                  label="Task Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={oCreatedTask.Description}
                  fullWidth
                  placeholder="Enter task description"
                  onChange={(oEvent) => handleOnChange(oEvent, "Description")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="priority"
                  label="Priority"
                  select
                  variant="outlined"
                  fullWidth
                  value={
                    oCreatedTask.Priority
                      ? oCreatedTask.Priority
                      : " "
                  }
                  SelectProps={{
                    native: true,
                  }}
                  onChange={(oEvent) => handleOnChange(oEvent, "Priority")}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarMessage
        bOpenSnackBar={bOpenSnackBar}
        setOpenSnackBar={setOpenSnackBar}
        sMessage={sErrorMessage}
        sMessType={sMessageType}
      />
    </>
  );
};
