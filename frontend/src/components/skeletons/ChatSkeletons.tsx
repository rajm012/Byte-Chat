'use client';

import { Skeleton, SkeletonText, SkeletonAvatar } from './Skeleton';


export function ConversationItemSkeleton() {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
      aria-hidden="true"
    >
      <SkeletonAvatar size="lg" />
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton height={14} width="70%" className="rounded" />
          <Skeleton height={10} width={30} className="rounded" />
        </div>
        <Skeleton height={12} width="50%" className="rounded" />
      </div>
      
      <Skeleton variant="circle" width={20} height={20} />
    </div>
  );
}


export function ConversationListSkeleton() {
  return (
    <div className="space-y-1 p-3" aria-hidden="true">
      <div className="mb-3">
        <Skeleton height={40} className="rounded-full" />
      </div>
      
      {Array.from({ length: 8 }).map((_, i) => (
        <ConversationItemSkeleton key={i} />
      ))}
    </div>
  );
}


export function MessageBubbleSkeleton({ 
  isMyMessage,
  width = 'w-2/3' 
}: { 
  isMyMessage: boolean;
  width?: string;
}) {
  return (
    <div 
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
      aria-hidden="true"
    >
      {!isMyMessage && (
        <SkeletonAvatar size="sm" className="mr-2 self-end mb-1" />
      )}
      
      <div 
        className={`${width} space-y-2 p-3 ${
          isMyMessage 
            ? 'bg-surface-container-high rounded-2xl rounded-br-sm' 
            : 'bg-surface-container-high rounded-2xl rounded-bl-sm'
        }`}
      >

        {!isMyMessage && (
          <Skeleton height={12} width={60} className="rounded" />
        )}
        
        <SkeletonText lines={2} width={['100%', '70%']} />
        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
          <Skeleton height={10} width={35} className="rounded" />
        </div>
      </div>
    </div>
  );
}


export function ChatMessagesSkeleton() {
  const pattern = [
    { isMyMessage: false, width: 'w-2/3' },
    { isMyMessage: true, width: 'w-1/2' },
    { isMyMessage: false, width: 'w-3/4' },
    { isMyMessage: true, width: 'w-2/5' },
    { isMyMessage: false, width: 'w-1/2' },
    { isMyMessage: true, width: 'w-3/5' },
    { isMyMessage: false, width: 'w-4/5' },
    { isMyMessage: true, width: 'w-1/3' },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-hidden="true">
      {pattern.map((item, i) => (
        <MessageBubbleSkeleton 
          key={i} 
          isMyMessage={item.isMyMessage} 
          width={item.width}
        />
      ))}
      
      <div className="flex justify-start">
        <div className="flex items-center gap-1 p-3 bg-surface-container-high rounded-2xl rounded-bl-sm">
          <Skeleton variant="circle" width={6} height={6} />
          <Skeleton variant="circle" width={6} height={6} />
          <Skeleton variant="circle" width={6} height={6} />
        </div>
      </div>
    </div>
  );
}


export function ChatHeaderSkeleton() {
  return (
    <div 
      className="px-6 py-4 bg-surface-container/30 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between"
      aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={36} height={36} />
        <SkeletonAvatar size="md" />
        
        <div className="space-y-1">
          <Skeleton height={16} width={120} className="rounded" />
          <Skeleton height={12} width={80} className="rounded" />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Skeleton variant="circle" width={36} height={36} />
        <Skeleton variant="circle" width={36} height={36} />
      </div>
    </div>
  );
}


export function MessageInputSkeleton() {
  return (
    <div 
      className="px-4 py-3 bg-surface-container/50 backdrop-blur-md border-t border-outline-variant/30"
      aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton height={44} className="flex-1 rounded-full" />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="circle" width={44} height={44} />
      </div>
    </div>
  );
}


export function ChatPageSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden" aria-hidden="true">
      <div className="w-full md:w-[320px] lg:w-[360px] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col">
        <div className="p-4 border-b border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <Skeleton height={24} width={80} className="rounded" />
            <Skeleton variant="circle" width={36} height={36} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ConversationListSkeleton />
        </div>
      </div>
      
      <div className="hidden md:flex flex-1 flex-col bg-surface/50">
        <ChatHeaderSkeleton />
        <ChatMessagesSkeleton />
        <MessageInputSkeleton />
      </div>
    </div>
  );
}
