import Image from "next/image";

interface Props {
  width?: number;
  height?: number;
  showText?: boolean;
}

export default function Loading({
  width = 40,
  height = 40,
  showText = true,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="loading.svg"
        width={width}
        height={height}
        alt="Carregando..."
      ></Image>
      {showText && "Carregando..."}
    </div>
  );
}
