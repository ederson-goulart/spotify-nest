import z from "zod/v4";

export const TrackSchema = z.object({
  title: z.string().min(1, "O título precisa ter pelo menos 1 caracter"),
  slug: z.string().min(1, "O slug é obrigatório"),
  durationInSeconds: z
    .number({ message: "Duração deve ser um número" })
    .int("Duração deve ser um número inteiro")
    .positive("Duração deve ser maior que 0"),
  bandId: z.string().min(1, "Selecione uma banda"),
  status: z.enum(["active", "inactive"]).default("active"),
});

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const TrackPatchSchema = TrackSchema.extend({
  id: z.string("ID inválido").regex(uuidRegex, "ID inválido"),
});
