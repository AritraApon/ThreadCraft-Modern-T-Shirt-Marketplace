export default function ProductSkeleton() {
  return (
    <div className="w-full h-[450px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden p-1 space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-4 flex flex-col h-[230px]">
        <div className="flex justify-between"><div className="w-20 h-3 bg-gray-200 dark:bg-gray-800 rounded" /><div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded" /></div>
        <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="mt-auto flex justify-between items-center"><div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded" /><div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" /></div>
      </div>
    </div>
  );
}