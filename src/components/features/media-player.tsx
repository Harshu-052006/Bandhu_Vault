'use client'

import React, { useState } from 'react'
import { Download, X } from 'lucide-react'

export default function MediaPlayer({ url, type }: { url: string, type: string }) {
  const [isOpen, setIsOpen] = useState(false)

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
      <>
        <div className="relative group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={url} 
            alt="Uploaded media" 
            className="max-h-[500px] w-auto object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105" 
            onClick={() => setIsOpen(true)}
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={url} download target="_blank" rel="noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-black/70 text-white hover:bg-black backdrop-blur-md" title="Download Image">
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md" onClick={() => setIsOpen(false)}>
            <div className="absolute top-6 right-6 flex gap-6">
              <a href={url} download target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors" onClick={e => e.stopPropagation()} title="Download">
                <Download className="h-8 w-8" />
              </a>
              <button className="text-neutral-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)} title="Close">
                <X className="h-8 w-8" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Full screen media" className="max-h-[90vh] max-w-[95vw] object-contain cursor-default" onClick={e => e.stopPropagation()} />
          </div>
        )}
      </>
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
