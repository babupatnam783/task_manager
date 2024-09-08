import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDraggable } from '@dnd-kit/core';
import { ViewTaskDetailsDialog } from "../dialogs/view_task/View_Task_Details";
import { DeleteTaskConfirmDialog } from "../dialogs/delete_task/Delete_task_confirm";
import { EditTaskDetilsDialog } from "../dialogs/edit_task/Edit_Task_Details";
import { SnackbarMessage } from "../message_snackbar/Message_Snackbar";
export const TaskCard = ({ task, tasks, setTasks, activeId, handleOpenViewTaskDialog }) => {
    const { attributes, listeners, setNodeRef, } = useDraggable({
        id: task.id,
    });
    const [bOpenViewTask, setOpenViewTask] = useState(false);
    const [bOpenEditTask, setOpenEditTask] = useState(false);
    const [bOpenDeleteTask, setOpenDeleteTask] = useState(false);
    const [bOpenSnackBar, setOpenSnackBar] = React.useState(false);
    const [sErrorMessage, setErrorMessage] = React.useState("");
    const [sMessageType, setMessageType] = React.useState("");


    // const draggingStyle = {
    //     opacity: isDragging ? 0.5 : 1,
    //     transform: isDragging ? 'translateY(-5px)' : 'translateY(0)',
    //     transition: 'transform 0.2s ease, opacity 0.2s ease',
    // };

    // Handle the open confirm dialog
    function handleOpenDeleteDialog(event) {
        event.stopPropagation();
        event.preventDefault();  
        setOpenDeleteTask(true)
    }

    // Handle the open edit dialog
    function handleOpenEditDialog(event) {
        event.stopPropagation();
        event.preventDefault();
        setOpenEditTask(true)
    }

    // Handle the open view details dialog
    function handleOpenViewDetailsDialog(event) {
        event.stopPropagation();
        event.preventDefault();
        setOpenViewTask(true)
    }

    return (
        <div>
            <Card
                sx={{
                    backgroundColor: '#f5f5f5',
                    maxWidth: 500,
                    marginBottom: 2,
                    // opacity: isDragging ? 0.5 : 1, // Change opacity when dragging
                    // transform: isDragging ? 'scale(1.05)' : 'scale(1)', // Scale up when dragging
                    transition: 'transform 0.2s, opacity 0.2s', // Smooth transition
                    // boxShadow: isDragging ? 4 : 1,
                }}
            >
                <CardContent
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}>
                    <Typography gutterBottom variant="h5" component="div">
                        {task.Title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 3 }}>
                        <strong>Description:</strong> {task.Description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: "column-reverse" }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                            <strong>Created At:</strong> {new Date(task.CreatedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                            <strong>Priority:</strong> {task.Priority}
                        </Typography>
                    </Box>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{ marginRight: 1 }}
                        onClick={handleOpenDeleteDialog} 
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="info"
                        sx={{ marginRight: 1 }}
                        onClick={handleOpenEditDialog}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ marginRight: 1 }}
                        onClick={handleOpenViewDetailsDialog}
                    >
                        View Details
                    </Button>
                </Box>

            </Card>
            <ViewTaskDetailsDialog
                open={bOpenViewTask}
                setOpenViewTask={setOpenViewTask}
                task={task}
            />
            <DeleteTaskConfirmDialog
                open={bOpenDeleteTask}
                setOpenDeleteTask={setOpenDeleteTask}
                task={task}
                tasks={tasks}
                setTasks={setTasks}
                setOpenSnackBar={setOpenSnackBar}
                setErrorMessage={setErrorMessage}
                setMessageType={setMessageType}
            />
            <EditTaskDetilsDialog
                open={bOpenEditTask}
                setOpenEditTask={setOpenEditTask}
                task={task}
                tasks={tasks}
                setTasks={setTasks}
            />
            <SnackbarMessage
                bOpenSnackBar={bOpenSnackBar}
                setOpenSnackBar={setOpenSnackBar}
                sMessage={sErrorMessage}
                sMessType={sMessageType}
            />


        </div>
    );
};
