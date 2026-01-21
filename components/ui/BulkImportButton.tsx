'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { mapImportRecords, parseImportFile, type ImportModule } from '@/lib/utils/bulk-import'

interface BulkImportButtonProps {
  module: ImportModule
  onComplete?: () => void
  className?: string
  acceptedFileTypes?: string
}

export function BulkImportButton({ module, onComplete, className, acceptedFileTypes }: BulkImportButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

      const formData = new FormData()
      formData.append('type', module)
      formData.append('file', file)
      
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        const successCount = data.results?.length || 0
        const errorCount = data.errors?.length || 0
        const totalRows = data.totalRows || 0
        
        let message = `Import completed!`
        if (successCount > 0) {
          message += `\n✅ Successfully imported: ${successCount} records`
        }
        if (errorCount > 0) {
          message += `\n❌ Failed: ${errorCount} records`
          message += `\n\nErrors:\n${data.errors.map((e: any) => `Row ${e.row}: ${e.error}`).join('\n')}`
        }
        
        alert(message)
        onComplete?.()
      } else {
        throw new Error(data.error || 'Import failed')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import file')
    } finally {
      setLoading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFileTypes || ".csv,.xlsx,.xls,.json"}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={className}
        disabled={loading}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        <span>{loading ? 'Importing...' : 'Bulk Import'}</span>
      </button>
    </>
  )
}
