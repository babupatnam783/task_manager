import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Server from "../../../server/ServerDetails";
import { SnackbarMessage } from '../../message_snackbar/Message_Snackbar';

export const EditTaskDetilsDialog = ({ open, setOpenEditTask, task, tasks, setTasks }) => {
  const [oTask, SetTask] = React.useState(task);
  const [bOpenSnackBar, setOpenSnackBar] = React.useState(false);
  const [sErrorMessage, setErrorMessage] = React.useState("");
  const [sMessageType, setMessageType] = React.useState("");

  const handleClose = () => {
    setOpenEditTask(false);
  };
  const handleOnChangeTitle = (oEvent, sField) => {
    SetTask(prevState => ({
      ...prevState,
      [sField]: oEvent.target.value
    }));
    console.log(oEvent.target.value);
  }

  // Helper function to find the column ID by task ID
  const findColumnIdByTaskId = (taskId) => {
    return Object.keys(tasks).find(columnId => tasks[columnId].some(task => task.id === taskId));
  };


  const handleCreateTask = async () => {
    let errorMessages = [];

    if (!oTask.Title) {
      errorMessages.push("Task title is required.");
    }
    if (!oTask.Description) {
      errorMessages.push("Task description is required.");
    }
    if (oTask.Priority === "") {
      errorMessages.push("Task priority is required.");
    }

    if (errorMessages.length > 0) {
      setOpenSnackBar(true);
      setErrorMessage(errorMessages.join(" "));
    } else {
      const sourceColumnId = findColumnIdByTaskId(task.id);
      try {
        const editResponse = await Server.post("task/update/", {
          id: task.id,
          Title: task.Title,
          Description: task.Description,
          Priority: task.Priority,
        });
        if (editResponse.status === 201) {
          if (sourceColumnId) {
            setTasks(prevState => ({
              ...prevState,
              [sourceColumnId]: prevState[sourceColumnId].map(oOldTask => oOldTask.id === oTask.id ? { ...oOldTask, ...oTask } : oOldTask)

            }));
            setErrorMessage(editResponse.data.message);
            setMessageType("success");
            setOpenSnackBar(true);
            setOpenEditTask(false);
          }
        }

      }
      catch (error) {
        let message;
        if (error.response?.data) {
          message = error.response.data.message;
        } else {
          message = error.message;
        }
        setErrorMessage(message);
        setMessageType("error");
        setOpenSnackBar(true);
        setTimeout(()=>{
        setOpenEditTask(false);
        },2000);
      }
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
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
                   required
                  fullWidth
                  id="task-title"
                  label="Task Title"
                  variant="outlined"
                  placeholder="Enter task title"
                  value={oTask && oTask.Title}
                  onChange={(oEvent) =>
                    handleOnChangeTitle(oEvent, "Title")
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="task-description"
                  label="Task Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  placeholder="Enter task description"
                  value={oTask && oTask.Description}
                  onChange={(oEvent) =>
                    handleOnChangeTitle(oEvent, "Description")
                  }
                  InputLabelProps={{
                    shrink: oTask && oTask.Description ? true : false, // Keep label above the input
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="priority"
                  label="Priority"
                  select
                  variant="outlined"
                  fullWidth
                  value={oTask ? oTask.Priority : ""}
                  onChange={(oEvent) =>
                    handleOnChangeTitle(oEvent, "Priority")
                  }
                  SelectProps={{
                    native: true,
                  }}
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
