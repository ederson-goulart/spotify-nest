"use client";

import Button from "@/app/components/Button";
import { Track } from "../../../../../generated/prisma";
import Loading from "@/app/components/Loading";
import Pagination from "./Pagination";
import { TrackList } from "../types/common";
import { useState } from "react";
import Edit from "./Edit";
import Remove from "./Remove";

interface Props {
  data: TrackList | null;
  loading: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
}

export default function List({
  data,
  loading,
  currentPage,
  setCurrentPage,
  onSuccess,
}: Props) {
  const [trackToEdit, setTrackToEdit] = useState<
    (Track & { band: { name: string } }) | null
  >(null);
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);

  const [trackToRemove, setTrackToRemove] = useState<
    (Track & { band: { name: string } }) | null
  >(null);
  const [removeIsOpen, setRemoveIsOpen] = useState<boolean>(false);

  const handleEditClick = (track: Track & { band: { name: string } }) => {
    setTrackToEdit(track);
    setEditIsOpen(true);
  };

  const handleRemoveClick = (track: Track & { band: { name: string } }) => {
    setTrackToRemove(track);
    setRemoveIsOpen(true);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const TableRow = ({
    track,
  }: {
    track: Track & { band: { name: string } };
  }) => {
    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
          {track.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
          {track.band.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
          {formatDuration(track.durationInSeconds)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
          {new Date(track.createdAt).toLocaleDateString("pt-BR")}
        </td>
        <td className="text-right font-sm space-x-4 whitespace-nowrap">
          <Button onClick={() => handleEditClick(track)}>Editar</Button>
          <Button onClick={() => handleRemoveClick(track)}>Excluir</Button>
        </td>
      </tr>
    );
  };

  return (
    <>
      <table className="min-w-full border border-gray-200 rounded-sm overflow-hidden">
        <thead className="bg-gray-800 text-gray-50 uppercase text-left text-sm">
          <tr>
            <th scope="col" className="px-6 py-3">
              Título
            </th>
            <th scope="col" className="px-6 py-3">
              Banda
            </th>
            <th scope="col" className="px-6 py-3">
              Duração
            </th>
            <th scope="col" className="px-6 py-3">
              Data de Criação
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(data?.tracks) && data.tracks.length > 0 ? (
            data.tracks.map((track) => (
              <TableRow key={track.id} track={track} />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                {loading ? <Loading /> : "Nenhum registro encontrado"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data?.pagination.totalPages && data.pagination.totalPages > 1 && (
        <Pagination
          totalPages={data.pagination.totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></Pagination>
      )}

      {editIsOpen && trackToEdit && (
        <Edit
          track={trackToEdit}
          setIsOpen={setEditIsOpen}
          onSuccess={onSuccess}
          setCurrentPage={setCurrentPage}
        ></Edit>
      )}

      {removeIsOpen && trackToRemove && (
        <Remove
          track={trackToRemove}
          setIsOpen={setRemoveIsOpen}
          onSuccess={onSuccess}
          setCurrentPage={setCurrentPage}
        ></Remove>
      )}
    </>
  );
}
