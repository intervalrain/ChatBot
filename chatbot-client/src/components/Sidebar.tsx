import { getDocuments } from "../api";
import { DSM } from "../types";
import Document from "./Document";
import SelectedItems from "./SelectedItems";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

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
    const allIds = filteredDSMs.map((dsm) => dsm.id);
    setSelectedDSMs((prevSelected) => {
      const newSelection = new Set([...prevSelected, ...allIds]);
      return Array.from(newSelection);
    });
    setPreviewState(null);
  };

  const handleRemove = () => {
    const filteredIds = filteredDSMs.map((dsm) => dsm.id);
    setSelectedDSMs((prevSelected) =>
      prevSelected.filter((id) => !filteredIds.includes(id))
    );
    setPreviewState(null);
  };

  const handleSelect = () => {
    const allIds = filteredDSMs.map((dsm) => dsm.id);
    setSelectedDSMs(allIds);
    setPreviewState(null);
  };

  const handleClear = () => {
    setSelectedDSMs([]);
    setPreviewState(null);
  };

  const handleShowUnselectedOnlyCheckboxChange = () => {
    setShowUnselectedOnly(!showUnselectedOnly);
  };

  const handlePreview = (action: 'add' | 'remove' | 'select' | 'clear') => {
    switch (action) {
      case 'add':
        setPreviewState(Array.from(new Set([...selectedDSMs, ...filteredDSMs.map(dsm => dsm.id)])));
        break;
      case 'remove':
        setPreviewState(selectedDSMs.filter(id => !filteredDSMs.map(dsm => dsm.id).includes(id)));
        break;
      case 'select':
        setPreviewState(filteredDSMs.map(dsm => dsm.id));
        break;
      case 'clear':
        setPreviewState([]);
        break;
    }
  };

  const filteredDSMs: DSM[] = useMemo(() => {
    return documents.filter((dsm) =>
      Object.entries(filters).every(
        ([key, options]) =>
          options.length === 0 ||
          options.some((option) => option.value === dsm[key as keyof DSM])
      )
    );
  }, [documents, filters]);

  const displayedDSMs = showUnselectedOnly
    ? filteredDSMs.sort((a, b) => a.name.localeCompare(b.name)).filter((dsm) => !selectedDSMs.includes(dsm.id))
    : filteredDSMs.sort((a, b) => a.name.localeCompare(b.name));

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={`bg-[var(--secondary-bg-light)] dark:bg-[var(--secondary-bg-dark)] p-4 relative ${
          isCollapsed ? "overflow-hidden" : "overflow-y-auto"
        } h-screen transition-all duration-300 ease-in-out`}
        style={{ 
          width: isCollapsed ? "3rem" : `${width}px`,
          paddingBottom: isCollapsed ? '0' : '40vh'  // 為 SelectedItems 預留空間
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
          className={`transition-opacity duration-300 ease-in-out ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <h2 className="text-3xl font-semibold mb-4">DSM Documents</h2>

          {/* Filter options */}
          {Object.keys(filters).map((filterType) => (
            <div key={filterType} className="mb-2 flex items-center">
              <h3 className="font-semibold text-sm w-1/4 text-right px-1">
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:
              </h3>
              <div className="w-3/4 relative">
                <Select<FilterOption, true>
                  isMulti
                  options={Array.from(
                    new Set(documents.map((dsm) => dsm[filterType as keyof DSM]))
                  )
                  .sort((a, b) => String(a).localeCompare(String(b)))
                  .map((value) => ({
                    value: String(value),
                    label: String(value),
                  }))}
                  value={filters[filterType]}
                  onChange={(selectedOptions) =>
                    handleFilterChange(filterType, selectedOptions)
                  }
                  className="react-select-container text-sm text-black"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          ))}

          {/* Labels of filter options */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).flatMap(([filterType, options]) =>
              options.map((option) => (
                <span
                  key={`${filterType}-${option.value}`}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {option.label}
                  <button
                    onClick={() => removeFilter(filterType, option.value)}
                    className="ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <hr />

          {/* Show selected only checkbox */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={showUnselectedOnly}
              onChange={handleShowUnselectedOnlyCheckboxChange}
              className="form-checkbox h-4 w-4"
            />
            <label className="text-sm">Show Unselected DSM Only</label>
          </div>

          <div className="flex-grow overflow-y-auto">
            <h3 className="font-semibold mb-2 text-base">Available DSMs:</h3>

            {displayedDSMs.map((dsm) => (
              <div
                key={dsm.id}
                className="mb-2"
                onMouseEnter={() => handleDSMSelection(dsm.id)}
                onMouseLeave={() => setPreviewState(null)}
              >
                <Document
                  name={dsm.name}
                  checked={selectedDSMs.includes(dsm.id)}
                  preview={
                    previewState
                      ? previewState.includes(dsm.id) &&
                        !selectedDSMs.includes(dsm.id)
                      : false
                  }
                  onClick={() => handleDSMSelection(dsm.id, true)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SelectedItems fix at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out" 
        style={{ 
          width: isCollapsed ? "3rem" : `${width}px`,
        }}
      >
        <SelectedItems
          selectedDSMs={selectedDSMs}
          documents={documents}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onSelect={handleSelect}
          onClear={handleClear}
          previewState={previewState}
          isCollapsed={isCollapsed}
          onPreview={handlePreview}
        />
      </div>
    </>
  );
};

export default Sidebar;
