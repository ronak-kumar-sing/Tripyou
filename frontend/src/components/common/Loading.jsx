import React from 'react';

export default function Loading({ size = 'default', fullScreen = false }) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    default: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-primary-500 border-t-transparent ${sizeClasses[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
