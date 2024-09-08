import React from 'react';

interface DocumentProps {
  name: string;
  checked: boolean;
  preview: boolean;
  onClick: () => void;
}

const Document: React.FC<DocumentProps> = ({ name, checked, preview, onClick }) => {
  return (
    <div 
      className={`
        p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out
        ${checked ? 'border-2 border-blue-500' : preview ? 'border-2 border-gray-400' : 'border border-transparent'}
        hover:bg-gray-100 dark:hover:bg-gray-700
      `}
      onClick={onClick}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {}}
          className="mr-2"
        />
        <span className="text-sm">{name}</span>
      </div>
    </div>
  );
};

export default Document;