'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import MediaPlayer from './media-player'
import { MessageSquare, Trash2 } from 'lucide-react'
import { postComment, deleteUpdate } from '@/lib/actions/project-actions'

export default function UpdateCard({ update, currentUserId, isLeader }: { update: any, currentUserId?: string, isLeader?: boolean }) {
  const canDelete = isLeader || (currentUserId && update.authorId === currentUserId)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-md backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {update.author?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={update.author.avatarUrl} alt={update.author.name || "User"} className="h-10 w-10 rounded-full object-cover ring-1 ring-primary/20" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-primary font-medium">
                {update.author?.name ? update.author.name.charAt(0).toUpperCase() : update.author?.email ? update.author.email.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">{update.author?.name || update.author?.email || 'Team Member'}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
          {canDelete && (
            <button
              onClick={async () => {
                if(confirm("Are you sure you want to delete this update?")) {
                  try {
                    await deleteUpdate(update.id)
                  } catch (e) {
                    alert("Failed to delete update")
                  }
                }
              }}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Delete Update"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">{update.title}</h3>
        <p className="text-muted-foreground whitespace-pre-wrap mb-6">{update.content}</p>
        
        {update.files && update.files.length > 0 && (
          <div className="space-y-4 mb-6">
            {update.files.map((file: any) => (
              <MediaPlayer key={file.id} url={file.fileUrl} type={file.mimeType} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-muted/30 p-6">
        <div className="mb-4 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{update.comments?.length || 0} Comments</span>
        </div>
        
        <div className="space-y-4 mb-6">
          {update.comments?.map((comment: any) => (
            <div key={comment.id} className="flex space-x-3">
              {comment.author?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={comment.author.avatarUrl} alt={comment.author.name || "User"} className="h-8 w-8 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : comment.author?.email ? comment.author.email.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex-1 rounded-2xl rounded-tl-none bg-muted/50 px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">{comment.author?.name || comment.author?.email || 'Team Member'}</p>
                <p className="text-sm text-foreground">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form action={async (formData) => {
          await postComment(update.id, formData)
          const form = document.getElementById(`comment-form-${update.id}`) as HTMLFormElement
          if(form) form.reset()
        }} id={`comment-form-${update.id}`} className="flex space-x-3">
          <input 
            type="text" 
            name="text" 
            placeholder="Write a comment..." 
            required
            className="flex h-10 w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
