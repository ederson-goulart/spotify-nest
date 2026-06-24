"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { generateSecret, generateURI, verify } from "otplib";

export const get2faSecret = async (): Promise<ActionResponse> => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Não autorizado",
      success: false,
    };
  }

  const user = await prisma.user.findFirst({ where: { id: session.user.id } });

  if (!user) {
    return {
      message: "Usuário não encontrado",
      success: false,
    };
  }

  let twoFactorSecret = user.twoFactorSecret;

  if (!twoFactorSecret) {
    twoFactorSecret = generateSecret();
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret },
    });
  }

  const uri = generateURI({
    issuer: process.env.APP_NAME || "",
    label: user.email,
    secret: twoFactorSecret,
  });

  return {
    message: "QR code do 2FA gerado com sucesso!",
    success: true,
    data: uri,
  };
};

export const activate2fa = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Não autorizado",
      success: false,
    };
  }

  const user = await prisma.user.findFirst({ where: { id: session.user.id } });

  if (!user) {
    return {
      message: "Usuário não encontrado",
      success: false,
    };
  }

  const twoFactorSecret = user.twoFactorSecret;

  if (twoFactorSecret) {
    const tokenValid = await verify({ secret: twoFactorSecret, token });

    if (!tokenValid.valid) {
      return {
        message: "OTP é inválido",
        success: false,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorActivated: true },
    });

    return {
      message: "2FA ativado com sucesso",
      success: true,
    };
  }
};

export const disable2fa = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Não autorizado",
      success: false,
    };
  }

  await prisma.user.update({
    where: { id: session?.user?.id },
    data: { twoFactorActivated: false },
  });

  return {
    message: "2FA desativado com sucesso",
    success: true,
  };
};
