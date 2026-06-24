import z from "zod/v4";

const emailSchema = z.email("E-mail inválido");
const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres");

export const passwordConfirmSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, context) => {
    if (data.password !== data.passwordConfirm) {
      context.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "A senha não confere",
      });
    }
  });

export const userSchema = z
  .object({
    email: emailSchema,
  })
  .and(passwordConfirmSchema);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const changePasswordConfirmSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordConfirmSchema);

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordConfirmSchema = z
  .object({
    token: z.string(),
  })
  .and(passwordConfirmSchema);

export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ChangePasswordConfirmSchema = z.infer<
  typeof changePasswordConfirmSchema
>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type PasswordConfirmSchema = z.infer<typeof passwordConfirmSchema>;
export type UpdatePasswordConfirmSchema = z.infer<
  typeof updatePasswordConfirmSchema
>;
