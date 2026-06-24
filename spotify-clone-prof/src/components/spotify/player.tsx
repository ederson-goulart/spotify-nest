"use client"

import {
  Play,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Maximize2,
  ListMusic,
  Mic2,
  Monitor,
  Heart,
} from "lucide-react"
import Image from "next/image"

export function Player() {
  return (
    <footer className="h-[90px] bg-black border-t border-border px-4 flex items-center justify-between">
      {/* Now Playing */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <Image
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=56&h=56&fit=crop"
          alt="Album art"
          width={56}
          height={56}
          className="w-14 h-14 rounded"
        />
        <div className="min-w-0">
          <p className="text-sm text-foreground truncate hover:underline cursor-pointer">
            Delicate Hell
          </p>
          <p className="text-xs text-muted-foreground truncate hover:underline cursor-pointer">
            Taylor Swift
          </p>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="w-4 h-4 text-background fill-background ml-0.5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10 text-right">0:00</span>
          <div className="flex-1 h-1 bg-secondary rounded-full group cursor-pointer">
            <div className="w-1/3 h-full bg-muted-foreground rounded-full group-hover:bg-primary relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground w-10">3:52</span>
        </div>
      </div>

      {/* Volume & Other Controls */}
      <div className="flex items-center gap-3 w-[30%] justify-end">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Monitor className="w-4 h-4" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <div className="w-24 h-1 bg-secondary rounded-full group cursor-pointer">
            <div className="w-2/3 h-full bg-muted-foreground rounded-full group-hover:bg-primary relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  )
}
