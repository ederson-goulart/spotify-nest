"use client"

import { MusicCard } from "./music-card"

interface ContentItem {
  title: string
  artist?: string
  imageUrl: string
  isRound?: boolean
}

interface ContentSectionProps {
  title: string
  items: ContentItem[]
  showAll?: boolean
}

export function ContentSection({ title, items, showAll = true }: ContentSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground hover:underline cursor-pointer">
          {title}
        </h2>
        {showAll && (
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            Mostrar tudo
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <MusicCard
            key={index}
            title={item.title}
            artist={item.artist}
            imageUrl={item.imageUrl}
            isRound={item.isRound}
          />
        ))}
      </div>
    </section>
  )
}
