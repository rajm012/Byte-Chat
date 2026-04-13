'use client';

import { Skeleton, SkeletonText, SkeletonAvatar } from './Skeleton';


export function GroupListItemSkeleton() {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
      aria-hidden="true"
    >
      <Skeleton variant="rounded" width={48} height={48} />
      
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton height={14} width="70%" className="rounded" />
        <div className="flex items-center gap-2">
          <Skeleton height={12} width={80} className="rounded" />
          <Skeleton height={12} width={60} className="rounded" />
        </div>
      </div>
    </div>
  );
}


export function GroupListSkeleton() {
  return (
    <div className="space-y-1 px-4 pb-4" aria-hidden="true">
      <div className="mb-4">
        <Skeleton height={44} className="rounded-xl" />
      </div>
      
      {Array.from({ length: 6 }).map((_, i) => (
        <GroupListItemSkeleton key={i} />
      ))}
    </div>
  );
}


export function GroupCardSkeleton({ index }: { index: number }) {
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
        <div className="space-y-1">
          <Skeleton height={14} width="85%" className="rounded" />
          <Skeleton height={10} width="50%" className="rounded" />
        </div>
        
        <div className="flex gap-1 mt-auto">
          <Skeleton height={22} className="flex-1 rounded-md" />
          <Skeleton height={22} className="flex-1 rounded-md" />
          <Skeleton height={22} className="flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}


export function GroupChatHeaderSkeleton() {
  return (
    <div 
      className="px-6 py-4 bg-surface/30 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">

        <Skeleton variant="circle" width={36} height={36} />
        <Skeleton variant="rounded" width={40} height={40} />

        <div className="space-y-1">
          <Skeleton height={16} width={140} className="rounded" />
          <Skeleton height={12} width={100} className="rounded" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Skeleton variant="circle" width={36} height={36} />
      </div>
    </div>
  );
}


export function GroupInfoSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6" aria-hidden="true">
      <div className="flex items-center gap-2">
        <Skeleton variant="circle" width={32} height={32} />
        <Skeleton height={14} width={100} className="rounded" />
      </div>
      
      <div className="bg-surface-container rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <SkeletonAvatar size="xl" />
          <div className="space-y-2">
            <Skeleton height={20} width={180} className="rounded" />
            <Skeleton height={14} width={120} className="rounded" />
          </div>
        </div>
        <SkeletonText lines={2} width={['100%', '80%']} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Skeleton height={80} className="rounded-xl" />
        <Skeleton height={80} className="rounded-xl" />
      </div>

      <div className="bg-surface-container rounded-2xl p-6 shadow-sm">
        <Skeleton height={18} width={100} className="rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={60} className="rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}


export function PollCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-surface-container animate-pulse" aria-hidden="true">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="80%" className="rounded" />
          <Skeleton height={12} width="40%" className="rounded" />
        </div>
        <Skeleton variant="circle" width={32} height={32} />
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={36} className="rounded-lg" />
        ))}
      </div>
    </div>
  );
}
