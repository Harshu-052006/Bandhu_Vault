'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, Trash2, Link as LinkIcon, CheckCircle, List, LayoutGrid, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react'
import { createTask, deleteTask, completeTask, updateTaskStatus } from '@/lib/actions/task-actions'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { fadeIn, slideUp, staggerContainer, staggerItem, accordionVariant, badgeVariant } from '@/lib/motion'

const COLUMNS = [
  { id: 'PENDING', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'COMPLETED', title: 'Done' }
];

export default function KanbanBoard({ project, currentUserId, isLeader }: { project: any, currentUserId: string, isLeader: boolean }) {
  const router = useRouter()
  const [tasks, setTasks] = useState(project.tasks || [])
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'PENDING': true,
    'IN_PROGRESS': true,
    'IN_REVIEW': true,
    'COMPLETED': true
  })
  
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    setTasks(project.tasks || [])
  }, [project.tasks])

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskPriority, setTaskPriority] = useState('Medium')
  const [taskStartDate, setTaskStartDate] = useState('')
  const [taskEndDate, setTaskEndDate] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [proofText, setProofText] = useState('')
  const [isCompletingTask, setIsCompletingTask] = useState(false)

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const newTasks = [...tasks];
    const taskIndex = newTasks.findIndex(t => t.id === draggableId);
    if (taskIndex > -1) {
      newTasks[taskIndex] = { ...newTasks[taskIndex], status: newStatus };
      setTasks(newTasks);
      
      try {
        await updateTaskStatus(draggableId, newStatus);
      } catch (error) {
        console.error(error);
        alert("Failed to update task status.");
        router.refresh(); 
      }
    }
  }

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const renderTaskForm = () => (
    <motion.div 
      variants={slideUp} initial="hidden" animate="visible" exit="exit" layout
      className="mb-6 p-4 rounded-xl bg-muted border border-border space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Task Name"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
        />
        <select 
          value={taskAssignee}
          onChange={e => setTaskAssignee(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
        >
          <option value="" disabled>Assign to...</option>
          <option value={project.leaderId}>{project.leader?.name || "Group Leader"}</option>
          {project.members?.map((m: any) => (
            <option key={m.userId} value={m.userId}>{m.user?.name || m.user?.email}</option>
          ))}
        </select>
      </div>
      <textarea 
        placeholder="Description (optional)"
        value={taskDesc}
        onChange={e => setTaskDesc(e.target.value)}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-shadow"
        rows={2}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
          <select 
            value={taskPriority}
            onChange={e => setTaskPriority(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
          <input 
            type="date"
            value={taskStartDate}
            onChange={e => setTaskStartDate(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
          <input 
            type="date"
            value={taskEndDate}
            onChange={e => setTaskEndDate(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-2 border-t border-border">
        <button onClick={() => setShowTaskForm(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
        <button 
          disabled={!taskTitle || !taskAssignee || isCreatingTask}
          onClick={async () => {
            setIsCreatingTask(true)
            try {
              const formData = new FormData()
              formData.append('title', taskTitle)
              formData.append('description', taskDesc)
              formData.append('assigneeId', taskAssignee)
              formData.append('priority', taskPriority)
              if (taskStartDate) formData.append('startDate', taskStartDate)
              if (taskEndDate) formData.append('endDate', taskEndDate)
              await createTask(project.id, formData)
              setTaskTitle('')
              setTaskDesc('')
              setTaskAssignee('')
              setTaskPriority('Medium')
              setTaskStartDate('')
              setTaskEndDate('')
              setShowTaskForm(false)
            } catch (e) {
              console.error(e)
            } finally {
              setIsCreatingTask(false)
            }
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium shadow-sm disabled:opacity-50 transition-colors"
        >
          {isCreatingTask ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </motion.div>
  )

  const renderKanban = () => (
    <motion.div key="kanban" variants={fadeIn} initial="hidden" animate="visible" exit="exit" layout>
      <DragDropContext onDragEnd={onDragEnd}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {COLUMNS.map(col => {
            const columnTasks = tasks.filter((t: any) => (t.status || 'PENDING') === col.id);
            return (
              <motion.div variants={staggerItem} key={col.id} className="flex flex-col bg-muted/30 rounded-xl p-3 min-h-[300px]">
                <h4 className="text-sm font-semibold text-foreground mb-3 px-1">{col.title} <span className="text-muted-foreground text-xs font-normal">({columnTasks.length})</span></h4>
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 space-y-2">
                      <AnimatePresence>
                        {columnTasks.map((task: any, index: number) => {
                          const isAssignee = task.assigneeId === currentUserId;
                          const isCompleted = task.status === 'COMPLETED';
                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <motion.div
                                    layoutId={`task-${task.id}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ 
                                      opacity: isCompleted ? 0.7 : 1, 
                                      scale: snapshot.isDragging ? 1.05 : 1,
                                      boxShadow: snapshot.isDragging 
                                        ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                                        : "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                                    }}
                                    whileHover={!snapshot.isDragging ? { y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" } : {}}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="p-3 rounded-xl border bg-surface"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className={`text-sm font-medium transition-colors ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                        {task.title}
                                      </h4>
                                      {isLeader && (
                                        <button onClick={() => { if(confirm("Delete task?")) deleteTask(task.id) }} className="text-muted-foreground hover:text-destructive transition-colors">
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                    {task.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}
                                    
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex items-center space-x-2">
                                        {task.assignee?.avatarUrl ? (
                                          /* eslint-disable-next-line @next/next/no-img-element */
                                          <img src={task.assignee.avatarUrl} alt={task.assignee.name || "Assignee"} className="h-6 w-6 rounded-full object-cover" title={task.assignee.name || 'Assignee'} />
                                        ) : (
                                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground" title={task.assignee?.name || 'Assignee'}>
                                            {task.assignee?.name?.charAt(0).toUpperCase() || 'A'}
                                          </div>
                                        )}
                                      </div>
                                      <motion.span 
                                        variants={badgeVariant}
                                        initial="hidden"
                                        animate="visible"
                                        layout
                                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                          task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                                          task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                                          'bg-blue-500/10 text-blue-500'
                                        }`}
                                      >
                                        {task.priority || 'Medium'}
                                      </motion.span>
                                    </div>

                                    {isCompleted && (task.proofText || task.proofFileUrl) && (
                                      <div className="mt-3 pt-3 border-t border-border">
                                        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Proof</p>
                                        {task.proofText && <p className="text-xs text-foreground italic">&quot;{task.proofText}&quot;</p>}
                                        {task.proofFileUrl && (
                                          <a href={task.proofFileUrl} target="_blank" className="inline-flex items-center text-xs text-primary hover:underline mt-1 transition-colors">
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
                                        Add Proof & Complete
                                      </button>
                                    )}

                                    <AnimatePresence>
                                      {completingTaskId === task.id && (
                                        <motion.div 
                                          variants={accordionVariant} initial="hidden" animate="visible" exit="exit"
                                          className="mt-3 pt-3 border-t border-border overflow-hidden"
                                        >
                                          <input 
                                            type="text" 
                                            placeholder="Link to work..." 
                                            value={proofText}
                                            onChange={e => setProofText(e.target.value)}
                                            className="w-full text-xs rounded border border-border bg-surface px-2 py-1.5 text-foreground focus:ring-1 focus:ring-primary focus:outline-none mb-2 transition-shadow"
                                          />
                                          <div className="flex justify-end space-x-2">
                                            <button onClick={() => setCompletingTaskId(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
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
                                              className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs transition-colors"
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            )
          })}
        </motion.div>
      </DragDropContext>
    </motion.div>
  )

  const renderList = () => (
    <motion.div key="list" variants={fadeIn} initial="hidden" animate="visible" exit="exit" layout className="mt-6 border border-border rounded-xl bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground">
        <div className="col-span-4">Task Name</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-2">Estimation</div>
        <div className="col-span-1 text-center">People</div>
        <div className="col-span-1 text-center">Priority</div>
        <div className="col-span-1 text-right">Action</div>
      </div>
      
      {COLUMNS.map(col => {
        const columnTasks = tasks.filter((t: any) => (t.status || 'PENDING') === col.id);
        const isExpanded = expandedGroups[col.id];
        
        return (
          <div key={col.id} className="border-b border-border last:border-0">
            <div 
              className="flex items-center gap-2 p-3 bg-muted/10 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => toggleGroup(col.id)}
            >
              <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
              <span className="font-semibold text-sm text-foreground">{col.title}</span>
              <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">{columnTasks.length}</span>
            </div>
            
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div 
                  variants={accordionVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  {columnTasks.length > 0 ? (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="divide-y divide-border">
                      {columnTasks.map((task: any) => (
                        <motion.div variants={staggerItem} layout key={task.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/5 transition-colors group">
                          <div className="col-span-4 flex items-center gap-3">
                            <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${task.status === 'COMPLETED' ? 'bg-primary border-primary' : 'border-muted-foreground/30 bg-transparent'}`}>
                              {task.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className={`text-sm font-medium transition-colors ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </span>
                          </div>
                          
                          <div className="col-span-3">
                            <span className="text-sm text-muted-foreground line-clamp-1">{task.description || '-'}</span>
                          </div>
                          
                          <div className="col-span-2">
                            <span className="text-xs text-muted-foreground">
                              {task.startDate ? format(new Date(task.startDate), 'MMM d, yyyy') : '-'} 
                              {task.endDate ? ` - ${format(new Date(task.endDate), 'MMM d, yyyy')}` : ''}
                            </span>
                          </div>
                          
                          <div className="col-span-1 flex justify-center">
                            {task.assignee?.avatarUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={task.assignee.avatarUrl} alt={task.assignee.name || "Assignee"} className="h-6 w-6 rounded-full object-cover border border-primary/20" title={task.assignee.name || 'Assignee'} />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary border border-primary/20" title={task.assignee?.name || 'Assignee'}>
                                {task.assignee?.name?.charAt(0).toUpperCase() || 'A'}
                              </div>
                            )}
                          </div>
                          
                          <div className="col-span-1 flex justify-center">
                            <motion.span 
                              variants={badgeVariant} initial="hidden" animate="visible" layout
                              className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                                task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                                task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                                'bg-blue-500/10 text-blue-500'
                              }`}
                            >
                              {task.priority || 'Medium'}
                            </motion.span>
                          </div>
                          
                          <div className="col-span-1 flex justify-end">
                            {isLeader && (
                              <button onClick={() => { if(confirm("Delete task?")) deleteTask(task.id) }} className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded transition-all">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            {!isLeader && task.status === 'COMPLETED' && (
                              <button className="p-1 text-muted-foreground transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="p-8 text-center text-sm text-muted-foreground">
                      No tasks in this section.
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
        </div>
      </div>
    </motion.div>
  )

  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-foreground">Project Tasks</h2>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg relative w-fit">
              {[
                { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
                { id: 'list', label: 'List', icon: List }
              ].map((view) => {
                const Icon = view.icon
                const isActive = viewMode === view.id
                return (
                  <button
                    key={view.id}
                    onClick={() => setViewMode(view.id as 'kanban' | 'list')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all relative z-10 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {view.label}
                    {isActive && (
                      <motion.div
                        layoutId="kanbanViewToggle"
                        className="absolute inset-0 bg-background rounded-md shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            
            {isLeader && (
              <button 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shrink-0"
              >
                <Plus className="h-4 w-4" />
                New Task
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showTaskForm && renderTaskForm()}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? renderKanban() : renderList()}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
