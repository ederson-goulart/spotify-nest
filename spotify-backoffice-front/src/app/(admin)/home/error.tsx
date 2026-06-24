"use client";

import Button from "@/app/components/Button";

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Ops! Algo deu errado.</h2>
      <p className="text-xs">{error.message}</p>
      <br />
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
