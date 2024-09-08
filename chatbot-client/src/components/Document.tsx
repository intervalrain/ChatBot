import React from 'react';

interface DocumentProps {
  name: string;
  checked: boolean;
  onClick: () => void;
}

const Document: React.FC<DocumentProps> = ({ name, checked, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap text-ellipsis ${
        checked
          ? "bg-blue-500 text-white shadow-inner shadow-blue-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md shadow-gray-400"
      }`}
    >
      {name}
    </button>
  );
};

export default Document;