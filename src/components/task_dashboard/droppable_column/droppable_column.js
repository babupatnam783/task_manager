import { TaskCard } from '../../task_card/Task_card';
import { useDroppable} from '@dnd-kit/core';
import { SortableContext} from '@dnd-kit/sortable';
import '../Task_dashboard.css';

export default function DroppableColumn({ columnId, tasks, setTasks,activeId ,handleOpenViewTaskDialog,setOpenViewTask}) {
    const { setNodeRef } = useDroppable({
        id: columnId,
    });

    function DraggableTask({ task }) {
        return (
            <div>
                <TaskCard 
                    key={task.id}
                    task={task}
                    tasks ={tasks}
                    setTasks={setTasks}
                    activeId={activeId}
                    handleOpenViewTaskDialog={handleOpenViewTaskDialog} 
                    setOpenViewTask = {setOpenViewTask}
                  />
            </div>
        );
    }

    return (
        <div ref={setNodeRef} className="task-column">
            <div className='task-column-title'>
            <strong>{columnId.charAt(0).toUpperCase() + columnId.slice(1)}</strong>
            </div>
            <SortableContext items={tasks[columnId].map(task => task.id)}>
                {tasks[columnId].map((task) => (
                    <DraggableTask key={task.id} task={task} 
                    />
                ))}
            </SortableContext>
        </div>
    );
}