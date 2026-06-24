import { Suspense } from "react";
import Indicator from "./components/Indicator";
import IndicatorSkeleton from "./components/IndicatorSkeleton";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">Home</h1>
      <div className="flex gap-8">
        <Suspense fallback={<IndicatorSkeleton />}>
          <Indicator type="bands" />
        </Suspense>

        <Suspense fallback={<IndicatorSkeleton />}>
          <Indicator type="tracks" />
        </Suspense>
      </div>
    </>
  );
}
