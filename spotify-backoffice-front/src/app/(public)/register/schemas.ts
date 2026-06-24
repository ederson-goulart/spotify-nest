import z from "zod/v4";

export const userSchema = z
  .object({
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
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

export type UserSchema = z.infer<typeof userSchema>;
