import { Button } from '@/components/ui/button'

interface ViewNotePageProps {
  note: {
    title: string
    content: string
    timestamp: string
    duration: number
  }
  onClose: () => void
  onDelete: () => void  // Add this line
}

export function ViewNotePage({ note, onClose, onDelete }: ViewNotePageProps) {
  return (
    <div className="px-4 py-12 sm:py-24">
      <main className="mx-auto w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div>
            <Button onClick={onClose} variant="outline" className="mr-2">
              Back
            </Button>
            <Button onClick={onDelete} variant="destructive">
              Delete
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