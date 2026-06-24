import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import { BandPatchSchema } from "@/app/schemas/band.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod/v4";
import toast from "react-hot-toast";
import { Band } from "../../../../../generated/prisma";
import Image from "next/image";
import { getPublicUploadUrl } from "@/app/utils/uploads";

interface Props {
  band: Band;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

type BandFormData = z.input<typeof BandPatchSchema>;

export default function Edit({
  band,
  setIsOpen,
  onSuccess,
  setCurrentPage,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [changeCover, setChangeCover] = useState<boolean>(false);

  const { register, handleSubmit, formState, reset, control } = useForm<BandFormData>({
    resolver: zodResolver(BandPatchSchema),
    shouldUnregister: true,
    defaultValues: {
      id: band.id,
      status: "active",
    },
  });

  const coverFiles = useWatch({
    control,
    name: "cover",
  });

  const previewUrl = coverFiles && coverFiles.length > 0 ? URL.createObjectURL(coverFiles[0]) : null;

  const onSubmit = async (band: BandFormData) => {
    try {
      setIsLoading(true);

      const bandFormData = new FormData();

      bandFormData.append("id", band.id);
      bandFormData.append("name", band.name);
      bandFormData.append("slug", band.slug);
      bandFormData.append("description", band.description || "");
      bandFormData.append("status", band.status || "active");

      if (band.cover) {
        Array.from(band.cover).forEach((cover) => {
          bandFormData.append("cover", cover);
        });
      }

      const response = await fetch("/api/band", {
        method: "PATCH",
        body: bandFormData,
      });

      if (response.status === 200) {
        toast.success("Banda atualizada com sucesso");
        onSuccess();
        setCurrentPage(1);
        setIsOpen(false);
      } else if (response.status === 404) {
        throw new Error("Registro de banda não localizado");
      } else {
        throw new Error("Erro ao atualizar a banda");
      }
    } catch (e: unknown) {
      console.error("Error: ", e);

      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Erro ao atualizar a banda");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (band) {
      reset({
        name: band.name,
        slug: band.slug,
        description: band.description || "",
        status: band.status,
      });
    }
  }, [band, reset]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-8 text-gray-500 hover:text-gray-800 text-4xl font-bold hover:cursor-pointer"
            arial-label="Fechar"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Atualizar Banda
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <input {...register("id")} type="hidden" />
            <div>
              <span className="font-semibold text-sm">Nome:</span>
              <input
                {...register("name")}
                type="text"
                placeholder="Legião Urbana"
                className="w-full p-2 border rounded"
              ></input>
              {formState?.errors?.name && (
                <p className="text-red-500 text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Slug:</span>
              <input
                {...register("slug")}
                type="text"
                placeholder="legiao-urbana"
                className="w-full p-2 border rounded"
              ></input>
              {formState?.errors?.slug && (
                <p className="text-red-500 text-sm">
                  {formState.errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Descrição:</span>
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded block"
              ></textarea>
              {formState?.errors?.description && (
                <p className="text-red-500 text-sm">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Status:</span>
              <select
                {...register("status")}
                className="w-full p-2 border rounded"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
              {formState?.errors?.status && (
                <p className="text-red-500 text-sm">
                  {formState.errors.status.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Capa atual:</span>
              <div className="space-y-2">
                <div className="w-full h-48 rounded-lg overflow-hidden relative">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Nova capa"
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  ) : band.coverUrl ? (
                    <Image
                      src={getPublicUploadUrl(band.coverUrl)}
                      alt="Capa atual"
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Sem capa</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChangeCover(true)}
                className="text-blue-600 hover:underline"
              >
                Alterar capa
              </button>
            </div>

            {changeCover && (
              <div>
                <span className="font-semibold text-sm">Capa:</span>
                <input
                  {...register("cover")}
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  className="w-full border rounded file:p-2 file:bg-gray-200"
                ></input>
                <a href="#" onClick={() => setChangeCover(false)}>
                  Cancelar - Manter a capa atual
                </a>
                {formState?.errors?.cover && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.cover.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end">
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
