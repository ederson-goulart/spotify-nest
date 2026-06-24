interface Props {
  type: "bands" | "tracks";
}

enum TYPE {
  BANDS = "bands",
  TRACKS = "tracks",
}

export default async function Indicator({ type }: Props) {
  let value: number = 0;
  let title: string = "";

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      "http://spotify-backoffice-back:3000";
    const res = await fetch(
      `${backendUrl}/api/analytics/stats?period=today&page=1&limit=1`,
      {
        cache: "no-store",
      },
    );
    if (res.ok) {
      const responseBody = await res.json();
      if (type === TYPE.BANDS) {
        value = responseBody.data?.businessMetrics?.totalBands ?? 0;
      } else if (type === TYPE.TRACKS) {
        value = responseBody.data?.businessMetrics?.totalTracks ?? 0;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas do backend:", error);
  }

  if (type === TYPE.BANDS) {
    title = "Bandas";
  }

  if (type === TYPE.TRACKS) {
    title = "Trilhas";
  }

  return (
    <div className="flex flex-col items-center justify-center border-[1px] border-gray-800 text-gray-800 bg-gray-100 rounded-sm py-4 px-12">
      <p className="uppercase">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
