import React, { useState, useEffect } from 'react'
import { MinimalTiptapEditor } from './minimal-tiptap'
import { Button } from '@/components/ui/button'
import { ClipboardCopy, Moon, Sun } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NewNotePageProps {
  onClose: () => void
}

export function NewNotePage({ onClose }: NewNotePageProps) {
  const [title, setTitle] = useState('Untitled Note')
  const [value, setValue] = useState('')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isTimerRunning && timeLeft !== null) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime !== null && prevTime <= 1) {
            clearInterval(timer!);
            saveNote();
            return null;
          }
          return prevTime !== null ? prevTime - 1 : null;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onClose()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onClose])

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsTimerRunning(true);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const saveNote = () => {
    if (value.trim() === '') {
      console.log("Cannot save an empty note.")
      onClose()
      return
    }

    const notes = JSON.parse(localStorage.getItem('notes') || '[]')
    notes.push({
      title: title,
      content: value,
      timestamp: new Date().toISOString(),
      duration: timeLeft !== null ? Math.ceil((timeLeft / 60)) : 0
    })
    localStorage.setItem('notes', JSON.stringify(notes))
    console.log("Note saved successfully.")
    onClose()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      console.log("Content copied to clipboard.")
    }).catch((err) => {
      console.error('Failed to copy text: ', err)
    })
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="relative min-h-screen px-4 py-12 sm:py-24">
      <Button 
        onClick={toggleTheme} 
        variant="outline" 
        size="icon"
        className="absolute top-4 right-4 z-10"
      >
        {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      
      <main className="mx-auto w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold w-1/2"
          />
          <div className="flex items-center gap-4">
            {!isTimerRunning ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={() => startTimer(1)} variant="outline">1 min</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Saved when timer ends</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={() => startTimer(15)} variant="outline">15 min</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Great Focus</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={() => startTimer(60)} variant="outline">60 min</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Different Breed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <span className="text-lg font-semibold">{timeLeft !== null ? formatTime(timeLeft) : 'Time\'s up!'}</span>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={copyToClipboard} variant="outline" size="icon">
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coward</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Giving up already?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <MinimalTiptapEditor
          value={value}
          onChange={setValue}
          throttleDelay={2000}
          className="w-full"
          editorContentClassName="p-5"
          output="html"
          placeholder="Start writing your note..."
          autofocus={true}
          immediatelyRender={true}
          editable={true}
          injectCSS={true}
          editorClassName="focus:outline-none"
        />
      </main>
    </div>
  )
}