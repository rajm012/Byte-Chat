'use client';

import { useEffect, useState } from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'circle' | 'rounded' | 'square';
  width?: string | number;
  height?: string | number;
}


export function Skeleton({ 
  className = '', 
  children,
  variant = 'default',
  width,
  height 
}: SkeletonProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const baseStyles = 'bg-surface-container-high relative overflow-hidden';
  
  const variantStyles = {
    default: 'rounded-lg',
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none',
  };

  const sizeStyles = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={sizeStyles}
      aria-hidden="true"
    >
      {/* Shimmer animation overlay */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}
      {children}
    </div>
  );
}


export function SkeletonPulse({ 
  className = '', 
  variant = 'default',
  width,
  height 
}: Omit<SkeletonProps, 'children'>) {
  const variantStyles = {
    default: 'rounded-lg',
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none',
  };

  const sizeStyles = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div 
      className={`bg-surface-container-high animate-pulse ${variantStyles[variant]} ${className}`}
      style={sizeStyles}
      aria-hidden="true"
    />
  );
}


export function SkeletonText({ lines = 1, width = '100%', className = '' }: { 
  lines?: number; width?: string | string[]; className?: string;}) {
  const widths = Array.isArray(width) ? width : Array(lines).fill(width);
  
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height={12} 
          width={widths[i] || widths[widths.length - 1]}
          className="rounded"
        />
      ))}
    </div>
  );
}


export function SkeletonAvatar({size = 'md', className = '' }: { 
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string;}) {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 80,
  };

  return (
    <Skeleton 
      variant="circle" 
      width={sizeMap[size]} 
      height={sizeMap[size]}
      className={className}
    />
  );
}


export function SkeletonButton({size = 'md', fullWidth = false, className = '' }: { 
  size?: 'sm' | 'md' | 'lg'; fullWidth?: boolean; className?: string;}) {
  const heightMap = {
    sm: 28,
    md: 36,
    lg: 48,
  };

  return (
    <Skeleton 
      height={heightMap[size]} 
      width={fullWidth ? '100%' : 100}
      className={`rounded-lg ${className}`}
    />
  );
}


export function SkeletonCard({ hasImage = true, lines = 2, className = '' }: { 
  hasImage?: boolean; lines?: number; className?: string;}) {
  return (
    <div className={`bg-surface-container-lowest rounded-lg overflow-hidden ${className}`} aria-hidden="true">
      {hasImage && (
        <Skeleton height={160} variant="square" className="w-full" />
      )}
      <div className="p-3 space-y-2">
        <SkeletonText lines={lines} width={['75%', '50%']} />
        <div className="flex gap-2 pt-1">
          <SkeletonButton size="sm" className="flex-1" />
          <SkeletonButton size="sm" className="flex-1" />
        </div>
      </div>
    </div>
  );
}
