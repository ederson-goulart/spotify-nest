import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import { BandSchema } from "@/app/schemas/band.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import toast from "react-hot-toast";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

type BandFormData = z.input<typeof BandSchema>;

export default function CreateFetch({
  setIsOpen,
  onSuccess,
  setCurrentPage,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState } = useForm<BandFormData>({
    resolver: zodResolver(BandSchema),
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = async (band: BandFormData) => {
    try {
      setIsLoading(true);

      const bandFormData = new FormData();

      bandFormData.append("name", band.name);
      bandFormData.append("slug", band.slug);
      bandFormData.append("description", band.description || "");
      bandFormData.append("status", band.status || "active");

      Array.from(band.cover).forEach((cover) => {
        bandFormData.append("cover", cover);
      });

      const response = await fetch("/api/band", {
        method: "POST",
        body: bandFormData,
      });

      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso");
        onSuccess();
        setCurrentPage(1);
        setIsOpen(false);
      } else if (response.status === 409) {
        toast.error("Banda já cadastrada anteriormente!");
      } else {
        throw new Error("Erro ao cadastrar a banda");
      }
    } catch (e: unknown) {
      console.error("Error: ", e);

      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Erro ao cadastrar a banda");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Cadastrar Banda
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
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
              <span className="font-semibold text-sm">Capa:</span>
              <input
                {...register("cover")}
                type="file"
                accept=".png, .jpg, .jpeg"
                className="w-full border rounded file:p-2 file:bg-gray-200"
              ></input>
              {formState?.errors?.cover && (
                <p className="text-red-500 text-sm">
                  {formState.errors.cover.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-[120px] justify-center"
              >
                {isLoading ? (
                  <Loading width={20} height={20} showText={false} />
                ) : (
                  "Adicionar"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
