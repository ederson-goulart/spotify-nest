import z from "zod/v4";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const coverValidation = z
  .custom<File[]>(
    (fileList) => {
      // browser
      const isFileList =
        typeof FileList !== "undefined" &&
        fileList instanceof FileList &&
        fileList.length > 0;

      // back (node)
      const isArrayOfFiles =
        Array.isArray(fileList) &&
        fileList.length > 0 &&
        fileList.every((file) => file instanceof File);

      return isFileList || isArrayOfFiles;
    },
    { message: "Envie um arquivo válido." },
  )
  .refine((fileList) => fileList[0].size > 0, {
    message: "Arquivo é obrigatório",
  })
  .refine((fileList) => fileList[0].size < MAX_SIZE_MB * 1024 * 1024, {
    message: `O tamanho máximo permitido é de ${MAX_SIZE_MB}MB`,
  })
  .refine((fileList) => ACCEPTED_TYPES.includes(fileList[0].type), {
    message: `Tipo inválido. Permitidos: ${ACCEPTED_TYPES.join(", ")}`,
  });

export const BandSchema = z.object({
  name: z.string().min(1, "O nome precisa ter pelo menos 1 caracter"),
  slug: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  cover: coverValidation,
});

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const BandPatchSchema = BandSchema.extend({
  id: z.string("ID inválido").regex(uuidRegex, "ID inválido"),
  cover: coverValidation.optional(),
});

export const BandArraySchema = z.array(BandSchema).min(1);
