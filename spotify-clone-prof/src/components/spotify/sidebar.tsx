"use client"

import { Home, Search, Library, Plus, Heart, Download } from "lucide-react"
import { SpotifyLogo } from "./spotify-logo"

const playlists = [
  { name: "Músicas Curtidas", type: "Playlist", icon: "heart" },
  { name: "Rock Classics", type: "Playlist" },
  { name: "Chill Vibes", type: "Playlist" },
  { name: "Workout Mix", type: "Playlist" },
  { name: "Lo-Fi Beats", type: "Playlist" },
  { name: "Top Brasil", type: "Playlist" },
]

export function Sidebar() {
  return (
    <aside className="w-[280px] flex flex-col gap-2 h-full shrink-0">
      {/* Logo and Navigation */}
      <div className="bg-card rounded-lg p-4">
        <div className="mb-6 px-2">
          <SpotifyLogo />
        </div>
        <nav className="flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center gap-4 px-2 py-2 text-foreground font-bold hover:text-foreground transition-colors"
          >
            <Home className="w-6 h-6" />
            <span>Início</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-6 h-6" />
            <span>Buscar</span>
          </a>
        </nav>
      </div>

      {/* Library */}
      <div className="bg-card rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <Library className="w-6 h-6" />
            <span className="font-semibold">Sua Biblioteca</span>
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Library Filters */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1.5 bg-secondary text-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors">
            Playlists
          </button>
          <button className="px-3 py-1.5 bg-secondary text-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors">
            Artistas
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center justify-between mb-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Recentes
          </button>
        </div>

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {playlists.map((playlist, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors text-left"
            >
              <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${
                playlist.icon === "heart" 
                  ? "bg-gradient-to-br from-indigo-800 to-zinc-400" 
                  : "bg-secondary"
              }`}>
                {playlist.icon === "heart" ? (
                  <Heart className="w-5 h-5 text-foreground fill-foreground" />
                ) : (
                  <span className="text-2xl">🎵</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-foreground text-sm font-medium truncate">
                  {playlist.name}
                </p>
                <p className="text-muted-foreground text-xs">{playlist.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Install App */}
      <div className="px-4 py-2">
        <a
          href="#"
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <Download className="w-5 h-5" />
          <span>Instalar aplicativo</span>
        </a>
      </div>
    </aside>
  )
}
