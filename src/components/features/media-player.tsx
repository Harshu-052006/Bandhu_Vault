'use client'

import React from 'react'

export default function MediaPlayer({ url, type }: { url: string, type: string }) {
  if (type.startsWith('video/')) {
    return (
      <div className="overflow-hidden rounded-xl bg-black border border-neutral-800">
        <video 
          controls 
          preload="metadata"
          className="w-full h-auto max-h-[500px]"
          src={url}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }
  
  if (type.startsWith('image/')) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Uploaded media" className="max-h-[500px] w-auto object-contain" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
          <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-200">Document File</p>
          <p className="text-xs text-neutral-500">{type}</p>
        </div>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
        Download
      </a>
    </div>
  )
}
