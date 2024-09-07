import React, { useState } from "react";

interface PdfType {
  [key: string]: string[];
}

const pdfTypes: PdfType = {
  All: ["doc1.pdf", "doc2.pdf", "doc3.pdf", "doc4.pdf"],
  Type1: ["doc1.pdf", "doc2.pdf"],
  Type2: ["doc3.pdf", "doc4.pdf"],
};

const Sidebar: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setSelectedPdfs(pdfTypes[newType]);
  };

  const handlePdfSelection = (pdf: string) => {
    setSelectedPdfs((prev) =>
      prev.includes(pdf) ? prev.filter((p) => p !== pdf) : [...prev, pdf]
    );
  };

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 h-screen">
      <h2 className="text-xl font-bold mb-4">DSM Documents</h2>
      <select
        value={selectedType}
        onChange={handleTypeChange}
        className="w-full p-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
      >
        {Object.keys(pdfTypes).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div>
        <h3 className="font-semibold mb-2">Available PDFs:</h3>
        {pdfTypes[selectedType].map((pdf) => (
          <div key={pdf} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={pdf}
              checked={selectedPdfs.includes(pdf)}
              onChange={() => handlePdfSelection(pdf)}
              className="mr-2"
            />
            <label htmlFor={pdf}>{pdf}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
