import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="loading.svg"
        width={80}
        height={80}
        alt="Carregando a Página"
      ></Image>
      Carregando a Página
    </div>
  );
}
