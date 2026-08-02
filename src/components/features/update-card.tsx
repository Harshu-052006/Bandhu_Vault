'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import MediaPlayer from './media-player'
import { MessageSquare } from 'lucide-react'
import { postComment } from '@/lib/actions/project-actions'

export default function UpdateCard({ update }: { update: any }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/50 shadow-xl backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-500/20 ring-1 ring-indigo-500/30 flex items-center justify-center text-indigo-400 font-medium">
              {update.author?.email ? update.author.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-200">{update.author?.email || 'Team Member'}</p>
              <p className="text-xs text-neutral-500">{formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">{update.title}</h3>
        <p className="text-neutral-300 whitespace-pre-wrap mb-6">{update.content}</p>
        
        {update.files && update.files.length > 0 && (
          <div className="space-y-4 mb-6">
            {update.files.map((file: any) => (
              <MediaPlayer key={file.id} url={file.fileUrl} type={file.mimeType} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-800 bg-neutral-900/30 p-6">
        <div className="mb-4 flex items-center space-x-2 text-sm font-medium text-neutral-400">
          <MessageSquare className="h-4 w-4" />
          <span>{update.comments?.length || 0} Comments</span>
        </div>
        
        <div className="space-y-4 mb-6">
          {update.comments?.map((comment: any) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
                {comment.author?.email ? comment.author.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-none bg-neutral-800/50 px-4 py-3">
                <p className="text-xs font-medium text-neutral-400 mb-1">{comment.author?.email || 'Team Member'}</p>
                <p className="text-sm text-neutral-200">{comment.text}</p>
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
            className="flex h-10 w-full rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500">
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
