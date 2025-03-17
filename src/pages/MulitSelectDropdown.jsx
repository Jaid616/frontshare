import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const MultiSelectDropdown = ({ categories, formData, setFormData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleCategory = (categoryName) => {
    setFormData({
      ...formData,
      categories: formData.categories.includes(categoryName)
        ? formData.categories.filter((cat) => cat !== categoryName)
        : [...formData.categories, categoryName],
    });
  };

  const removeCategory = (categoryName) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((cat) => cat !== categoryName),
    });
  };

  return (
    <div className="relative w-[30rem]">
      {/* Selected items display */}
      <div
        className="min-h-[40px] p-2 border rounded bg-white cursor-pointer flex flex-wrap items-center gap-2"
        onClick={toggleDropdown}
      >
        {formData.categories.length > 0 ? (
          formData.categories.map((category) => (
            <span
              key={category}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {category}
              <X
                className="w-4 h-4 cursor-pointer hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCategory(category);
                }}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-500">Select categories...</span>
        )}
        <div className="ml-auto">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute w-full mt-1 border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-10"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {categories?.map((categoryId, categoryName) => {
            console.log("Category ID:", categoryId); // ✅ Console inside map

            return (
              <label
                key={categoryId}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.categories.includes(categoryId)}
                  onChange={() => toggleCategory(categoryId)}
                />
                {categoryId}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
