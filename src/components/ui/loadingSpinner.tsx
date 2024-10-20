import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500 border-opacity-75"></div>
    </div>
  );
};

export default LoadingSpinner;
