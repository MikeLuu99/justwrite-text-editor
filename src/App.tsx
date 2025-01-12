import { useState, useEffect } from 'react'
import { Hero } from './components/custom/hero'
import { Button } from '@/components/ui/button'
import { NewNotePage } from './components/NewNotePage'
import { ViewNotePage } from './components/ViewNotePage'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Trash2 } from 'lucide-react'
// import { MinimalTiptapEditor } from './components/minimal-tiptap'

interface Note {
  title: string // Add this line
  content: string
  timestamp: string
  duration: number
}

export default function App() {
  const [isWritingNote, setIsWritingNote] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [totalTime, setTotalTime] = useState(0)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]')
    // Sort notes by timestamp in descending order (latest first)
    const sortedNotes = savedNotes.sort(
      (a: Note, b: Note) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    setNotes(sortedNotes)

    // Calculate total time
    const total = sortedNotes.reduce((acc: number, note: Note) => acc + note.duration, 0)
    setTotalTime(total)
  }, [isWritingNote])

  const confirmDelete = (index: number) => {
    setDeleteIndex(index)
  }

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updatedNotes = notes.filter((_, i) => i !== deleteIndex)
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
      setDeleteIndex(null)
    }
  }

  if (isWritingNote) {
    return <NewNotePage onClose={() => setIsWritingNote(false)} />
  }

  if (viewingNote) {
    return <ViewNotePage note={viewingNote} onClose={() => setViewingNote(null)} />
  }

  return (
    <TooltipProvider>
      <div className="px-4 py-12 sm:py-24">
        <main className="mx-auto w-full max-w-3xl">
          <Hero />
          <div className="mb-12 mt-36 flex justify-center gap-4 sm:mt-48">
            <Button onClick={() => setIsWritingNote(true)} size="lg">
              + Note
            </Button>
          </div>
          <div className="mt-48 flex flex-col items-center justify-center">
            <div className="w-full">
              <h2 className="mb-4 text-center text-2xl font-bold">Your Notes</h2>
              {notes.length === 0 ? (
                <p className="text-center">No notes yet. Start writing!</p>
              ) : (
                <ul className="space-y-4">
                  {notes.map((note, index) => (
                    <li key={index} className="rounded-md border p-4">
                      {deleteIndex === index ? (
                        <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                          <strong className="font-bold">Delete this note?</strong>
                          <div className="mt-2 flex justify-end space-x-2">
                            <Button onClick={handleDelete} className="dark:text-black" variant="destructive" size="sm">
                              Yes, delete
                            </Button>
                            <Button onClick={() => setDeleteIndex(null)} variant="outline" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : null}
                      <p className="font-semibold">
                        {note.title} - {new Date(note.timestamp).toLocaleDateString()} ({note.duration} min)
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div dangerouslySetInnerHTML={{ __html: note.content.substring(0, 100) + '...' }} />
                        <div className="flex items-center justify-center space-x-2">
                          <Button onClick={() => setViewingNote(note)} variant="outline" size="sm">
                            View
                          </Button>
                          <Button onClick={() => confirmDelete(index)} variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 dark:text-black" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-md mb-8 text-center">
                Total: {totalTime} {totalTime <= 1 ? 'minute' : 'minutes'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
