import { DSM } from "../types";
import React, { useState } from "react";
import { Pin } from "lucide-react";

interface SelectedItemsProps {
  selectedDSMs: number[];
  documents: DSM[];
  onAdd: () => void;
  onRemove: () => void;
  onSelect: () => void;
  onClear: () => void;
  previewState: number[] | null;
  isCollapsed: boolean;
  onPreview: (action: 'add' | 'remove' | 'select' | 'clear') => void;
}

const SelectedItems: React.FC<SelectedItemsProps> = ({
  selectedDSMs,
  documents,
  onAdd,
  onRemove,
  onSelect,
  onClear,
  previewState,
  isCollapsed,
  onPreview
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const selectedDocs = documents.filter(doc => selectedDSMs.includes(doc.id));
  const previewDocs = previewState ? documents.filter(doc => previewState.includes(doc.id) && !selectedDSMs.includes(doc.id)) : [];

  const totalDocs = selectedDocs.length + previewDocs.length;

  if (isCollapsed) {
    return (
      <div className="bg-[var(--secondary-bg-light)] dark:bg-[var(--secondary-bg-dark)] p-2 rounded-t-lg shadow-lg text-center">
        <span className="font-bold">{selectedDSMs.length}</span>
      </div>
    );
  }

  return (
    <div 
      className={`bg-[var(--secondary-bg-light)] dark:bg-[var(--secondary-bg-dark)] transition-all duration-300 ease-in-out rounded-t-lg shadow-lg`}
      style={{
        height: isPinned ? '40vh' : `${Math.min(totalDocs * 30 + 120, window.innerHeight * 0.4)}px`,
        maxHeight: '40vh'
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Selected Items ({selectedDSMs.length})</h3>
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              isPinned 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'bg-[var(--secondary-bg-light)] dark:bg-[var(--secondary-bg-dark)]'
            } hover:bg-gray-300 dark:hover:bg-gray-600`}
          >
            <Pin size={20} />
          </button>
        </div>
        <div className="flex space-x-2 mb-2">
          <button
            title="Add all filtered items into selection"
            onClick={() => onAdd()}
            onMouseEnter={() => onPreview('add')}
            onMouseLeave={() => onPreview('clear')}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Add ▼
          </button>
          <button
            title="Remove all filtered items from selection"
            onClick={onRemove}
            onMouseEnter={() => onPreview('remove')}
            onMouseLeave={() => onPreview('clear')}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Remove ▲
          </button>
          <button
            title="Replace selection with all filtered items"
            onClick={onSelect}
            onMouseEnter={() => onPreview('select')}
            onMouseLeave={() => onPreview('clear')}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Select ⤶
          </button>
          <button
            title="Clear all selected items"
            onClick={onClear}
            onMouseEnter={() => onPreview('clear')}
            onMouseLeave={() => onPreview('clear')}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Clear ✗
          </button>
        </div>
      </div>
      <div className="px-4 pb-4 overflow-y-auto" style={{ height: 'calc(100% - 100px)' }}>
        {selectedDocs.map((doc) => (
          <div key={doc.id} className="mb-1 text-sm">
            {doc.name}
          </div>
        ))}
        {previewDocs.map((doc) => (
          <div key={doc.id} className="mb-1 text-sm text-gray-400 transition-all duration-300 ease-in-out">
            {doc.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedItems;