import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, MoreVertical, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../config/dbConfig";
import { decodeToken } from "../DecodeToken";

const Categories = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const handleAddCategoryClose = () => {
    setAddCategoryDialogOpen(false);
    setNewCategory("");
  };

  const [phone, setPhone] = useState(null);
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
      }
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchItems = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items);
      }
    }
    fetchItems()
  }, [phone])

  useEffect(() => {
    const fetchCategories = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setCategories(existingDoc.categories || []);
      }
    }
    fetchCategories();
  }, [phone])

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const existingDoc = await db.get(phone);
      console.log("This is the new category", existingDoc)
      if (!existingDoc) {
        toast.error("No record found for this phone number.");
        return;
      }

      const categoryExists = existingDoc.categories?.some(
        (category) => category.toLowerCase() === newCategory.toLowerCase()
      );

      if (categoryExists) {
        toast.error("Category already exists.");
        return;
      }
      const updatedCategories = [
        ...(existingDoc.categories || []),
        newCategory,
      ];

      await db.put({ ...existingDoc, categories: updatedCategories });
      console.log(updatedCategories, "This is the Updated Categories")
      setCategories(updatedCategories);

      toast.success("Category added successfully!");
      handleAddCategoryClose();
    }
  };
  // Filter items based on selected category and search query
  useEffect(() => {
    let filtered = [...items];

    // Filter by selected category
    if (selectedCategory) {
      if (selectedCategory === "uncategorized") {
        filtered = items.filter(
          (item) => !item.categories || item.categories.length === 0
        );
      } else {
        filtered = items.filter(
          (item) =>
            item.categories &&
            item.categories.some((cat) =>
              typeof cat === "object"
                ? cat.primary === selectedCategory
                : cat === selectedCategory
            )
        );
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, items, searchQuery]);

  const handleAddCategoryOpen = () => setAddCategoryDialogOpen(true);

  // Filter categories based on search
  const filteredCategories = categories?.filter((category) =>
    category?.toLowerCase()
      .includes(categorySearchQuery.toLowerCase())
  );

  // Get count of uncategorized items
  const getUncategorizedItemsCount = () => {
    return items.filter(
      (item) => !item.categories || item.categories.length === 0
    ).length;
  };

  // Calculate items count for each category
  const getCategoryItemCount = (categoryName) => {
    return items.filter(
      (item) =>
        item.categories &&
        item.categories.some((cat) =>
          typeof cat === "object"
            ? cat.primary === categoryName
            : cat === categoryName
        )
    ).length;
  };

  // Calculate total stock value for displayed items
  const calculateTotalStockValue = () => {
    return filteredItems.reduce((total, item) => {
      const itemValue =
        typeof item.quantity === "object"
          ? (item.quantity.primary || 0) * (item.atPrice || 0)
          : (item.quantity || 0) * (item.atPrice || 0);
      return total + itemValue;
    }, 0);
  };

  // Safely get quantity value
  const getQuantityValue = (item) => {
    if (!item.openingQuantity) return 0;
    return item.openingQuantity;
  };

  const handleCategoryClick = (category) => {
    if (
      selectedCategory &&
      (selectedCategory === "uncategorized"
        ? category === "uncategorized"
        : selectedCategory.categoryId === category.categoryId)
    ) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
        setCategorySearchQuery(""); // Clear search on exit
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-72 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2">
            {/* Conditional Rendering: Search Box or Button */}
            {isSearching ? (
              <div ref={searchRef} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search categories"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-200 pl-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  className="flex-1 flex justify-center items-center gap-2 rounded-md bg-orange-100 text-orange-600 px-4 py-2 text-sm font-medium transition hover:bg-orange-200"
                  onClick={handleAddCategoryOpen}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
                <button
                  onClick={() => setIsSearching(true)}
                  className="rounded-md p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-2 px-4 font-medium">CATEGORY</th>
                <th className="pb-2 px-4 font-medium">ITEMS</th>
                <th className="pb-2 px-4"></th>
              </tr>
            </thead>
          </table>

          <div className="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <table className="w-full border-collapse">
              <tbody>
                {/* Uncategorized Items Row */}
                <tr
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedCategory === "uncategorized" ? "bg-orange-50" : ""
                  }`}
                  onClick={() => handleCategoryClick("uncategorized")}
                >
                  <td className="px-4 py-2 text-sm text-gray-900">
                    Items not in any Category
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {getUncategorizedItemsCount()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500"></td>
                </tr>
                {/* Regular Categories */}
                {filteredCategories?.map((category, index) => (
                  <tr
                    key={index}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      selectedCategory?.categoryId === category.categoryId
                        ? "bg-orange-50"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {category}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {getCategoryItemCount(category)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      <button
                        className="text-gray-400 hover:text-gray-600 ml-2"
                        onClick={() => toggleMenu(index)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === index && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            View/Edit
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              {selectedCategory === "uncategorized"
                ? "ITEMS NOT IN ANY CATEGORY"
                : selectedCategory
                ? selectedCategory
                : "ALL ITEMS"}
            </h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">
                ITEMS ({filteredItems.length})
              </h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  Total Value: ₹ {calculateTotalStockValue().toFixed(2)}
                </span>
                {selectedCategory && selectedCategory !== "uncategorized" && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
                    Move To This Category
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2 font-medium">
                      <div className="flex items-center gap-1">
                        NAME
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="pb-2 font-medium">
                      <div className="flex items-center gap-1">
                        QUANTITY
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="pb-2 font-medium text-right">
                      <div className="flex items-center gap-1 justify-end">
                        STOCK VALUE
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>

              <div className="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                <table className="w-full">
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="py-2 text-sm text-gray-900">
                          {item.itemName}
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          {item.openingQuantity}
                        </td>
                        <td className="py-2 text-sm text-gray-900 text-right">
                          ₹{" "}
                          {(
                            getQuantityValue(item) * (item.atPrice || 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {addCategoryDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <input
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={handleAddCategoryClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
