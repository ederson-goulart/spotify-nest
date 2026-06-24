"use client";

import Button from "@/app/components/Button";
import { Dispatch, SetStateAction } from "react";
import { Track } from "../../../../../generated/prisma";
import toast from "react-hot-toast";

interface Props {
  track: Track & { band: { name: string } };
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Remove({
  track,
  onSuccess,
  setCurrentPage,
  setIsOpen,
}: Props) {
  const handleRemove = async () => {
    const body = JSON.stringify({
      id: track.id,
    });

    const response = await fetch(`/api/track`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (response.status === 200) {
      toast.success("Música removida com sucesso");
      onSuccess();
      setCurrentPage(1);
      setIsOpen(false);
    } else if (response.status === 400) {
      throw new Error("O ID da Música não foi informado");
    } else {
      throw new Error("Erro ao excluir a música");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-8 text-gray-500 hover:text-gray-800 text-4xl font-bold hover:cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Confirmar Remoção da Música?
          </h2>
          <p>Música: {track.title}</p>
          <p>Banda: {track.band.name}</p>
          <p>A operação não poderá ser desfeita!</p>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => setIsOpen(false)}
              className="flex w-[120px] justify-center bg-gray-400 hover:bg-gray-500"
            >
              Cancelar
            </Button>
            <Button
              className="flex w-[120px] justify-center"
              onClick={() => handleRemove()}
            >
              Remover
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
