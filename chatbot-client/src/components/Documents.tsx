import React, { useState } from 'react';
import { DSM } from "../types";
import Document from "./Document";
import Select, { MultiValue, StylesConfig } from "react-select";

interface FilterOption {
  value: string;
  label: string;
}

interface DocumentsProps {
  documents: DSM[];
  selectedDSMs: number[];
  filters: Record<string, FilterOption[]>;
  handleFilterChange: (filterType: string, selectedOptions: MultiValue<FilterOption>) => void;
  removeFilter: (filterType: string, value: string) => void;
  handleDSMSelection: (dsmId: number, isClick?: boolean) => void;
  showUnselectedOnly: boolean;
  setShowUnselectedOnly: (value: boolean) => void;
  handleAdd: () => void;
  handleClear: () => void;
  handlePreview: (action: 'add' |'clear') => void;
  previewState: number[] | null;
}

const Documents: React.FC<DocumentsProps> = ({
  documents,
  selectedDSMs,
  filters,
  handleFilterChange,
  removeFilter,
  handleDSMSelection,
  showUnselectedOnly,
  setShowUnselectedOnly,
  handleAdd,
  handleClear,
  handlePreview,
  previewState,
}) => {
  const filteredDSMs: DSM[] = documents.filter((dsm) =>
    Object.entries(filters).every(
      ([key, options]) =>
        options.length === 0 ||
        options.some((option) => option.value === dsm[key as keyof DSM])
    )
  );

  const displayedDSMs = showUnselectedOnly
    ? filteredDSMs.sort((a, b) => a.name.localeCompare(b.name)).filter((dsm) => !selectedDSMs.includes(dsm.id))
    : filteredDSMs.sort((a, b) => a.name.localeCompare(b.name));

    const customStyles: StylesConfig<FilterOption, true> = {
      control: (provided) => ({
        ...provided,
        minHeight: '30px',
        height: '30px',
      }),
      valueContainer: (provided) => ({
        ...provided,
        height: '30px',
        padding: '0 6px',
      }),
      input: (provided) => ({
        ...provided,
        margin: '0px',
      }),
      indicatorsContainer: (provided) => ({
        ...provided,
        height: '30px',
      }),
      option: (provided) => ({
        ...provided,
        padding: '4px 8px',
      }),
      multiValue: (provided) => ({
        ...provided,
        margin: '2px',
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        padding: '0 4px',
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        padding: '0 4px',
      }),
    };

  return (
    <div className="flex flex-col h-full">
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
              styles={customStyles}
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
          onChange={() => setShowUnselectedOnly(!showUnselectedOnly)}
          className="form-checkbox h-4 w-4"
        />
        <label className="text-sm">Show Unselected DSM Only</label>
      </div>
      
      <div className="space-x-2 mb-2">
          <button
            title="Add all filtered items into selection"
            onClick={handleAdd}
            onMouseEnter={() => handlePreview('add')}
            onMouseLeave={() => handlePreview('clear')}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Add ▼
          </button>
          <button
            title="Clear all selected items"
            onClick={handleClear}
            onMouseEnter={() => handlePreview('clear')}
            onMouseLeave={() => handlePreview('clear')}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white shadow-md hover:bg-gray-600 transition-colors"
          >
            Clear ▲
          </button>
        </div>

      <div className="flex-grow overflow-y-auto">
        <h3 className="font-semibold mb-2 text-base">Available DSMs:</h3>

        {displayedDSMs.map((dsm) => (
          <div
            key={dsm.id}
            className="mb-2"
            onMouseEnter={() => handleDSMSelection(dsm.id)}
            onMouseLeave={() => handlePreview('clear')}
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
  );
};

export default Documents;