import api from "../api";
import Document from "./Document";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

interface DSM {
  id: number;
  name: string;
  generation: string;
  technology: string;
  category: string;
  platform: string;
  revisionVersion: string;
  customMark?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const Sidebar: React.FC = () => {
  const [width, setWidth] = useState(() =>
    parseInt(localStorage.getItem("sidebarWidth") || "256")
  );
  const [isResizing, setIsResizing] = useState(false);
  const [selectedDSMs, setSelectedDSMs] = useState<number[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [filters, setFilters] = useState<Record<string, FilterOption[]>>({
    generation: [],
    technology: [],
    category: [],
    platform: [],
  });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const documents = useMemo(() => api.getDocuments(), []);

  useEffect(() => {
    localStorage.setItem("sidebarWidth", width.toString());
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [width, isCollapsed]);

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && !isCollapsed && sidebarRef.current) {
      const newWidth = Math.max(
        384,
        Math.min(
          512,
          e.clientX - sidebarRef.current.getBoundingClientRect().left
        )
      );
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    if (sidebarRef.current) {
      sidebarRef.current.style.transition = "width 300ms ease-in-out";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isCollapsed) {
      setIsResizing(true);
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = "none";
      }
    }
  };

  const handleDSMSelection = (dsmId: number) => {
    setSelectedDSMs((prev) =>
      prev.includes(dsmId)
        ? prev.filter((id) => id !== dsmId)
        : [...prev, dsmId]
    );
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

  const handleSelectAll = () => {
    const allIds = filteredDSMs.map((dsm) => dsm.id);
    setSelectedDSMs(allIds);
  };

  const handleClear = () => {
    setSelectedDSMs([]);
  };

  const filteredDSMs = useMemo(() => {
    return documents.filter((dsm) =>
      Object.entries(filters).every(
        ([key, options]) =>
          options.length === 0 ||
          options.some((option) => option.value === dsm[key as keyof DSM])
      )
    );
  }, [documents, filters]);

  const selectStyles: StylesConfig<FilterOption, true> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "var(--bg-color)",
      borderColor: "var(--border-color)",
      minHeight: "30px",
      height: "30px",
    }),
    valueContainer: (styles) => ({
      ...styles,
      height: "30px",
      padding: "0 6px",
    }),
    input: (styles) => ({
      ...styles,
      color: "var(--text-color)",
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      height: "30px",
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--bg-color)",
      zIndex: 10,
      width: "auto",
      minWidth: "100%",
      left: 0,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "var(--primary-color)"
        : isFocused
        ? "var(--hover-color)"
        : "var(--bg-color)",
      color: "var(--text-color)",
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "var(--primary-color)",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "white",
      ":hover": {
        backgroundColor: "var(--primary-dark-color)",
        color: "white",
      },
    }),
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isCollapsed]);

  return (
    <div
      ref={sidebarRef}
      className={`bg-[var(--secondary-bg-light)] dark:bg-[var(--secondary-bg-dark)] p-4 relative ${
        isCollapsed ? "overflow-hidden" : "overflow-y-auto"
      } h-screen`}
      style={{ width: isCollapsed ? "3rem" : `${width}px` }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors z-10"
        aria-label={isCollapsed ? "Exband sidebar" : "collased sidebar"}
      >
        {isCollapsed ? "►" : "◄"}
      </button>

      <div
        className={`transition-opacity duration-300 ease-in-out ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          DSM Documents
        </h2>

        {Object.keys(filters).map((filterType) => (
        <div key={filterType} className="mb-3 flex items-center">
          <h3 className="font-semibold text-xs w-1/4 text-gray-800 dark:text-gray-200">
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:
          </h3>
          <div className="w-3/4 relative"> 
            <Select<FilterOption, true>
              isMulti
              options={Array.from(new Set(documents.map(dsm => dsm[filterType as keyof DSM]))).map(value => ({ value: String(value), label: String(value) }))}
              value={filters[filterType]}
              onChange={(selectedOptions) => handleFilterChange(filterType, selectedOptions)}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={selectStyles}
            />
          </div>
        </div>
      ))}

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

        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>

        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200 text-sm">
          Available DSMs:
        </h3>
        {filteredDSMs.map((dsm) => (
          <div key={dsm.id} className="mb-2">
            <Document
              name={dsm.name}
              checked={selectedDSMs.includes(dsm.id)}
              onClick={() => handleDSMSelection(dsm.id)}
            />
          </div>
        ))}
      </div>
      <div
        className={`absolute top-0 right-0 bottom-0 w-2 bg-transparent ${
          isCollapsed ? "" : "cursor-col-resize"
        }`}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Sidebar;
