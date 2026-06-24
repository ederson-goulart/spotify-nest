"use server";

import { userSchema } from "./schemas";

interface RegisterUserProps {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUserProps) => {
  const newUserValidation = userSchema.safeParse({
    email,
    password,
    passwordConfirm,
  });

  // TODO cadastrar o usuário no banco de dados
  if (!newUserValidation.success) {
    return {
      success: false,
      data: newUserValidation.error?.issues,
    };
  }

  return {
    success: true,
    data: "Usuário cadastro com sucesso",
  };
};
