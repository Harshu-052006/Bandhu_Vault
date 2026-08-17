'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, Trash2, Link as LinkIcon, CheckCircle } from 'lucide-react'
import { createTask, deleteTask, completeTask, updateTaskStatus } from '@/lib/actions/task-actions'
import { useRouter } from 'next/navigation'

const COLUMNS = [
  { id: 'PENDING', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'COMPLETED', title: 'Done' }
];

export default function KanbanBoard({ project, currentUserId, isLeader }: { project: any, currentUserId: string, isLeader: boolean }) {
  const router = useRouter()
  const [tasks, setTasks] = useState(project.tasks || [])
  
  // Update local state when project.tasks changes
  // eslint-disable-next-line
  useEffect(() => {
    setTasks(project.tasks || [])
  }, [project.tasks])

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [proofText, setProofText] = useState('')
  const [isCompletingTask, setIsCompletingTask] = useState(false)

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Optimistic update
    const newTasks = [...tasks];
    const taskIndex = newTasks.findIndex(t => t.id === draggableId);
    if (taskIndex > -1) {
      newTasks[taskIndex] = { ...newTasks[taskIndex], status: newStatus };
      setTasks(newTasks);
      
      try {
        await updateTaskStatus(draggableId, newStatus);
      } catch (error) {
        console.error(error);
        alert("Failed to update task status. You might not have permission.");
        // Revert on error
        router.refresh(); 
      }
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-primary" />
          Kanban Board
        </h3>
        {isLeader && (
          <button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="rounded-lg bg-muted p-1.5 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground transition-all"
            title="Assign Task"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {showTaskForm && (
        <div className="mb-6 p-4 rounded-xl bg-muted border border-border space-y-3">
          <input 
            placeholder="Task Title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <textarea 
            placeholder="Description (optional)"
            value={taskDesc}
            onChange={e => setTaskDesc(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            rows={2}
          />
          <select 
            value={taskAssignee}
            onChange={e => setTaskAssignee(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="" disabled>Assign to...</option>
            <option value={project.leaderId}>{project.leader?.name || "Group Leader"}</option>
            {project.members?.map((m: any) => (
              <option key={m.userId} value={m.userId}>{m.user?.name || m.user?.email}</option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setShowTaskForm(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            <button 
              disabled={!taskTitle || !taskAssignee || isCreatingTask}
              onClick={async () => {
                setIsCreatingTask(true)
                try {
                  const formData = new FormData()
                  formData.append('title', taskTitle)
                  formData.append('description', taskDesc)
                  formData.append('assigneeId', taskAssignee)
                  await createTask(project.id, formData)
                  setTaskTitle('')
                  setTaskDesc('')
                  setTaskAssignee('')
                  setShowTaskForm(false)
                } catch (e) {
                  console.error(e)
                } finally {
                  setIsCreatingTask(false)
                }
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium shadow-sm disabled:opacity-50"
            >
              Assign Task
            </button>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const columnTasks = tasks.filter((t: any) => (t.status || 'PENDING') === col.id);
            return (
              <div key={col.id} className="flex flex-col bg-muted/30 rounded-xl p-3 min-h-[300px]">
                <h4 className="text-sm font-semibold text-foreground mb-3 px-1">{col.title} <span className="text-muted-foreground text-xs font-normal">({columnTasks.length})</span></h4>
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className="flex-1 space-y-2"
                    >
                      {columnTasks.map((task: any, index: number) => {
                        const isAssignee = task.assigneeId === currentUserId;
                        const isCompleted = task.status === 'COMPLETED';
                        
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-xl border bg-surface shadow-sm ${isCompleted ? 'opacity-70' : ''}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                      {task.title}
                                    </h4>
                                    {task.description && (
                                      <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                                    )}
                                    <div className="flex items-center space-x-2 mt-2">
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {task.assignee?.name?.split(' ')[0]}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {isLeader && (
                                    <button onClick={() => {
                                      if(confirm("Delete task?")) deleteTask(task.id)
                                    }} className="text-muted-foreground hover:text-red-500 transition-colors">
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>

                                {isCompleted && (task.proofText || task.proofFileUrl) && (
                                  <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Proof:</p>
                                    {task.proofText && <p className="text-xs text-foreground italic">&quot;{task.proofText}&quot;</p>}
                                    {task.proofFileUrl && (
                                      <a href={task.proofFileUrl} target="_blank" className="inline-flex items-center text-xs text-primary hover:underline mt-1">
                                        <LinkIcon className="h-3 w-3 mr-1" /> View Attachment
                                      </a>
                                    )}
                                  </div>
                                )}

                                {!isCompleted && isAssignee && completingTaskId !== task.id && col.id === 'IN_REVIEW' && (
                                  <button 
                                    onClick={() => setCompletingTaskId(task.id)}
                                    className="mt-3 w-full rounded bg-primary/10 hover:bg-primary/20 text-primary py-1.5 text-xs font-medium transition-colors"
                                  >
                                    Add Proof
                                  </button>
                                )}

                                {completingTaskId === task.id && (
                                  <div className="mt-3 pt-3 border-t border-border">
                                    <input 
                                      type="text" 
                                      placeholder="Link to work..." 
                                      value={proofText}
                                      onChange={e => setProofText(e.target.value)}
                                      className="w-full text-xs rounded border border-border bg-surface px-2 py-1.5 text-foreground focus:ring-1 focus:ring-primary focus:outline-none mb-2"
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <button onClick={() => setCompletingTaskId(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                                      <button 
                                        disabled={isCompletingTask}
                                        onClick={async () => {
                                          setIsCompletingTask(true)
                                          const fd = new FormData()
                                          fd.append('proofText', proofText)
                                          await completeTask(task.id, fd)
                                          setCompletingTaskId(null)
                                          setProofText('')
                                          setIsCompletingTask(false)
                                        }}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs"
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
