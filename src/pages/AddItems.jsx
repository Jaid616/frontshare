import React, { useEffect, useState } from "react";
import { Search, Camera, X, Settings } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { serviceUrl } from "../Services/url";
import MultiSelectDropdown from "./MulitSelectDropdown.jsx";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../DecodeToken.js";
import db from "../config/dbConfig.js";

const AddItems = ({
  showItem,
  handleModelClose,
  handleAddItems,
  setShowItem,
  isEdit,
  currentItem,
}) => {
  const [items, setItems] = useState([]);
  const [isUnique, setIsUnique] = useState(true);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const [primaryUnits, setPrimaryUnits] = useState();
  const [secondaryUnits, setSecondaryUnits] = useState();
  const [isProduct, setIsProduct] = useState(true);
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [primaryUnit, setPrimaryUnit] = useState("");
  const [secondaryUnit, setSecondaryUnit] = useState("");
  const [categories, setCategories] = useState([]);
  const [updatedPrimaryUnits, setUpdatedPrimaryUnits] = useState([
    { name: "BAGS" },
    { name: "BOTTLES" },
    { name: "BOX" },
    { name: "BUNDLES" },
    { name: "CANS" },
    { name: "CARTONS" },
    { name: "DOZENS" },
    { name: "GRAMMES" },
    { name: "KILOGRAMS" },
    { name: "LITRE" },
    { name: "MILLILITRE" },
    { name: "NUMBERS" },
    { name: "PACKS" },
    { name: "PAIRS" },
    { name: "PIECES" },
    { name: "QUINTAL" },
    { name: "ROLLS" },
    { name: "SQUARE FEET" },
  ]);

  const [updatedSecondaryUnits, setUpdatedSecondaryUnits] = useState([
    { name: "BAGS" },
    { name: "BOTTLES" },
    { name: "BOX" },
    { name: "BUNDLES" },
    { name: "CANS" },
    { name: "CARTONS" },
    { name: "DOZENS" },
    { name: "GRAMMES" },
    { name: "KILOGRAMS" },
    { name: "LITRE" },
    { name: "MILLILITRE" },
    { name: "NUMBERS" },
    { name: "PACKS" },
    { name: "PAIRS" },
    { name: "PIECES" },
    { name: "QUINTAL" },
    { name: "ROLLS" },
    { name: "SQUARE FEET" },
  ]);

  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [newUnit, setNewUnit] = useState("");
  const [isAddingPrimaryUnit, setIsAddingPrimaryUnit] = useState(true);
  const [taxRates, setTaxRates] = useState([]);
  // const [userEmail, setUserEmail] = useState();
  useEffect(() => {
    if (primaryUnits && secondaryUnits) {
      const updatedPrimary = [
        ...new Set([...updatedPrimaryUnits, ...primaryUnits]),
      ];
      const updatedSecondary = [
        ...new Set([...updatedSecondaryUnits, ...secondaryUnits]),
      ];
      setUpdatedPrimaryUnits(updatedPrimary);
      setUpdatedSecondaryUnits(updatedSecondary);
    }
  }, [
    primaryUnits,
    secondaryUnits,
    updatedPrimaryUnits,
    updatedSecondaryUnits,
  ]);

  const [phone, setPhone] = useState();
  useEffect(() => {
    const fetchPhone = async () => {
      const decodedPhone = await decodeToken();
      setPhone(decodedPhone);
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items);
      }
    };
    fetchItems();
  }, [phone]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        console.log(existingDoc.categories, "These are the Categories");
        setCategories(existingDoc.categories);
      }
    };
    fetchCategories();
  }, [phone]);

  const handleAddNewUnit = async () => {
    if (!newUnit.trim()) return; // Prevent empty input

    try {
      const existingDoc = await db.get(phone);

      if (!existingDoc) {
        toast.error("No record found for this phone number.");
        return;
      }

      // Initialize units object if not present
      if (!existingDoc.units) {
        existingDoc.units = { primaryUnits: [], secondaryUnits: [] };
      }

      // Determine unit type (Primary/Secondary)
      const unitArray = isAddingPrimaryUnit
        ? existingDoc.units.primaryUnits
        : existingDoc.units.secondaryUnits;

      // Check if the unit already exists
      const unitExists = unitArray.some(
        (unit) => unit.toLowerCase() === newUnit.toLowerCase()
      );

      if (unitExists) {
        toast.error("Unit already exists.");
        return;
      }

      // Add new unit to the appropriate array
      if (isAddingPrimaryUnit) {
        existingDoc.units.primaryUnits.push(newUnit);
      } else {
        existingDoc.units.secondaryUnits.push(newUnit);
      }

      // Update database
      await db.put({ ...existingDoc });

      // Update UI state
      setPrimaryUnit(existingDoc.units.primaryUnits);
      setSecondaryUnit(existingDoc.units.secondaryUnits);

      toast.success("Unit added successfully!");
      handleAddUnitClose();
    } catch (error) {
      console.error("Error adding unit:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    itemHSN: "",
    categories: [],
    itemCode: "",
    quantity: {
      primary: "",
      secondary: "",
    },
    conversionRate: "",
    salePrice: "",
    primaryUnit: "",
    secondaryUnit: "",
    salePriceType: "Without Tax",
    saleDiscount: "",
    saleDiscountType: "Percentage",
    wholesalePrice: "",
    wholesalePriceType: "Without Tax",
    minWholesaleQty: "",
    purchasePrice: "",
    purchasePriceType: "Without Tax",
    taxRate: "",
    openingPrimaryQuantity: "",
    openingSecondaryQuantity: "",
    atPrice: "",
    asOfDate: "2024-12-23",
    minStockToMaintain: "",
    location: "",
  });

  useEffect(() => {
    if (isEdit && currentItem) {
      setFormData(currentItem);
    } else {
      setFormData({
        itemName: "",
        itemHSN: "",
        categories: [],
        itemCode: "",
        quantity: {
          primary: "",
          secondary: "",
        },
        conversionRate: "",
        salePrice: "",
        salePriceType: "Without Tax",
        saleDiscount: "",
        saleDiscountType: "Percentage",
        wholesalePrice: "",
        wholesalePriceType: "Without Tax",
        minWholesaleQty: "",
        purchasePrice: "",
        purchasePriceType: "Without Tax",
        taxRate: "",
        openingPrimaryQuantity: "",
        openingSecondaryQuantity: "",
        atPrice: "",
        asOfDate: "2024-12-23",
        minStockToMaintain: "",
        location: "",
      });
    }
  }, [isEdit, showItem]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const response = await axios.get(`${serviceUrl}/auth/getCountry`, {
          params: { email: decoded.email },
        });

        const allTaxRates = response?.data?.country?.taxRates || [];

        const uniqueTaxRates = allTaxRates.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.name === value.name && t.rate === value.rate
            )
        );

        setTaxRates(uniqueTaxRates);

        if (uniqueTaxRates.length > 0) {
          handleInputChange(
            "taxRate",
            `${uniqueTaxRates[0].name} ${uniqueTaxRates[0].rate}%`
          );
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
    fetchCountry();
  }, []);

  const handleTabChange = (newValue) => {
    setTab(newValue);
  };

  const handleCheckItemName = async (itemName) => {
    try {
      const existingDoc = await db.get(phone);

      if (!existingDoc || !existingDoc.items) {
        return false;
      }

      const itemExists = existingDoc.items.some(
        (item) => item.itemName === itemName
      );

      setIsUnique(!itemExists);
    } catch (error) {
      console.error("Error checking item name:", error);
      return false;
    }
  };

  const handleUnitDialogOpen = () => setUnitDialogOpen(true);
  const handleUnitDialogClose = () => setUnitDialogOpen(false);
  const handleAddUnitOpen = (isPrimary = true) => {
    setIsAddingPrimaryUnit(isPrimary);
    setAddUnitDialogOpen(true);
  };
  const handleAddUnitClose = () => {
    setAddUnitDialogOpen(false);
    setNewUnit("");
  };

  const handleAddConversionRate = async () => {
    if (primaryUnit && conversionRate && secondaryUnit) {
      try {
        const existingDoc = await db.get(phone);

        if (!existingDoc.conversion) {
          existingDoc.conversion = [];
        }

        // Get all existing conversions for same primaryUnit & secondaryUnit
        const matchingConversions = existingDoc.conversion.filter(
          (c) =>
            c.primaryUnit === primaryUnit && c.secondaryUnit === secondaryUnit
        );

        if (matchingConversions.length > 0) {
          // Calculate the average conversion rate of all duplicates
          const totalRate = matchingConversions.reduce(
            (sum, c) => sum + c.conversionRate,
            0
          );
          const avgRate =
            (totalRate + conversionRate) / (matchingConversions.length + 1);

          // Remove all existing duplicates
          existingDoc.conversion = existingDoc.conversion.filter(
            (c) =>
              !(
                c.primaryUnit === primaryUnit &&
                c.secondaryUnit === secondaryUnit
              )
          );

          // Add the merged conversion with the average rate
          existingDoc.conversion.push({
            primaryUnit,
            secondaryUnit,
            conversionRate: conversionRate,
          });
        } else {
          // Add new conversion if no duplicates exist
          existingDoc.conversion.push({
            primaryUnit,
            secondaryUnit,
            conversionRate,
          });
        }

        await db.put(existingDoc);

        setUnitDialogOpen(false);
        toast.success("Conversion rate updated successfully!");
      } catch (error) {
        console.error("Error updating conversion rate:", error);
        toast.error("Failed to add conversion rate.");
      }
    }
  };

  const handleAddCategoryOpen = () => setAddCategoryDialogOpen(true);
  const handleAddCategoryClose = () => {
    setAddCategoryDialogOpen(false);
    setNewCategory("");
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    handleInputChange(
      "categories",
      typeof value === "string" ? value.split(",") : value
    );
  };
  const [conversionRate, setConversionRate] = useState("0");
  const handleSave = () => {
    const savedData = {
      ...formData,
      isProduct,
      quantity: {
        primary: primaryUnit,
        secondary: secondaryUnit,
      },
      conversionRate,
    };
    handleAddItems(savedData);
    handleModelClose();
  };

  const generateUniqueCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    return timestamp + randomNum;
  };

  const handleAssignCode = () => {
    setFormData({
      ...formData,
      itemCode: generateUniqueCode(),
    });
  };

  const handleSaveAndNew = () => {
    handleSave();
    setFormData({
      itemName: "",
      itemHSN: "",
      categories: [],
      itemCode: "",
      salePrice: "",
      salePriceType: "Without Tax",
      saleDiscount: "",
      saleDiscountType: "Percentage",
      wholesalePrice: "",
      wholesalePriceType: "Without Tax",
      minWholesaleQty: "",
      purchasePrice: "",
      purchasePriceType: "Without Tax",
      taxRate:
        taxRates.length > 0 ? `${taxRates[0].name} ${taxRates[0].rate}%` : "",
      openingPrimaryQuantity: "",
      atPrice: "",
      asOfDate: "2024-12-23",
      minStockToMaintain: "",
      location: "",
    });
    setPrimaryUnit("");
    setSecondaryUnit("");
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const existingDoc = await db.get(phone);

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
      console.log(updatedCategories, "This is the Updated Categories");
      setCategories(updatedCategories);

      toast.success("Category added successfully!");

      handleAddCategoryClose();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow h-[90vh]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h6 className="text-sm font-semibold">Add Item</h6>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isProduct ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Product
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!isProduct}
                onChange={() => setIsProduct(!isProduct)}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span
              className={`text-sm ${
                !isProduct ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Service
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Settings size={20} onClick={() => navigate("/settings")} />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleModelClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-start">
          <div>
            <input
              className="px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Item Name"
              required
              value={formData.itemName}
              onBlur={(e) => handleCheckItemName(formData.itemName)}
              onChange={(e) => handleInputChange("itemName", e.target.value)}
            />

            {/* Show error message if isUnique is false */}
            {!isUnique && (
              <span className="text-red-500 text-xs mt-1 block">
                Item name already exists
              </span>
            )}
          </div>

          <input
            className="px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
            placeholder="Item HSN"
            value={formData.itemHSN}
            onChange={(e) => handleInputChange("itemHSN", e.target.value)}
          />

          <div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              onClick={handleUnitDialogOpen}
            >
              Select Unit
            </button>
            {/* Text below the Select Unit button */}
            {primaryUnit && secondaryUnit && conversionRate && (
              <p className="text-xs mt-1 font-bold text-blue-800">
                1 {primaryUnit} = {conversionRate} {secondaryUnit}
              </p>
            )}
          </div>

          <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-2">
            <Camera size={16} />
            Add Item Image
          </button>
        </div>

        <div className="flex gap-4">
          <MultiSelectDropdown
            categories={categories}
            formData={formData}
            setFormData={setFormData}
          />
          <button
            onClick={handleAddCategoryOpen}
            className="text-blue-600 text-sm hover:text-blue-700"
          >
            + Add New Category
          </button>
          <div className="relative">
            {!formData.itemCode ? (
              <button
                onClick={handleAssignCode}
                className="w-full px-3 py-2 border rounded text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:border-blue-500"
              >
                Assign Code
              </button>
            ) : (
              <input
                value={formData.itemCode}
                disabled={isEdit}
                onChange={(e) => handleInputChange("itemCode", e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter Code"
                required
              />
            )}
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              className={`py-2 text-sm font-medium ${
                tab === 0
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange(0)}
            >
              Pricing
            </button>
            <button
              className={`py-2 text-sm font-medium ${
                tab === 1
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange(1)}
            >
              Stock
            </button>
          </nav>
        </div>

        {tab === 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-[24px]">
              <div className="flex gap-4 w-[525px]">
                <input
                  className="px-3 w-full py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Sale Price"
                  value={formData.salePrice}
                  onChange={(e) =>
                    handleInputChange("salePrice", e.target.value)
                  }
                />
                <select
                  className="px-3 py-2 w-[170px] border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={formData.salePriceType}
                  onChange={(e) =>
                    handleInputChange("salePriceType", e.target.value)
                  }
                >
                  <option value="Without Tax">Without Tax</option>
                  <option value="With Tax">With Tax</option>
                </select>
              </div>
              <div className="flex gap-4 w-[525px]">
                <input
                  className="px-3 w-full py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Wholesale Price"
                  value={formData.wholesalePrice}
                  onChange={(e) =>
                    handleInputChange("wholesalePrice", e.target.value)
                  }
                />
                <select
                  className="px-3 w-[170px] py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={formData.wholesalePriceType}
                  onChange={(e) =>
                    handleInputChange("wholesalePriceType", e.target.value)
                  }
                >
                  <option value="Without Tax">Without Tax</option>
                  <option value="With Tax">With Tax</option>
                </select>
              </div>
            </div>

            <div className="flex gap-[24px]">
              <div className="flex gap-4 w-[525px]">
                <input
                  className="px-3 w-full py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Discount On Sale Price"
                  value={formData.saleDiscount}
                  onChange={(e) =>
                    handleInputChange("saleDiscount", e.target.value)
                  }
                />
                <select
                  className="px-3 w-[170px] py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={formData.saleDiscountType}
                  onChange={(e) =>
                    handleInputChange("saleDiscountType", e.target.value)
                  }
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Amount">Amount</option>
                </select>
              </div>
              <input
                className="px-3 py-2 w-[525px] border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Minimum Wholesale Quantity"
                value={formData.minWholesaleQty}
                onChange={(e) =>
                  handleInputChange("minWholesaleQty", e.target.value)
                }
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <h6 className="text-sm font-semibold mb-2">Purchase Price</h6>
                <input
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500 mb-2"
                  placeholder="Purchase Price"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    handleInputChange("purchasePrice", e.target.value)
                  }
                />
                <select
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={formData.purchasePriceType}
                  onChange={(e) =>
                    handleInputChange("purchasePriceType", e.target.value)
                  }
                >
                  <option value="Without Tax">Without Tax</option>
                  <option value="With Tax">With Tax</option>
                </select>
              </div>
              <div className="flex-1">
                <h6 className="text-sm font-semibold mb-2">Taxes</h6>
                <select
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange("taxRate", e.target.value)}
                >
                  <option value="">Select Tax Rate</option>
                  {taxRates.map((tax, index) => (
                    <option key={index} value={`${tax.name} ${tax.rate}%`}>
                      {tax.name} {tax.rate}%
                    </option>
                  ))}
                  <option value="Exempt">Exempt</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Opening Primary Quantity"
                value={formData.openingPrimaryQuantity}
                onChange={(e) =>
                  handleInputChange("openingPrimaryQuantity", e.target.value)
                }
              />
              <input
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Opening Secondary Quantity"
                value={formData.openingSecondaryQuantity}
                onChange={(e) =>
                  handleInputChange("openingSecondaryQuantity", e.target.value)
                }
              />
              <input
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="At Price"
                value={formData.atPrice}
                onChange={(e) => handleInputChange("atPrice", e.target.value)}
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                value={formData.asOfDate}
                onChange={(e) => handleInputChange("asOfDate", e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <input
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Min Stock To Maintain"
                value={formData.minStockToMaintain}
                onChange={(e) =>
                  handleInputChange("minStockToMaintain", e.target.value)
                }
              />
              <input
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4 fixed bottom-[11px] w-[80%]">
        <button
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={handleSaveAndNew}
        >
          Save & New
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          onClick={handleSave}
          disabled={!isUnique}
        >
          Save
        </button>
      </div>

      {/* Unit Selection Dialog */}
      {unitDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Select Units</h2>
            <div className="flex gap-2 justify-between">
              <div>
                <select
                  className="w-[195px] px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={primaryUnit}
                  onChange={(e) => setPrimaryUnit(e.target.value)}
                >
                  <option value="">Select Primary Unit</option>
                  {updatedPrimaryUnits?.map((unit, index) => (
                    <option key={index} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="w-[195px] px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  value={secondaryUnit}
                  onChange={(e) => setSecondaryUnit(e.target.value)}
                >
                  <option value="">Select Secondary Unit</option>
                  {updatedSecondaryUnits?.map((unit, index) => (
                    <option key={index} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {secondaryUnit && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      1 {primaryUnit} ={" "}
                    </span>
                    <input
                      type="number"
                      className="w-20 mx-2 px-2 py-1 border rounded text-sm focus:outline-none focus:border-blue-500"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                      placeholder="0"
                    />
                    <span className="text-sm font-medium">{secondaryUnit}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={handleUnitDialogClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={handleAddConversionRate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Unit Dialog */}
      {addUnitDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Add New {isAddingPrimaryUnit ? "Primary" : "Secondary"} Unit
            </h2>
            <input
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder={`New ${
                isAddingPrimaryUnit ? "Primary" : "Secondary"
              } Unit`}
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={handleAddUnitClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={handleAddNewUnit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Dialog */}
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

export default AddItems;
