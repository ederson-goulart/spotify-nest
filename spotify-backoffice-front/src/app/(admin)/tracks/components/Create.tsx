"use client";

import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import {
  createTrackAction,
  CreateTrackFormState,
} from "../actions/createTrackAction";
import toast from "react-hot-toast";
import { fetchBandsForSelectAction } from "../actions/fetchBandsAction";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const INITIAL_STATE: CreateTrackFormState = { status: "idle", ok: false };

export default function Create({
  setIsOpen,
  onSuccess,
  setCurrentPage,
}: Props) {
  const [bands, setBands] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading] = useState<boolean>(false);
  const [state, formAction] = useActionState(createTrackAction, INITIAL_STATE);

  useEffect(() => {
    const loadBands = async () => {
      const bandsData = await fetchBandsForSelectAction();
      setBands(bandsData);
    };
    loadBands();
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(
        state.message ? state.message : "Cadastro realizado com sucesso",
      );

      onSuccess();
      setCurrentPage(1);
      setIsOpen(false);
    } else if (state.status === "error") {
      toast.error(
        state.message
          ? state.message
          : "Houve um erro na tentativa de registro da música",
      );
    }
  }, [state]);

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
            Cadastrar Música
          </h2>
          <form action={formAction} className="flex flex-col gap-3">
            <div>
              <span className="font-semibold text-sm">Título:</span>
              <input
                name="title"
                defaultValue={state?.values?.title}
                type="text"
                placeholder="Nome da música"
                className="w-full p-2 border rounded"
              />
              {state?.errors?.title && (
                <p className="text-red-500 text-sm">
                  {state.errors.title.errors.join(", ")}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Slug:</span>
              <input
                name="slug"
                defaultValue={state?.values?.slug}
                type="text"
                placeholder="nome-da-musica"
                className="w-full p-2 border rounded"
              />
              {state?.errors?.slug && (
                <p className="text-red-500 text-sm">
                  {state.errors.slug.errors.join(", ")}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Duração (segundos):</span>
              <input
                name="durationInSeconds"
                defaultValue={state?.values?.durationInSeconds}
                type="number"
                placeholder="180"
                className="w-full p-2 border rounded"
              />
              {state?.errors?.durationInSeconds && (
                <p className="text-red-500 text-sm">
                  {state.errors.durationInSeconds.errors.join(", ")}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Banda:</span>
              <select
                name="bandId"
                defaultValue={state?.values?.bandId || ""}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione uma banda</option>
                {bands.map((band) => (
                  <option key={band.id} value={band.id}>
                    {band.name}
                  </option>
                ))}
              </select>
              {state?.errors?.bandId && (
                <p className="text-red-500 text-sm">
                  {state.errors.bandId.errors.join(", ")}
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
