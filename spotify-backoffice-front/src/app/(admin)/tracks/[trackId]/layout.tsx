import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="border-4 border-yellow-700">
      <h1>Layout TrackID</h1>
      {children}
    </div>
  );
}
