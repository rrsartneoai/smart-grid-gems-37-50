
import React from 'react';

interface ErrorOverlayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorOverlay = ({ message, onRetry }: ErrorOverlayProps) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-background/80"
      role="alert"
    >
      <div className="text-center p-4 bg-background rounded-lg shadow-md">
        <div className="text-red-500 font-bold mb-2">Błąd</div>
        <div className="mb-4">{message}</div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Spróbuj ponownie
          </button>
        )}
      </div>
    </div>
  );
};
