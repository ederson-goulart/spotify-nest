import Button from "@/app/components/Button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface FormErros {
  name: null | string;
  slug: null | string;
  description: null | string;
  cover: null | string;
}

export default function Create({ setIsOpen }: Props) {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cover, setCover] = useState<FileList | null>(null);
  const [errors, setErros] = useState<FormErros | undefined>(undefined);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Podemos enviar o formulário, pois ele está válido");
    } else {
      console.log("Erro de validação");
    }
  };

  const validateForm = () => {
    let formIsValid: boolean = true;

    const validateErros: FormErros = {
      name: null,
      slug: null,
      description: null,
      cover: null,
    };

    if (!name.trim()) {
      validateErros.name = "O nome é obrigatório.";
      formIsValid = false;
    }

    if (name.length < 3) {
      validateErros.name = "O nome está incorreto (menos de 3 caracteres).";
      formIsValid = false;
    }

    if (!slug.trim()) {
      validateErros.slug = "O slug é obrigatório.";
      formIsValid = false;
    }

    if (!description.trim()) {
      validateErros.description = "A descrição é obrigatório.";
      formIsValid = false;
    }

    if (!cover) {
      validateErros.cover = "A capa é obrigatória.";
      formIsValid = false;
    } else {
      console.log(cover?.[0].type);
      if (!["image/png", "image/jpeg", "image/jpg"].includes(cover?.[0].type)) {
        validateErros.cover = "A capa deve ter a extensão png, jpeg ou jpg.";
        formIsValid = false;
      }
    }

    setErros(validateErros);
    return formIsValid;
  };

  return (
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <span className="font-semibold text-sm">Nome:</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Legião Urbana"
              className="w-full p-2 border rounded"
            ></input>
            {errors?.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <span className="font-semibold text-sm">Slug:</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              type="text"
              placeholder="legiao-urbana"
              className="w-full p-2 border rounded"
            ></input>
            {errors?.slug && (
              <p className="text-red-500 text-sm">{errors.slug}</p>
            )}
          </div>

          <div>
            <span className="font-semibold text-sm">Descrição:</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded block"
            ></textarea>
            {errors?.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div>
            <span className="font-semibold text-sm">Capa:</span>
            <input
              type="file"
              onChange={(e) => setCover(e.target.files)}
              accept=".png, .jpg, .jpeg"
              className="w-full border rounded file:p-2 file:bg-gray-200"
            ></input>
            {errors?.cover && (
              <p className="text-red-500 text-sm">{errors.cover}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button>Adicionar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
