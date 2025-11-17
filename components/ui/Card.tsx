'use client';

import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ 
  children, 
  hover = false,
  className = '',
  ...props 
}: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  return (
    <div
      className={`bg-white border rounded-lg shadow-sm ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 border-t bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}
