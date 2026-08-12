'use client'

import React, { useState } from 'react'
import FileUploadZone from '@/components/features/file-upload-zone'
import UpdateCard from '@/components/features/update-card'
import MediaPlayer from '@/components/features/media-player'
import { postUpdate, updateProjectDescription, deleteProject } from '@/lib/actions/project-actions'
import { deleteFile } from '@/lib/actions/file-actions'
import { addProjectMember, removeProjectMember } from '@/lib/actions/member-actions'
import { createTask, completeTask, deleteTask } from '@/lib/actions/task-actions'
import { useRouter } from 'next/navigation'
import { Paperclip, Send, Plus, X, Edit2, Check, Trash2, Users, CheckCircle, Link as LinkIcon, UserMinus } from 'lucide-react'

export default function ProjectFeedClient({ project, currentUserId }: { project: any, currentUserId: string }) {
  const isLeader = project.leaderId === currentUserId

  const [showUpload, setShowUpload] = useState(false)
  const [showProjectFileUpload, setShowProjectFileUpload] = useState(false)
  const [showPostUpdateForm, setShowPostUpdateForm] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [editDescValue, setEditDescValue] = useState(project.description || "")
  const [isSavingDesc, setIsSavingDesc] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Members state
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

  // Tasks state
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [proofText, setProofText] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [isCompletingTask, setIsCompletingTask] = useState(false)

  const handleDeleteProject = async () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteProject(project.id)
        router.push('/projects')
      } catch (e) {
        console.error(e)
        alert("Failed to delete project")
        setIsDeleting(false)
      }
    }
  }

  const handleUploadSuccess = (file: any) => {
    setAttachedFiles(prev => [...prev, file])
    setShowUpload(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('fileIds', JSON.stringify(attachedFiles.map(f => f.id)))
      await postUpdate(project.id, formData)
      e.currentTarget.reset()
      setAttachedFiles([])
    } catch (error) {
      console.error(error)
      alert("Failed to post update")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-2 space-y-6">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Project Updates</h2>
          <button 
            onClick={() => setShowPostUpdateForm(true)}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            New Update
          </button>
        </div>

        {showPostUpdateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowPostUpdateForm(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6">Post an Update</h2>
              <form onSubmit={async (e) => {
                await handleSubmit(e)
                setShowPostUpdateForm(false)
              }} className="space-y-4">
                <input 
                  name="title" 
                  placeholder="Update Title" 
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <textarea 
                  name="content" 
                  placeholder="What's new?" 
                  rows={4}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
                
                {attachedFiles.length > 0 && (
                  <div className="space-y-4">
                    {attachedFiles.map((file) => (
                      <MediaPlayer key={file.id} url={file.fileUrl} type={file.mimeType} />
                    ))}
                  </div>
                )}

                {showUpload && (
                  <div className="mt-4">
                    <FileUploadZone projectId={project.id} onUploadSuccess={handleUploadSuccess} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <button 
                    type="button" 
                    onClick={() => setShowUpload(!showUpload)}
                    className="flex items-center text-sm font-medium text-neutral-400 hover:text-indigo-400 transition-colors bg-neutral-800 px-4 py-2 rounded-lg"
                  >
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach Media
                  </button>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-6 mt-8 w-full">
          {project.updates.map((update: any) => (
            <UpdateCard key={update.id} update={update} currentUserId={currentUserId} isLeader={isLeader} />
          ))}
          
          {project.updates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-800 py-20 text-center">
              <p className="text-neutral-500">No updates yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 relative group">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">About Project</h3>
            {isLeader && !isEditingDesc && (
              <button 
                onClick={() => {
                  setEditDescValue(project.description || "")
                  setIsEditingDesc(true)
                }}
                className="text-neutral-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {isEditingDesc ? (
            <div className="space-y-3 mt-3">
              <textarea 
                value={editDescValue}
                onChange={(e) => setEditDescValue(e.target.value)}
                placeholder="Add a project description..." 
                rows={3}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsEditingDesc(false)}
                  disabled={isSavingDesc}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    setIsSavingDesc(true)
                    try {
                      await updateProjectDescription(project.id, editDescValue)
                      setIsEditingDesc(false)
                    } catch (e) {
                      console.error(e)
                      alert("Failed to update description")
                    } finally {
                      setIsSavingDesc(false)
                    }
                  }}
                  disabled={isSavingDesc}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSavingDesc ? "Saving..." : <><Check className="h-3 w-3" /> Save</>}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400 whitespace-pre-wrap">{project.description || "No description provided."}</p>
          )}
        </div>

        {/* Members Section */}
        {(project.isPrivate || project.members?.length > 0) && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2 text-indigo-400" />
              Members
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                    {project.leader?.name ? project.leader.name.charAt(0).toUpperCase() : 'L'}
                  </div>
                  <span className="text-sm text-neutral-200">{project.leader?.name || project.leader?.email}</span>
                </div>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">Leader</span>
              </div>
              
              {project.members?.map((member: any) => (
                <div key={member.userId} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs">
                      {member.user?.name ? member.user.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <span className="text-sm text-neutral-400">{member.user?.name || member.user?.email}</span>
                  </div>
                  {isLeader && (
                    <button 
                      onClick={async () => {
                        if (confirm(`Remove ${member.user?.name} from project?`)) {
                          await removeProjectMember(project.id, member.userId)
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-opacity"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isLeader && project.isPrivate && (
              <form action={async (formData) => {
                setIsInviting(true)
                try {
                  await addProjectMember(project.id, formData)
                  setInviteEmail('')
                } catch (e: any) {
                  alert(e.message || "Failed to add member")
                } finally {
                  setIsInviting(false)
                }
              }} className="flex space-x-2 mt-4 pt-4 border-t border-neutral-800">
                <input 
                  name="email"
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="Invite by email"
                  required
                  className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={isInviting || !inviteEmail}
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {isInviting ? '...' : 'Add'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tasks Section */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-indigo-400" />
              Tasks
            </h3>
            {isLeader && (
              <button 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="rounded-lg bg-neutral-800 p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
                title="Assign Task"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          {showTaskForm && (
            <div className="mb-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <input 
                placeholder="Task Title"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none"
              />
              <textarea 
                placeholder="Description (optional)"
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
                className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none resize-none"
                rows={2}
              />
              <select 
                value={taskAssignee}
                onChange={e => setTaskAssignee(e.target.value)}
                className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="" disabled>Assign to...</option>
                {/* Leader can assign to themselves or members */}
                <option value={project.leaderId}>{project.leader?.name || "Group Leader"}</option>
                {project.members?.map((m: any) => (
                  <option key={m.userId} value={m.userId}>{m.user?.name || m.user?.email}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowTaskForm(false)} className="text-xs text-neutral-500 hover:text-white">Cancel</button>
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
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50"
                >
                  Assign Task
                </button>
              </div>
            </div>
          )}

          {project.tasks?.length === 0 ? (
            <p className="text-sm text-neutral-500">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {project.tasks?.map((task: any) => {
                const isAssignee = task.assigneeId === currentUserId;
                const isCompleted = task.status === 'COMPLETED';
                
                return (
                  <div key={task.id} className={`p-3 rounded-xl border ${isCompleted ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-neutral-950 border-neutral-800'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-sm font-medium ${isCompleted ? 'text-indigo-200 line-through' : 'text-neutral-200'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-neutral-500 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
                            {task.assignee?.name?.split(' ')[0]}
                          </span>
                          {isCompleted && <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Completed</span>}
                        </div>
                      </div>
                      
                      {isLeader && (
                        <button onClick={() => {
                          if(confirm("Delete task?")) deleteTask(task.id)
                        }} className="text-neutral-600 hover:text-red-400">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {isCompleted && (task.proofText || task.proofFileUrl) && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/50">
                        <p className="text-xs text-neutral-500 mb-1">Proof of completion:</p>
                        {task.proofText && <p className="text-xs text-neutral-300 italic">"{task.proofText}"</p>}
                        {task.proofFileUrl && (
                          <a href={task.proofFileUrl} target="_blank" className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 mt-1">
                            <LinkIcon className="h-3 w-3 mr-1" /> View Attachment
                          </a>
                        )}
                      </div>
                    )}

                    {!isCompleted && isAssignee && completingTaskId !== task.id && (
                      <button 
                        onClick={() => setCompletingTaskId(task.id)}
                        className="mt-3 w-full rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 py-1.5 text-xs font-medium transition-colors"
                      >
                        Complete Task
                      </button>
                    )}

                    {completingTaskId === task.id && (
                      <div className="mt-3 pt-3 border-t border-neutral-800">
                        <p className="text-xs text-neutral-400 mb-2">Provide proof of completion:</p>
                        <input 
                          type="text" 
                          placeholder="Link to work or brief note..." 
                          value={proofText}
                          onChange={e => setProofText(e.target.value)}
                          className="w-full text-xs rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-white focus:border-indigo-500 focus:outline-none mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => setCompletingTaskId(null)} className="text-xs text-neutral-500">Cancel</button>
                          <button 
                            disabled={isCompletingTask}
                            onClick={async () => {
                              setIsCompletingTask(true)
                              const fd = new FormData()
                              fd.append('proofText', proofText)
                              // proofFileUrl omitted for brevity, but could hook into FileUploadZone
                              await completeTask(task.id, fd)
                              setCompletingTaskId(null)
                              setProofText('')
                              setIsCompletingTask(false)
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Project Files</h3>
            <button 
              onClick={() => setShowProjectFileUpload(!showProjectFileUpload)}
              className="flex items-center justify-center rounded-lg bg-neutral-800 p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
              title="Upload Project File"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {showProjectFileUpload && (
            <div className="mb-4">
              <FileUploadZone 
                projectId={project.id} 
                onUploadSuccess={() => {
                  setShowProjectFileUpload(false)
                  router.refresh()
                }} 
              />
            </div>
          )}

          {project.files?.length === 0 ? (
            <p className="text-sm text-neutral-500">No standalone files uploaded.</p>
          ) : (
            <div className="space-y-3">
              {project.files?.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded-lg transition-colors group">
                  <a href={file.fileUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-3 flex-1 overflow-hidden">
                    <div className="h-8 w-8 shrink-0 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Paperclip className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">{file.filename}</p>
                      <p className="text-xs text-neutral-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </a>
                  {(isLeader || file.uploaderId === currentUserId) && (
                    <button 
                      onClick={async (e) => {
                        e.preventDefault()
                        if (confirm("Are you sure you want to delete this file?")) {
                          try {
                            await deleteFile(file.id)
                            router.refresh()
                          } catch (err) {
                            alert("Failed to delete file")
                          }
                        }
                      }}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-2"
                      title="Delete File"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {isLeader && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
            <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
            <p className="text-sm text-neutral-400 mb-4">Once you delete a project, there is no going back. Please be certain.</p>
            <button 
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="w-full flex justify-center items-center rounded-xl bg-red-600/10 border border-red-900/50 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
