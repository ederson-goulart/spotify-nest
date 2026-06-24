import { Track } from "../../../../../generated/prisma";

export interface TrackList {
  tracks: (Track & { band: { name: string } })[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}
