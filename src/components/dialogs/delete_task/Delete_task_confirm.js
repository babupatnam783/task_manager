import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Server from "../../../server/ServerDetails";
import { SnackbarMessage } from "../../message_snackbar/Message_Snackbar";

export const DeleteTaskConfirmDialog = ({
  open,
  setOpenDeleteTask,
  task,
  tasks,
  setTasks,
  setOpenSnackBar,
  setErrorMessage,
  setMessageType
}) => {
  // const [bOpenSnackBar, setOpenSnackBar] = React.useState(false);
  // const [sErrorMessage, setErrorMessage] = React.useState("");
  // const [sMessageType, setMessageType] = React.useState("");

  const handleClose = () => {
    setOpenDeleteTask(false); // Close the dialog
  };

  // Helper function to find the column ID by task ID
  const findColumnIdByTaskId = (taskId) => {
    return Object.keys(tasks).find((columnId) =>
      tasks[columnId].some((task) => task.id === taskId)
    );
  };

  const handleDelete = async () => {
    const sourceColumnId = findColumnIdByTaskId(task.id);
    try {
      const deleteResponse = await Server.delete(`task/${task.id}`);
      if (deleteResponse.status === 201) {
        if (sourceColumnId) {
          const updatedTasks = {
            ...tasks,
            [sourceColumnId]: tasks[sourceColumnId].filter(
              (t) => t.id !== task.id
            ),
          };
         
          setErrorMessage(deleteResponse.data.message);
          setMessageType("success");
          setOpenSnackBar(true);
          setTasks(updatedTasks);
        }
      }
    } catch (error) {
      console.log(error.message);
      let message;
      if (error.response?.data) {
        message = error.response.data.message;
      } else {
        message = error.message;
      }
      setErrorMessage(message);
      setMessageType("error");
      setOpenSnackBar(true);
    }
      setTimeout(() => {
          setOpenDeleteTask(false);
      }, 1000);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the task titled "{task?.Title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* <SnackbarMessage
        bOpenSnackBar={bOpenSnackBar}
        setOpenSnackBar={setOpenSnackBar}
        sMessage={sErrorMessage}
        sMessType={sMessageType}
      /> */}
    </>
  );
};
