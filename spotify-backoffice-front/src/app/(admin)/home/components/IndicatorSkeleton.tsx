export default async function IndicatorSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center border-[1px] border-gray-800 text-gray-800 bg-gray-100 rounded-sm py-4 px-12 animate-pulse space-y-4">
      <div className="h-4 w-32 bg-gray-300 rounded"></div>
      <div className="h-8 w-48 bg-gray-300 rounded"></div>
    </div>
  );
}
