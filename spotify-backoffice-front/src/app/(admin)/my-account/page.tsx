import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TwoFactorAuthForm from "./components/two-factor-auth-form";
import { prisma } from "@/lib/client";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({ where: { id: session?.user.id } });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>Minha conta</CardHeader>
      <CardContent>
        <Label>E-mail</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
        <TwoFactorAuthForm
          twoFactorActivated={user?.twoFactorActivated ?? false}
        />
      </CardContent>
    </Card>
  );
}
