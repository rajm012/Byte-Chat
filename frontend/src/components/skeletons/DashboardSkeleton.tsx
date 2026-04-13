'use client';

import { Skeleton, SkeletonButton } from './Skeleton';


export function DashboardCardSkeleton({ index }: { index: number }) {
  const staggerClass = index % 3 === 1 ? 'md:mt-6' : '';
  return (
    <div 
      className={`group relative flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden ${staggerClass}`}
      aria-hidden="true"
    >
      <div className="aspect-square overflow-hidden">
        <Skeleton variant="square" className="w-full h-full" />
      </div>
      
      <div className="p-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1">
            <Skeleton height={14} width="80%" className="rounded" />
            <Skeleton height={10} width="50%" className="rounded" />
          </div>
          <Skeleton height={22} width={40} className="rounded-md shrink-0" />
        </div>
        
        <div className="flex gap-1.5">
          <Skeleton height={24} className="flex-1 rounded-md" />
          <Skeleton height={24} className="flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}


export function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <DashboardCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
}


export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-12" aria-hidden="true">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton height={12} width={100} className="rounded" />
          <div className="flex items-center gap-2">
            <Skeleton height={40} width={200} className="rounded" />
            <Skeleton height={40} width={120} className="rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonButton size="md" />
          <SkeletonButton size="md" />
        </div>
      </div>
    </div>
  );
}


export function DashboardPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-12">
      <DashboardHeaderSkeleton />
      
      <div className="md:hidden mb-6">
        <Skeleton height={40} className="rounded-full" />
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <Skeleton height={16} width={180} className="rounded" />
        <SkeletonButton size="md" />
      </div>
      <DashboardGridSkeleton />
    </div>
  );
}
