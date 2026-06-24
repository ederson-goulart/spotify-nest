"use server";

import { BandSchema } from "@/app/schemas/band.schema";
import { treeifyError, z } from "zod/v4";

type BandFormValues = z.infer<typeof BandSchema>;

export type CreateBandFormState = {
  status: "idle" | "loading" | "success" | "error";
  ok: boolean;
  message?: string;
  errors?: Record<string, { errors: string[] } | undefined>;
  values?: Partial<BandFormValues>;
};

export async function createBandAction(
  _prevState: CreateBandFormState,
  formData: FormData,
): Promise<CreateBandFormState> {
  const cover = formData.getAll("cover") as File[];

  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") || "") as string,
    cover,
  };

  const serializableData = {
    name: data.name,
    slug: data.slug,
    description: data.description,
  };

  const validatedData = BandSchema.safeParse(data);

  if (!validatedData.success) {
    const treeErrors = treeifyError(validatedData.error);
    return {
      status: "error",
      ok: false,
      message: "Verifique os campos.",
      errors: treeErrors.properties,
      values: { ...serializableData, status: "active" },
    };
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://spotify-backoffice-nestjs:3000";
    
    const response = await fetch(`${backendUrl}/api/band`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.status === 201) {
      return { status: "success", ok: true, message: `Banda criada com sucesso!` };
    } else {
      return {
        status: "error",
        ok: false,
        message: result.message || "Erro ao cadastrar a banda no servidor.",
        values: { ...serializableData, status: "active" },
      };
    }
  } catch (error: any) {
    console.error("Erro na Server Action createBandAction:", error);
    return {
      status: "error",
      ok: false,
      message: `Erro de conexão com o servidor: ${error.message}`,
      values: { ...serializableData, status: "active" },
    };
  }
}
