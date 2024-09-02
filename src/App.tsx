import { useState, useEffect } from 'react'
import { Hero } from './components/custom/hero'
import { Button } from '@/components/ui/button'
import { NewNotePage } from './components/NewNotePage'
import { ViewNotePage } from './components/ViewNotePage'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Trash2 } from 'lucide-react'
// import { MinimalTiptapEditor } from './components/minimal-tiptap'

interface Note {
  title: string  // Add this line
  content: string
  timestamp: string
  duration: number
}


export default function App() {
  const [isWritingNote, setIsWritingNote] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]')
    setNotes(savedNotes)

    // Calculate total time
    const total = savedNotes.reduce((acc: number, note: Note) => acc + note.duration, 0)
    setTotalTime(total)
  }, [isWritingNote])

  const deleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index)
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  if (isWritingNote) {
    return <NewNotePage onClose={() => setIsWritingNote(false)} />
  }

  if (viewingNote) {
    return (
      <ViewNotePage
        note={viewingNote}
        onClose={() => setViewingNote(null)}
        onDelete={() => {
          const index = notes.findIndex(n => n.timestamp === viewingNote.timestamp)
          deleteNote(index)
          setViewingNote(null)
        }}
      />
    )
  }

  return (
    <TooltipProvider>
      <div className="px-4 py-12 sm:py-24">
        <main className="mx-auto w-full max-w-3xl">
          <Hero />
          <div className="mt-36 flex justify-center gap-4 sm:mt-48 mb-12">
            <Button onClick={() => setIsWritingNote(true)} size="lg">
              + Note
            </Button>
          </div>
          <div className="mt-48 flex flex-col justify-center items-center">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">Your Notes</h2>
              {notes.length === 0 ? (
                <p className="text-center">No notes yet. Start writing!</p>
              ) : (
                <ul className="space-y-4">
                  {notes.map((note, index) => (
                    <li key={index} className="border p-4 rounded-md">
                      <p className="font-semibold">
                        {note.title} - {new Date(note.timestamp).toLocaleString()} ({note.duration} min)
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <div dangerouslySetInnerHTML={{ __html: note.content.substring(0, 100) + '...' }} />
                        <div className="space-x-2">
                          <Button onClick={() => setViewingNote(note)} variant="outline" size="sm">
                            View
                          </Button>
                          <Button onClick={() => deleteNote(index)} variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-center text-md mb-8">Total: {totalTime} {totalTime <= 1 ? 'minute' : 'minutes'}</p>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
