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
  createBandAction,
  CreateBandFormState,
} from "../actions/createBandAction";
import toast from "react-hot-toast";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const INITIAL_STATE: CreateBandFormState = { status: "idle", ok: false };

export default function Create({
  setIsOpen,
  onSuccess,
  setCurrentPage,
}: Props) {
  const [isLoading] = useState<boolean>(false);
  const [state, formAction] = useActionState(createBandAction, INITIAL_STATE);
  const [isGeneratingBio, setIsGeneratingBio] = useState<boolean>(false);

  const handleGenerateBio = async () => {
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const name = nameInput?.value;
    if (!name) {
      toast.error("Por favor, preencha o nome da banda primeiro.");
      return;
    }

    try {
      setIsGeneratingBio(true);
      const response = await fetch("/api/ai/enrich-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const result = await response.json();
      if (result.success && result.data?.bio) {
        const textarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = result.data.bio;
        }
        toast.success("Biografia gerada com sucesso!");
      } else {
        toast.error("Erro ao gerar biografia com IA.");
      }
    } catch (err) {
      toast.error("Erro de conexão ao gerar biografia.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

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
          : "Houve um erro na tentativa de registro da banda",
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
            arial-label="Fechar"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Cadastrar Banda
          </h2>
          <form action={formAction} className="flex flex-col gap-3">
            <div>
              <span className="font-semibold text-sm">Nome:</span>
              <input
                name="name"
                defaultValue={state?.values?.name}
                type="text"
                placeholder="Legião Urbana"
                className="w-full p-2 border rounded"
              ></input>
              {state?.errors?.name && (
                <p className="text-red-500 text-sm">
                  {state.errors.name.errors.join(", ")}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Slug:</span>
              <input
                name="slug"
                defaultValue={state?.values?.slug}
                type="text"
                placeholder="legiao-urbana"
                className="w-full p-2 border rounded"
              ></input>
              {state?.errors?.slug && (
                <p className="text-red-500 text-sm">
                  {state.errors.slug.errors.join(", ")}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">Descrição:</span>
                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={isGeneratingBio}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded-md font-semibold transition hover:cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingBio ? "Gerando..." : "✨ Gerar com IA"}
                </button>
              </div>
              <textarea
                name="description"
                defaultValue={state?.values?.description}
                className="w-full p-2 border rounded block"
              ></textarea>
              {state?.errors?.description && (
                <p className="text-red-500 text-sm">
                  {state.errors.description.errors.join(", ")}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Capa:</span>
              <input
                name="cover"
                type="file"
                accept=".png, .jpg, .jpeg"
                className="w-full border rounded file:p-2 file:bg-gray-200"
              ></input>
              {state?.errors?.cover && (
                <p className="text-red-500 text-sm">
                  {state.errors.cover.errors.join(", ")}
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
