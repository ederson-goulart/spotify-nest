import Button from "@/app/components/Button";
import { Dispatch, SetStateAction } from "react";
import { Band } from "../../../../../generated/prisma";
import toast from "react-hot-toast";

interface Props {
  band: Band;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Remove({
  band,
  onSuccess,
  setCurrentPage,
  setIsOpen,
}: Props) {
  const handleRemove = async () => {
    const body = JSON.stringify({
      id: band.id,
    });

    const response = await fetch(`/api/band`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (response.status === 200) {
      toast.success("Banda removida com sucesso");
      onSuccess();
      setCurrentPage(1);
      setIsOpen(false);
    } else if (response.status === 400) {
      throw new Error("O ID da Banda não foi informado");
    } else {
      throw new Error("Erro ao excluir a banda");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-8 text-gray-500 hover:text-gray-800 text-4xl font-bold hover:cursor-pointer"
            arial-label="Fechar"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Confirmar Remoção da Banda?
          </h2>
          <p>Banda: {band.name}</p>
          <p>A operação não poderá ser desfeita!</p>

          <div className="flex justify-end mt-6">
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
