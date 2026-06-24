"use client"

import { Play } from "lucide-react"
import Image from "next/image"

interface MusicCardProps {
  title: string
  artist?: string
  imageUrl: string
  isRound?: boolean
}

export function MusicCard({ title, artist, imageUrl, isRound = false }: MusicCardProps) {
  return (
    <div className="group p-4 bg-card hover:bg-secondary rounded-md transition-all duration-300 cursor-pointer">
      <div className="relative mb-4">
        <Image
          src={imageUrl}
          alt={title}
          width={160}
          height={160}
          className={`w-full aspect-square object-cover shadow-lg ${
            isRound ? "rounded-full" : "rounded-md"
          }`}
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
          <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-1" />
        </button>
      </div>
      <h3 className="font-bold text-foreground text-sm truncate mb-1">{title}</h3>
      {artist && (
        <p className="text-muted-foreground text-sm truncate">{artist}</p>
      )}
    </div>
  )
}
