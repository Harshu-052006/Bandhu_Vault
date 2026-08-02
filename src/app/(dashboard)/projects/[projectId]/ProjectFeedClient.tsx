'use client'

import React, { useState } from 'react'
import FileUploadZone from '@/components/features/file-upload-zone'
import UpdateCard from '@/components/features/update-card'
import { postUpdate } from '@/lib/actions/project-actions'
import { Paperclip, Send } from 'lucide-react'

export default function ProjectFeedClient({ project }: { project: any }) {
  const [showUpload, setShowUpload] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUploadSuccess = (fileId: string) => {
    setAttachedFiles(prev => [...prev, fileId])
    setShowUpload(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('fileIds', JSON.stringify(attachedFiles))
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
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Post an Update</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              name="title" 
              placeholder="Update Title" 
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <textarea 
              name="content" 
              placeholder="What's new?" 
              rows={4}
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            
            {attachedFiles.length > 0 && (
              <div className="text-sm text-indigo-400 font-medium">
                {attachedFiles.length} file(s) attached
              </div>
            )}

            {showUpload && (
              <div className="mt-4">
                <FileUploadZone projectId={project.id} onUploadSuccess={handleUploadSuccess} />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button 
                type="button" 
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center text-sm font-medium text-neutral-400 hover:text-indigo-400 transition-colors"
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Attach Media
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
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

        <div className="space-y-6 mt-8 w-full">
          {project.updates.map((update: any) => (
            <UpdateCard key={update.id} update={update} />
          ))}
          
          {project.updates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-800 py-20 text-center">
              <p className="text-neutral-500">No updates yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">About Project</h3>
          <p className="text-sm text-neutral-400">{project.description || "No description provided."}</p>
        </div>
        
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Project Files</h3>
          {project.files?.length === 0 ? (
            <p className="text-sm text-neutral-500">No standalone files uploaded.</p>
          ) : (
            <div className="space-y-3">
              {project.files?.map((file: any) => (
                <a key={file.id} href={file.fileUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 hover:bg-neutral-800 rounded-lg transition-colors group">
                  <div className="h-8 w-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-neutral-200 truncate">{file.filename}</p>
                    <p className="text-xs text-neutral-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
