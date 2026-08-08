'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Eye, Code, Copy, Maximize2, Minimize2, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// @ts-ignore
import html2pdf from 'html2pdf.js'
import { saveAs } from 'file-saver'

interface MarkdownViewerProps {
  url: string
  filename?: string
}

export default function MarkdownViewer({ url, filename = "Document.md" }: MarkdownViewerProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'visual' | 'source'>('visual')
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(url)
        const text = await res.text()
        setContent(text)
      } catch (err) {
        console.error('Failed to fetch markdown content', err)
        setContent('Error loading content.')
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [url])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
  }

  const exportPDF = () => {
    if (!contentRef.current) return
    const opt = {
      margin:       10,
      filename:     `${filename.replace('.md', '')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    }
    html2pdf().set(opt).from(contentRef.current).save()
  }

  const exportWord = () => {
    if (!contentRef.current) return
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${filename}</title></head>
      <body>${contentRef.current.innerHTML}</body>
      </html>
    `
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    })
    saveAs(blob, `${filename.replace('.md', '')}.doc`)
  }

  const wrapperClass = isExpanded 
    ? "fixed inset-0 z-50 flex flex-col bg-neutral-950 p-4 overflow-hidden" 
    : "relative flex flex-col rounded-xl border border-neutral-800 bg-neutral-950/50 overflow-hidden w-full"

  return (
    <div className={wrapperClass}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-neutral-900/50 px-4 py-2 gap-2">
        <div className="flex items-center space-x-2 text-sm font-medium text-neutral-200">
          <FileText className="h-4 w-4 text-indigo-400" />
          <span className="truncate max-w-[200px]">{filename}</span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* View Toggles */}
          <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800 mr-2">
            <button 
              onClick={() => setViewMode('visual')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'visual' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
              title="Visualized"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('source')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'source' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
              title="Source Code"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>

          <button onClick={handleCopy} className="flex items-center space-x-1 rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <Copy className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          
          <div className="flex border-l border-neutral-800 pl-2 space-x-1">
             <button onClick={exportPDF} className="px-2 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Download PDF">PDF</button>
             <button onClick={exportWord} className="px-2 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Download Word">Word</button>
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors ml-2">
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`overflow-auto p-6 ${isExpanded ? 'flex-1' : 'max-h-[500px]'}`}>
        {loading ? (
          <div className="flex h-32 items-center justify-center text-sm text-neutral-500">Loading content...</div>
        ) : (
          viewMode === 'source' ? (
            <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-mono p-4 bg-neutral-900 rounded-lg overflow-x-auto">
              {content}
            </pre>
          ) : (
            <div ref={contentRef} className="prose prose-invert prose-indigo max-w-none prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
    </div>
  )
}
