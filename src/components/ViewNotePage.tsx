import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ClipboardCopy, Check } from 'lucide-react'

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(note.content.replace(/<[^>]+>/g, ''))
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => console.error('Failed to copy text: ', err))
  }

  return (
    <div className="px-4 py-12 sm:py-24">
      <main className="mx-auto w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div>
            <Button onClick={onClose} variant="outline" className="mr-2">
              Back
            </Button>
            <Button onClick={onDelete} variant="destructive" className="mr-2">
              Delete
            </Button>
            <Button onClick={handleCopyToClipboard} variant="secondary">
              {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <ClipboardCopy className="w-4 h-4 mr-2" />}
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-semibold">
            {new Date(note.timestamp).toLocaleString()} ({note.duration} min)
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