'use client'

import React, { useState, useCallback } from 'react'
import { UploadCloud } from 'lucide-react'
import { saveFileMetadata } from '@/lib/actions/file-actions'
import imageCompression from 'browser-image-compression'

export default function FileUploadZone({ projectId, onUploadSuccess }: { projectId: string, onUploadSuccess: (fileId: string) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true)
    else if (e.type === 'dragleave') setIsDragging(false)
  }, [])

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      setProgress(5)
      
      let finalFile = file;
      // Compress if it's an image
      if (file.type.startsWith('image/')) {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        finalFile = await imageCompression(file, options)
      }
      setProgress(10)
      
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        body: JSON.stringify({
          filename: finalFile.name,
          contentType: finalFile.type,
          projectId
        })
      })
      
      if (!res.ok) throw new Error('Failed to get presigned URL')
      const { presignedUrl, key, fileUrl } = await res.json()
      
      // Use XHR for real-time upload progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', presignedUrl, true)
        xhr.setRequestHeader('Content-Type', finalFile.type)
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            // Reserve last 10% for DB saving
            const percentComplete = 10 + Math.round((e.loaded / e.total) * 80)
            setProgress(percentComplete)
          }
        }
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response)
          else reject(new Error('Failed to upload to R2'))
        }
        
        xhr.onerror = () => reject(new Error('Network Error'))
        xhr.send(finalFile)
      })
      
      setProgress(95)
      
      const dbFile = await saveFileMetadata({
        filename: finalFile.name,
        fileUrl,
        r2Key: key,
        mimeType: finalFile.type,
        fileSize: finalFile.size,
        projectId
      })
      
      setProgress(100)
      onUploadSuccess(dbFile.id)
    } catch (error) {
      console.error(error)
      alert("Failed to upload file")
    } finally {
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 1000)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }, [projectId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  return (
    <div 
      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/30'}`}
    >
      <input type="file" onChange={handleChange} className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0" disabled={uploading} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-neutral-800 p-4">
          <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-indigo-400' : 'text-neutral-400'}`} />
        </div>
        <div>
          <p className="text-lg font-medium text-neutral-200">
            {uploading ? 'Uploading...' : 'Drag & drop a file here'}
          </p>
          <p className="text-sm text-neutral-500">or click to browse from your device</p>
        </div>
        {uploading && (
          <div className="w-full max-w-xs overflow-hidden rounded-full bg-neutral-800 flex items-center relative h-4">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
