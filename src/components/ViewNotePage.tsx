import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ClipboardCopy, Check, Trash2, AlertCircle } from 'lucide-react'

interface ViewNotePageProps {
  note: {
    title: string
    content: string
    timestamp: string
    duration: number
  }
  onClose: () => void
  onDelete: () => void
}

export function ViewNotePage({ note, onClose, onDelete }: ViewNotePageProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(note.content.replace(/<[^>]+>/g, ''))
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => console.error('Failed to copy text: ', err))
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <div className="px-4 py-12 sm:py-24">
      {showDeleteConfirm && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Delete this note?</strong>
          <div className="mt-2 flex justify-end space-x-2">
            <Button onClick={confirmDelete} variant="destructive" size="sm">Yes, delete</Button>
            <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" size="sm">Cancel</Button>
          </div>
        </div>
      )}
      <main className="mx-auto w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div className="flex items-center justify-center">
            <Button onClick={onClose} variant="outline" className="mr-2">
              Back
            </Button>
            <Button onClick={handleCopyToClipboard} variant="secondary">
              {copySuccess ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-semibold">
            {new Date(note.timestamp).toLocaleDateString()} ({note.duration} min)
          </p>
        </div>
        <div 
          className="border p-4 rounded-md"
          dangerouslySetInnerHTML={{ __html: note.content }} 
        />
      </main>
    </div>
  )
}