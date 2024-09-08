import React ,{useState} from 'react';
import { DndContext, DragOverlay, closestCenter} from '@dnd-kit/core';
import './Task_dashboard.css';
import DroppableColumn from './droppable_column/droppable_column';
import { TaskCard } from '../task_card/Task_card';
import { ViewTaskDetailsDialog } from "../dialogs/view_task/View_Task_Details";
import Server from "../../server/ServerDetails";

export default function TaskDashboard({tasks,setTasks}) {
    // const [tasks, setTasks] = React.useState(initialTasks);
    const [activeId, setActiveId] = React.useState(null); 
    const [bOpenViewTask ,setOpenViewTask] =useState(false);
  
    function handleOpenViewTaskDialog(event){
        setOpenViewTask(true);
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id); // Set the active ID when dragging starts
    };
    const hadleUpdateTask = async (movedTask, targetStatus) => {
        const result = await Server.post('task/update/', {
            "id": movedTask.id,
            "Title": movedTask.Title,
            "Description": movedTask.Description,
            "Priority": movedTask.Priority,
            "Status": targetStatus
        });
        console.log('response',result)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over || active.id === over.id) {
            return; 
        }
    
        const sourceColumnId = findColumnIdByTaskId(active.id); // Find the source column ID from the task ID
        const destinationColumnId = over.id; // Get the destination column ID
    
        // If the task is being moved within the same column
        if (sourceColumnId === destinationColumnId) {
            const sourceColumnTasks = [...tasks[sourceColumnId]];
            const draggedTaskIndex = sourceColumnTasks.findIndex(task => task.id === active.id);
            
            // If the task is dropped at the same index, do nothing to prevent duplication
            if (draggedTaskIndex === over.index) {
                return;
            }
    
            // Move the task within the same column
            const [movedTask] = sourceColumnTasks.splice(draggedTaskIndex, 1);
            sourceColumnTasks.splice(over.index, 0, movedTask); // Insert at new position
    
            // Update the tasks state
            setTasks({
                ...tasks,
                [sourceColumnId]: sourceColumnTasks,
            });
    
            return; // Exit after handling same column move
        }
    
        // Move the task from the source column to the destination column
        const sourceColumnTasks = [...tasks[sourceColumnId]];
        const destinationColumnTasks = [...tasks[destinationColumnId]];
    
        // Remove from source
        const [movedTask] = sourceColumnTasks.splice(sourceColumnTasks.findIndex(task => task.id === active.id), 1);
        
        // Add to destination
        destinationColumnTasks.push(movedTask);
        hadleUpdateTask(movedTask, destinationColumnId);
    
        // Update the tasks state
        setTasks({
            ...tasks,
            [sourceColumnId]: sourceColumnTasks,
            [destinationColumnId]: destinationColumnTasks,
        });
    };
    

    // Helper function to find the column ID by task ID
    const findColumnIdByTaskId = (taskId) => {
        return Object.keys(tasks).find(columnId => tasks[columnId].some(task => task.id === taskId));
    };

    return (
        <div>
        <DndContext  onDragEnd ={handleDragEnd} onDragStart={handleDragStart} collisionDetection={closestCenter}>
            <div className="task-dashboard-container">
                {Object.keys(tasks).map((columnId) => (
                    <DroppableColumn key={columnId} 
                    columnId={columnId} 
                    tasks={tasks} 
                    setTasks={setTasks} 
                    activeId={activeId}
                    handleOpenViewTaskDialog = {handleOpenViewTaskDialog}
                    setOpenViewTask ={setOpenViewTask}
                      />
                ))}
            </div>
            <DragOverlay>
                {activeId ? <TaskCard 
                // key={task.id}
                task={tasks[findColumnIdByTaskId(activeId)].find(task => task.id === activeId)}
                // isDragging={activeId === task.id} 
                handleOpenViewTaskDialog={handleOpenViewTaskDialog} 
                  setOpenViewTask = {setOpenViewTask}
                 /> : null}
            </DragOverlay>
        </DndContext>
        <ViewTaskDetailsDialog 
            open={bOpenViewTask} 
            setOpenViewTask={setOpenViewTask} 
            // task = {tasks[findColumnIdByTaskId(activeId)].find(task => task.id === activeId)}
         />
        </div>
    );
}
