"use client"

import { Header } from "./header"
import { ContentSection } from "./content-section"

const trendingSongs = [
  {
    title: "Delicate Hell",
    artist: "Taylor Swift",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    title: "At Night",
    artist: "Ella Langley",
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
  },
  {
    title: "FACEDOWN",
    artist: "AI Marley",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  },
  {
    title: "Prison of Flesh",
    artist: "Dark Soul",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  },
  {
    title: "So Far So Fake",
    artist: "The Weekend",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    title: "Diet Pepsi",
    artist: "Addison Rae",
    imageUrl: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=300&h=300&fit=crop",
  },
]

const popularArtists = [
  {
    title: "Kendrick Lamar",
    artist: "Artista",
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&h=300&fit=crop",
    isRound: true,
  },
  {
    title: "Drake",
    artist: "Artista",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    isRound: true,
  },
  {
    title: "The Weeknd",
    artist: "Artista",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
    isRound: true,
  },
  {
    title: "Morgan Wallen",
    artist: "Artista",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    isRound: true,
  },
  {
    title: "Post Malone",
    artist: "Artista",
    imageUrl: "https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=300&h=300&fit=crop",
    isRound: true,
  },
  {
    title: "Taylor Swift",
    artist: "Artista",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    isRound: true,
  },
]

const popularAlbums = [
  {
    title: "I'm The Problem",
    artist: "Morgan Wallen",
    imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
  },
  {
    title: "DeBÍ TiRAR MáS FOToS",
    artist: "Bad Bunny",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
  },
  {
    title: "HIT ME HARD AND SOFT",
    artist: "Billie Eilish",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
  },
  {
    title: "GNX",
    artist: "Kendrick Lamar",
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
  },
  {
    title: "$ome $exy $ongs 4 U",
    artist: "Drake",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop",
  },
  {
    title: "Short n' Sweet",
    artist: "Sabrina Carpenter",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
]

const popularRadio = [
  {
    title: "Morgan Wallen Radio",
    artist: "Country • Pop",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
  {
    title: "Zach Bryan Radio",
    artist: "Country • Folk",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    title: "Drake Radio",
    artist: "Hip-Hop • R&B",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    title: "Taylor Swift Radio",
    artist: "Pop • Country",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  },
  {
    title: "SZA Radio",
    artist: "R&B • Soul",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
  },
  {
    title: "Bad Bunny Radio",
    artist: "Reggaeton • Latin",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
  },
]

const featuredCharts = [
  {
    title: "Top Songs - Global",
    artist: "As músicas mais tocadas agora",
    imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
  },
  {
    title: "Top Songs - Brasil",
    artist: "As músicas mais tocadas no Brasil",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
  },
  {
    title: "Viral 50 - Global",
    artist: "O que está em alta agora",
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
  },
  {
    title: "Today's Top Hits",
    artist: "As melhores de hoje",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
  },
  {
    title: "RapCaviar",
    artist: "O melhor do hip-hop",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop",
  },
  {
    title: "Hot Country",
    artist: "O melhor do country",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
]

export function MainContent() {
  return (
    <main className="flex-1 bg-gradient-to-b from-zinc-800 to-card rounded-lg overflow-y-auto">
      <Header />
      <div className="px-6 pb-8">
        <ContentSection title="Músicas em alta" items={trendingSongs} />
        <ContentSection title="Artistas populares" items={popularArtists} />
        <ContentSection title="Álbuns e singles populares" items={popularAlbums} />
        <ContentSection title="Rádios populares" items={popularRadio} />
        <ContentSection title="Paradas em destaque" items={featuredCharts} />
      </div>
    </main>
  )
}
