import { Sidebar } from "@/components/spotify/sidebar";
import { MainContent } from "@/components/spotify/main-content";
import { Player } from "@/components/spotify/player";

export default function SpotifyHomePage() {
  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      <div className="flex flex-1 gap-2 p-2 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <Player />
    </div>
  );
}
