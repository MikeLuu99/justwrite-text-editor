import React from 'react'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function Hero() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <React.Fragment>
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
        <a href="https://github.com/Aslam97/shadcn-tiptap" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="icon" aria-label="View on GitHub">
            <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </a>
      </div>
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight">Just Write</h1>
        <p className="mb-6 text-xl">You lose all your writings if you leave the editor. Stay locked in</p>
      </div>
    </React.Fragment>
  )
}