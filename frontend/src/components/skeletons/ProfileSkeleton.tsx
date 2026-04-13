'use client';

import { Skeleton, SkeletonText, SkeletonAvatar } from './Skeleton';


export function ProfileHeaderSkeleton() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="h-48 md:h-64 bg-surface-container-high animate-pulse" />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="relative -mt-16 mb-4">
          <SkeletonAvatar size="xl" className="border-4 border-surface" />
        </div>
      </div>
    </div>
  );
}


export function ProfileInfoSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 pb-8 space-y-4" aria-hidden="true">
      <div className="space-y-2">
        <Skeleton height={28} width={200} className="rounded" />
        <Skeleton height={16} width={120} className="rounded" />
      </div>
      
      <SkeletonText lines={3} width={['100%', '90%', '70%']} />
      
      <div className="flex gap-8 py-4 border-y border-outline-variant/30">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton height={24} width={40} className="rounded mx-auto" />
            <Skeleton height={12} width={60} className="rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}


export function ProfileEditFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6" aria-hidden="true">
      <Skeleton height={24} width={150} className="rounded mb-6" />
      
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={14} width={100} className="rounded" />
          <Skeleton height={48} className="rounded-xl" />
        </div>
      ))}

      <div className="space-y-2">
        <Skeleton height={14} width={80} className="rounded" />
        <Skeleton height={120} className="rounded-xl" />
      </div>

      <div className="pt-4">
        <Skeleton height={48} className="rounded-xl" />
      </div>
    </div>
  );
}


export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-surface" aria-hidden="true">
      <ProfileHeaderSkeleton />
      <ProfileInfoSkeleton />

      <div className="max-w-3xl mx-auto px-6">
        <div className="flex gap-4 border-b border-outline-variant/30 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={40} width={80} className="rounded-t-lg" />
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 pb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={120} className="rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}


export function ProfileCardCompactSkeleton() {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
      aria-hidden="true"
    >
      <SkeletonAvatar size="md" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton height={14} width="60%" className="rounded" />
        <Skeleton height={12} width="40%" className="rounded" />
      </div>
    </div>
  );
}
