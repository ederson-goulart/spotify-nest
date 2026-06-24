"use client";

import { Button } from "@/components/ui/button";
import { logout } from "./action";

export default function LogoutButton() {
  const handleLogout = async (): Promise<void> => {
    await logout();
  };
  return <Button onClick={handleLogout}>Sair</Button>;
}
