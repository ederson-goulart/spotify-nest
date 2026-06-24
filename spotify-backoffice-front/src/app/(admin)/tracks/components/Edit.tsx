"use client";

import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import { TrackPatchSchema } from "@/app/schemas/track.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import toast from "react-hot-toast";
import { Track, Band } from "../../../../../generated/prisma";

interface Props {
  track: Track & { band: { name: string } };
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  bands?: Band[];
}

type TrackFormData = z.input<typeof TrackPatchSchema>;

export default function Edit({
  track,
  setIsOpen,
  onSuccess,
  setCurrentPage,
  bands = [],
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bandsData, setBandsData] = useState<Band[]>(bands);

  const { register, handleSubmit, formState, reset } = useForm<TrackFormData>({
    resolver: zodResolver(TrackPatchSchema),
    shouldUnregister: true,
    defaultValues: {
      id: track.id,
    },
  });

  const onSubmit = async (trackData: TrackFormData) => {
    try {
      setIsLoading(true);

      const body = JSON.stringify({
        id: trackData.id,
        title: trackData.title,
        slug: trackData.slug,
        durationInSeconds: trackData.durationInSeconds,
        bandId: trackData.bandId,
      });

      const response = await fetch("/api/track", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (response.status === 200) {
        toast.success("Música atualizada com sucesso");
        onSuccess();
        setCurrentPage(1);
        setIsOpen(false);
      } else if (response.status === 404) {
        throw new Error("Registro de música não localizado");
      } else {
        throw new Error("Erro ao atualizar a música");
      }
    } catch (e: unknown) {
      console.error("Error: ", e);

      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Erro ao atualizar a música");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadBands = async () => {
      try {
        const response = await fetch("/api/band?take=1000");
        const data = await response.json();
        setBandsData(data.bands || []);
      } catch (error) {
        console.error("Erro ao carregar bandas:", error);
      }
    };

    loadBands();
  }, []);

  useEffect(() => {
    if (track) {
      reset({
        id: track.id,
        title: track.title,
        slug: track.slug,
        durationInSeconds: track.durationInSeconds,
        bandId: track.bandId,
      });
    }
  }, [track, reset]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-8 text-gray-500 hover:text-gray-800 text-4xl font-bold hover:cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Editar Música
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <input type="hidden" {...register("id")} />

            <div>
              <span className="font-semibold text-sm">Título:</span>
              <input
                {...register("title")}
                type="text"
                placeholder="Nome da música"
                className="w-full p-2 border rounded"
              />
              {formState.errors.title && (
                <p className="text-red-500 text-sm">
                  {formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Slug:</span>
              <input
                {...register("slug")}
                type="text"
                placeholder="nome-da-musica"
                className="w-full p-2 border rounded"
              />
              {formState.errors.slug && (
                <p className="text-red-500 text-sm">
                  {formState.errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Duração (segundos):</span>
              <input
                {...register("durationInSeconds", {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="180"
                className="w-full p-2 border rounded"
              />
              {formState.errors.durationInSeconds && (
                <p className="text-red-500 text-sm">
                  {formState.errors.durationInSeconds.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Banda:</span>
              <select
                {...register("bandId")}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione uma banda</option>
                {bandsData.map((band) => (
                  <option key={band.id} value={band.id}>
                    {band.name}
                  </option>
                ))}
              </select>
              {formState.errors.bandId && (
                <p className="text-red-500 text-sm">
                  {formState.errors.bandId.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex w-[120px] justify-center bg-gray-400 hover:bg-gray-500"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-[120px] justify-center"
              >
                {isLoading ? (
                  <Loading width={20} height={20} showText={false} />
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
