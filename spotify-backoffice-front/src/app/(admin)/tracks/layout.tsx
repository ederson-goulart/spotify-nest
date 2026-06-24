import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">{children}</div>
  );
}
