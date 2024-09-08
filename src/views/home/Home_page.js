import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TaskDashboard from "../../components/task_dashboard/Task_dashboard";
import { CreateTaskDialog } from "../../components/dialogs/create_task/Create_Task";
import { DeleteTaskConfirmDialog } from "../../components/dialogs/delete_task/Delete_task_confirm";
import Server from "../../server/ServerDetails";
import './Home_page.css'

const initialTasks = {
    todo: [],
    inProgress: [],
    done: []
};
export default function HomePage() {
    const [bOpenCreateTask, setOpenCreateTask] = useState(false);
    const [oAllTasks, setAllTasks] = useState(initialTasks);

    const formatTasks = (tasks) => {
        const taskCategories = {
            todo: [],
            inProgress: [],
            done: []
        };

        tasks.forEach(task => {
            const formattedTask = {
                id: task._id,
                Title: task.Title,
                Description: task.Description,
                CreatedAt: task.CreatedAt,
                Priority: task.Priority
            };

            // Classify tasks based on their status
            switch (task.Status) {
                case "todo":
                    taskCategories.todo.push(formattedTask);
                    break;
                case "inProgress":
                    taskCategories.inProgress.push(formattedTask);
                    break;
                case "done":
                    taskCategories.done.push(formattedTask);
                    break;
                default:
                    break;
            }
        });

        return taskCategories;
    };

    useEffect(async () => {
        try {
            const fetchResponse = await Server.get("/task");
            if (fetchResponse.status === 201) {
                const dbTasks = fetchResponse.data.tasks;
                const formattedTasks = formatTasks(dbTasks);
                setAllTasks(formattedTasks)
            }
        }
        catch (err) {
            console.log(err.message)
        }


    }, []);

    function handleOpenCreateTaskDialog(event) {
        setOpenCreateTask(true);
    }
    return (
        <div className="task_manager_mainpage_background">
            <div className="button-container">
                <Button variant="contained" className="add-task-button" onClick={handleOpenCreateTaskDialog}>
                    Add Task
                </Button>

            </div>
            <div className="search_container_background">
                <div className="search_input_container">
                    <div className="search_label">Search:</div>
                    <input className="search_input" placeholder="Search..." />
                </div>
                <div className="sort_dropdown_container">
                    <div className="sort_label">Sort By:</div>
                    <select className="sort_dropdown" placeholder="Search..." />
                </div>
            </div>
            <div className="task-dashboard-container">
                <TaskDashboard
                    tasks={oAllTasks}
                    setTasks={setAllTasks}
                />
                <CreateTaskDialog open={bOpenCreateTask} setOpenCreateTask={setOpenCreateTask} tasks={oAllTasks} />
                <DeleteTaskConfirmDialog />
            </div>

        </div>
    );
}