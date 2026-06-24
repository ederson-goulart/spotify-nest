"use client"

import { ChevronLeft, ChevronRight, Bell, User } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-gradient-to-b from-zinc-800/80 to-transparent z-10">
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:scale-105 transition-all">
          Inscrever-se
        </button>
        <button className="px-8 py-3 bg-foreground text-background text-sm font-bold rounded-full hover:scale-105 hover:bg-foreground/90 transition-all">
          Entrar
        </button>
        <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors ml-2">
          <Bell className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <User className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </header>
  )
}
