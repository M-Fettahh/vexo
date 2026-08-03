'use client';

import React from 'react';

interface AppleCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  id?: string;
}

export const AppleCard: React.FC<AppleCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-[24px] p-6 sm:p-8 transition-all duration-300 shadow-sm ${
        hoverEffect ? 'hover:shadow-lg dark:hover:shadow-zinc-950/50 hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
