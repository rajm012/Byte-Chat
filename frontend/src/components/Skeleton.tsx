'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}


export const Skeleton = ({className = '', variant = 'rectangular', width, height}: SkeletonProps) => {
  const baseClass = 'skeleton animate-shimmer bg-surface-container-high rounded';
  const variantClass = variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'h-4 w-full' : '';
  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};


export const ChatItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-outline-variant/20">
    <Skeleton variant="circular" width={48} height={48} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="70%" className="h-3" />
    </div>
    <Skeleton variant="text" width={40} className="h-2" />
  </div>
);


export const MessageBubbleSkeleton = ({ isOwn = false }: { isOwn?: boolean }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
    <div className={`flex flex-col max-w-[70%] gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
      {!isOwn && (
        <div className="flex items-center gap-2 mb-1">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={60} className="h-3" />
        </div>
      )}
      <Skeleton
        className={`h-12 rounded-2xl ${isOwn ? 'rounded-tr-none bg-primary/20' : 'rounded-tl-none bg-surface-container-highest'}`}
        width={Math.floor(Math.random() * (250 - 150 + 1) + 150)}
      />
      <Skeleton variant="text" width={40} className="h-2 mt-1" />
    </div>
  </div>
);


export const ChatWindowSkeleton = () => (
  <div className="flex flex-col h-full bg-surface-container-lowest">
    <div className="h-16 border-b border-outline-variant/30 flex items-center px-4 gap-4 bg-surface">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-1">
        <Skeleton variant="text" width={120} className="h-4" />
        <Skeleton variant="text" width={80} className="h-3" />
      </div>
    </div>

    <div className="flex-1 overflow-hidden p-4 space-y-6">
      <MessageBubbleSkeleton isOwn={false} />
      <MessageBubbleSkeleton isOwn={true} />
      <MessageBubbleSkeleton isOwn={false} />
      <MessageBubbleSkeleton isOwn={true} />
      <MessageBubbleSkeleton isOwn={false} />
    </div>

    <div className="h-20 border-t border-outline-variant/30 flex items-center px-4 gap-3 bg-surface">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton className="flex-1 h-12 rounded-full" />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
  </div>
);
