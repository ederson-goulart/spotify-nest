"use client";

import Button from "@/app/components/Button";
import List from "./List";
import Create from "./Create";
import { useEffect, useState } from "react";
import { TrackList } from "../types/common";
import { fetchTracksAction } from "../actions/fetchTracksAction";

export default function Manage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [data, setData] = useState<TrackList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchTracks = async (page: number = 1) => {
    try {
      setData(null);
      setLoading(true);
      const trackList: TrackList = await fetchTracksAction(page);
      setData(trackList);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks(currentPage);
  }, [currentPage]);

  return (
    <section className="overflow-x-auto p-4">
      <header className="flex justify-end mb-4">
        <Button onClick={() => setIsOpen(true)}>Adicionar</Button>
      </header>
      <List
        data={data}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSuccess={() => fetchTracks()}
      ></List>
      {isOpen && (
        <Create
          setIsOpen={setIsOpen}
          onSuccess={() => fetchTracks()}
          setCurrentPage={setCurrentPage}
        ></Create>
      )}
    </section>
  );
}
