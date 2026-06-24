import { ReactNode } from "react";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header></Header>
      {children}
      <Toaster
        toastOptions={{
          duration: 4000,
          style: { padding: "24px" },
          error: {
            className: "bg-red-50!",
          },
          success: {
            className: "bg-green-50!",
          },
        }}
      />
    </>
  );
}
