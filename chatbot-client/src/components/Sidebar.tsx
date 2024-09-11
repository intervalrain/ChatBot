import { getDocuments } from "../api";
import { DSM } from "../types";
import Documents from "./Documents";
import SelectedItems from "./SelectedItems";
import React, { useState, useEffect, useRef } from "react";
import { MultiValue } from "react-select";

interface FilterOption {
  value: string;
  label: string;
}

const Sidebar: React.FC = () => {
  const width = 450;
  const [selectedDSMs, setSelectedDSMs] = useState<number[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "true");
  const [showUnselectedOnly, setShowUnselectedOnly] = useState(false);
  const [previewState, setPreviewState] = useState<number[] | null>(null);
  const [documents, setDocuments] = useState<DSM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemsHeight, setSelectedItemsHeight] = useState(0);

  const [filters, setFilters] = useState<Record<string, FilterOption[]>>({
    generation: [],
    technology: [],
    category: [],
    platform: [],
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const fetchedDocuments = await getDocuments();
        setDocuments(fetchedDocuments);
        setError(null);
      } catch (error) {
        setError("Failed to fetch documents");
        console.error("Error fetching documents", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarWidth", width.toString());
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [width, isCollapsed]);

  const handleDSMSelection = (dsmId: number, isClick: boolean = false) => {
    if (isClick) {
      setSelectedDSMs((prev) =>
        prev.includes(dsmId)
          ? prev.filter((id) => id !== dsmId)
          : [...prev, dsmId]
      );
      setPreviewState(null);
    } else {
      setPreviewState((prev) => {
        const newState = prev === null
          ? (selectedDSMs.includes(dsmId)
            ? selectedDSMs.filter((id) => id !== dsmId)
            : [...selectedDSMs, dsmId])
          : (prev.includes(dsmId)
            ? prev.filter((id) => id !== dsmId)
            : [...prev, dsmId]);
        
        return newState;
      });
    }
  };

  const handleFilterChange = (
    filterType: string,
    selectedOptions: MultiValue<FilterOption>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: selectedOptions as FilterOption[],
    }));
  };

  const removeFilter = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].filter((option) => option.value !== value),
    }));
  };

  const handleAdd = () => {
    const allIds = documents.map((dsm) => dsm.id);
    setSelectedDSMs((prevSelected) => {
      const newSelection = new Set([...prevSelected, ...allIds]);
      return Array.from(newSelection);
    });
    setPreviewState(null);
  };

  const handleClear = () => {
    setSelectedDSMs([]);
    setPreviewState(null);
  };

  const handlePreview = (action: 'add' | 'remove' | 'select' | 'clear') => {
    switch (action) {
      case 'add':
        setPreviewState(Array.from(new Set([...selectedDSMs, ...documents.map(dsm => dsm.id)])));
        break;
      case 'remove':
        setPreviewState(selectedDSMs.filter(id => !documents.map(dsm => dsm.id).includes(id)));
        break;
      case 'select':
        setPreviewState(documents.map(dsm => dsm.id));
        break;
      case 'clear':
        setPreviewState(null);
        break;
    }
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div
      ref={sidebarRef}
      className={`bg-[var(--secondary-bg-light)] dark:bg-[var(--secondary-bg-dark)] p-4 relative ${
        isCollapsed ? "overflow-hidden" : "overflow-hidden"
      } h-screen transition-all duration-300 ease-in-out flex flex-col`}
      style={{ 
        width: isCollapsed ? "3rem" : `${width}px`,
      }}
    >
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? "►" : "◄"}
      </button>

      <div
        className={`transition-opacity duration-300 ease-in-out flex-grow overflow-hidden ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
        style={{ height: `calc(100% - ${selectedItemsHeight}px)` }}
      >
        <h2 className="text-xl font-semibold mb-4">DSM Documents</h2>

        <Documents
          documents={documents}
          selectedDSMs={selectedDSMs}
          filters={filters}
          handleFilterChange={handleFilterChange}
          removeFilter={removeFilter}
          handleDSMSelection={handleDSMSelection}
          showUnselectedOnly={showUnselectedOnly}
          setShowUnselectedOnly={setShowUnselectedOnly}
          handleAdd={handleAdd}
          handleClear={handleClear}
          handlePreview={handlePreview}
          previewState={previewState}
        />
      </div>

      {/* SelectedItems at bottom */}
      <div className="flex-shrink-0">
        <SelectedItems
          selectedDSMs={selectedDSMs}
          documents={documents}
          previewState={previewState}
          isCollapsed={isCollapsed}
          onHeightChange={setSelectedItemsHeight}
        />
      </div>
    </div>
  );
};

export default Sidebar;