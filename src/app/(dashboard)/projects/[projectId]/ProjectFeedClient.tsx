'use client'

import React, { useState } from 'react'
import FileUploadZone from '@/components/features/file-upload-zone'
import UpdateCard from '@/components/features/update-card'
import MediaPlayer from '@/components/features/media-player'
import KanbanBoard from '@/components/features/kanban-board'
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
    <div className="flex flex-col space-y-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Project Updates</h2>
            <button 
              onClick={() => setShowPostUpdateForm(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              New Update
            </button>
          </div>

          {showPostUpdateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-2xl relative">
                <button 
                  onClick={() => setShowPostUpdateForm(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <h2 className="text-xl font-bold text-foreground mb-6">Post an Update</h2>
                <form onSubmit={async (e) => {
                  await handleSubmit(e)
                  setShowPostUpdateForm(false)
                }} className="space-y-4">
                  <input 
                    name="title" 
                    placeholder="Update Title" 
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <textarea 
                    name="content" 
                    placeholder="What's new?" 
                    rows={4}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
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

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button 
                      type="button" 
                      onClick={() => setShowUpload(!showUpload)}
                      className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-muted px-4 py-2 rounded-lg"
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Attach Media
                    </button>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex items-center rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
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
              <div className="rounded-2xl border border-dashed border-border bg-surface py-20 text-center">
                <p className="text-muted-foreground">No updates yet. Be the first to post!</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 relative group shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">About Project</h3>
              {isLeader && !isEditingDesc && (
                <button 
                  onClick={() => {
                    setEditDescValue(project.description || "")
                    setIsEditingDesc(true)
                  }}
                  className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
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
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setIsEditingDesc(false)}
                    disabled={isSavingDesc}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSavingDesc ? "Saving..." : <><Check className="h-3 w-3" /> Save</>}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.description || "No description provided."}</p>
            )}
          </div>

          {/* Members Section */}
          {(project.isPrivate || project.members?.length > 0) && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Members
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                      {project.leader?.name ? project.leader.name.charAt(0).toUpperCase() : 'L'}
                    </div>
                    <span className="text-sm text-foreground">{project.leader?.name || project.leader?.email}</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Leader</span>
                </div>
                
                {project.members?.map((member: any) => (
                  <div key={member.userId} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                        {member.user?.name ? member.user.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <span className="text-sm text-muted-foreground">{member.user?.name || member.user?.email}</span>
                    </div>
                    {isLeader && (
                      <button 
                        onClick={async () => {
                          if (confirm(`Remove ${member.user?.name} from project?`)) {
                            await removeProjectMember(project.id, member.userId)
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
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
                }} className="flex space-x-2 mt-4 pt-4 border-t border-border">
                  <input 
                    name="email"
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="Invite by email"
                    required
                    className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={isInviting || !inviteEmail}
                    className="bg-muted text-foreground hover:bg-muted-foreground/10 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50"
                  >
                    {isInviting ? '...' : 'Add'}
                  </button>
                </form>
              )}
            </div>
          )}
          
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Project Files</h3>
              <button 
                onClick={() => setShowProjectFileUpload(!showProjectFileUpload)}
                className="flex items-center justify-center rounded-lg bg-muted p-1.5 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground transition-all"
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
              <p className="text-sm text-muted-foreground">No standalone files uploaded.</p>
            ) : (
              <div className="space-y-3">
                {project.files?.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                    <a href={file.fileUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-3 flex-1 overflow-hidden">
                      <div className="h-8 w-8 shrink-0 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
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
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-2"
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
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">Once you delete a project, there is no going back. Please be certain.</p>
              <button 
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="w-full flex justify-center items-center rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tasks Section (Kanban Board) Full Width */}
      <div className="w-full mt-4 pb-12">
        <KanbanBoard project={project} currentUserId={currentUserId} isLeader={isLeader} />
      </div>
    </div>
  )
}
