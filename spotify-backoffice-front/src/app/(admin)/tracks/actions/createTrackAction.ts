"use server";

import { TrackSchema } from "@/app/schemas/track.schema";
import { treeifyError, z } from "zod/v4";

type TrackFormValues = z.infer<typeof TrackSchema>;

export type CreateTrackFormState = {
  status: "idle" | "loading" | "success" | "error";
  ok: boolean;
  message?: string;
  errors?: Record<string, { errors: string[] } | undefined>;
  values?: TrackFormValues;
};

export async function createTrackAction(
  _prevState: CreateTrackFormState,
  formData: FormData,
): Promise<CreateTrackFormState> {
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    durationInSeconds: parseInt(formData.get("durationInSeconds") as string, 10),
    bandId: formData.get("bandId") as string,
  };

  const validatedData = TrackSchema.safeParse(data);

  if (!validatedData.success) {
    const treeErrors = treeifyError(validatedData.error);
    return {
      status: "error",
      ok: false,
      message: "Verifique os campos.",
      errors: treeErrors.properties,
      values: { ...data, status: "active" },
    };
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://spotify-backoffice-nestjs:3000";
    
    const response = await fetch(`${backendUrl}/api/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: validatedData.data.title,
        slug: validatedData.data.slug,
        durationInSeconds: validatedData.data.durationInSeconds,
        bandId: validatedData.data.bandId,
        status: validatedData.data.status,
      }),
    });

    const result = await response.json();

    if (response.status === 201) {
      return { status: "success", ok: true, message: `Música criada com sucesso!` };
    } else {
      return {
        status: "error",
        ok: false,
        message: result.message || "Erro ao cadastrar a música no servidor.",
        values: { ...data, status: "active" },
      };
    }
  } catch (error: any) {
    console.error("Erro na Server Action createTrackAction:", error);
    return {
      status: "error",
      ok: false,
      message: `Erro de conexão com o servidor: ${error.message}`,
      values: { ...data, status: "active" },
    };
  }
}
