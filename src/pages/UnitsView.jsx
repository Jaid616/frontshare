import React, { useEffect, useState } from "react";
import { Search, Plus, MoreVertical, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import db from "../config/dbConfig.js";
import { decodeToken } from "../DecodeToken.js";

const UnitsView = () => {
  const [units, setUnits] = useState([]);
  const [combinedUnits, setCombinedUnits] = useState([]);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [filteredConversions, setFilteredConversions] = useState([]);
  const [conversionData, setConversionData] = useState({
    baseUnit: "",
    rate: "",
    secondaryUnit: "",
  });
  const [newUnitData, setNewUnitData] = useState({
    name: "",
    type: "primary",
  });

  const [primaryUnits, setPrimaryUnits] = useState([]);
  const [secondaryUnits, setSecondaryUnits] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [items, setItems] = useState([]);
  const [phone, setPhone] = useState(null);

  const [defaultPrimaryUnits, setDefaultPrimaryUnits] = useState([
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

  const [defaultSecondaryUnits, setDefaultSecondaryUnits] = useState([
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

  useEffect(() => {
    const fetchPhone = async () => {
      const decodedPhone = await decodeToken();
      setPhone(decodedPhone);
    };

    fetchPhone();
  }, []);

  // Fetch units from local database
  const fetchUnitsFromLocalDB = async () => {
    if (!phone) return;

    try {
      const existingDoc = await db.get(phone).catch(() => null);

      if (existingDoc) {
        // Set units from the local database
        setPrimaryUnits(existingDoc.units?.primaryUnit || []);
        setSecondaryUnits(existingDoc.units?.secondaryUnit || []);
        setConversions(existingDoc.units?.conversions || []);
      } else {
        // Initialize with default values if document doesn't exist
        setPrimaryUnits([]);
        setSecondaryUnits([]);
        setConversions([]);
      }
    } catch (error) {
      console.error("Error fetching units from local DB:", error);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchUnitsFromLocalDB();
    }
  }, [phone]);

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
    // Combine default units with local units
    const allUnits = [
      ...defaultPrimaryUnits,
      ...defaultSecondaryUnits,
      ...primaryUnits,
      ...secondaryUnits,
    ];

    // Create a unique list of units by name
    const uniqueUnits = allUnits.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setUnits(uniqueUnits);
    setCombinedUnits(uniqueUnits);
  }, [
    defaultPrimaryUnits,
    defaultSecondaryUnits,
    primaryUnits,
    secondaryUnits,
  ]);

  useEffect(() => {
    if (selectedUnit && conversions) {
      const filtered = conversions.filter(
        (conversion) => conversion.primaryUnit === selectedUnit.name
      );
      setFilteredConversions(filtered);
    } else {
      setFilteredConversions([]);
    }
  }, [selectedUnit, conversions]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setUnits(combinedUnits);
      return;
    }

    const filtered = combinedUnits.filter((unit) =>
      unit.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUnits(filtered);
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  // Function to add a primary or secondary unit
  const handleAddUnit = async () => {
    if (!newUnitData.name.trim()) {
      toast.error("Unit name is required");
      return;
    }

    const unitName = newUnitData.name.toUpperCase();
    const unitType = newUnitData.type;

    try {
      // Get existing document or create a new one
      const existingDoc = await db.get(phone);

      // Ensure units object exists
      if (!existingDoc.units) {
        existingDoc.units = {
          primaryUnit: [],
          secondaryUnit: [],
          conversions: [],
        };
      }

      // Ensure arrays exist
      existingDoc.units.primaryUnit = existingDoc.units.primaryUnit || [];
      existingDoc.units.secondaryUnit = existingDoc.units.secondaryUnit || [];

      // Check if unit already exists
      const isUnitExists =
        existingDoc.units.primaryUnit.some((unit) => unit.name === unitName) ||
        existingDoc.units.secondaryUnit.some((unit) => unit.name === unitName);

      if (isUnitExists) {
        toast.error("Unit already exists");
        return;
      }

      // Clone existingDoc before modifying
      let updatedDoc = { ...existingDoc.units };

      // Add unit to the respective category (storing as { name: unitName })
      if (unitType === "primary") {
        updatedDoc.primaryUnit = [
          ...updatedDoc.primaryUnit,
          { name: unitName },
        ];
        setPrimaryUnits([...updatedDoc.primaryUnit]);
      } else {
        updatedDoc.secondaryUnit = [
          ...updatedDoc.secondaryUnit,
          { name: unitName },
        ];
        setSecondaryUnits([...updatedDoc.secondaryUnit]);
      }

      existingDoc.units = updatedDoc;
      console.log(
        updatedDoc,
        unitType,
        unitName,
        "This is the updated document"
      );

      await db.put({ ...existingDoc });

      // Ensure the update is reflected by waiting before fetching
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newDoc = await db.get(phone);
      console.log(newDoc, "This is the updated doc");

      toast.success(
        `${
          unitType === "primary" ? "Primary" : "Secondary"
        } unit added successfully`
      );

      setShowAddUnitModal(false);
      setNewUnitData({ name: "", type: "primary" });

      // Refresh the units list
      // fetchUnitsFromLocalDB();
    } catch (error) {
      console.error("Error adding unit:", error);
      toast.error("Failed to add unit");
    }
  };

  // Function to save conversion
  const handleSaveConversion = async () => {
    if (
      conversionData.baseUnit &&
      conversionData.rate &&
      conversionData.secondaryUnit
    ) {
      try {
        let existingDoc = await db.get(phone).catch(() => null);

        if (!existingDoc) {
          existingDoc = {
            _id: phone,
            conversion: [],
          };
        }

        // Ensure conversion array exists
        if (!existingDoc.conversion) {
          existingDoc.conversion = [];
        }

        // Find all existing conversions with the same baseUnit & secondaryUnit
        const matchingConversions = existingDoc.conversion.filter(
          (c) =>
            c.primaryUnit === conversionData.baseUnit &&
            c.secondaryUnit === conversionData.secondaryUnit
        );

        const newConversionRate = parseFloat(conversionData.rate);

        if (matchingConversions.length > 0) {
          // Calculate the average conversion rate of all duplicates
          const totalRate = matchingConversions.reduce(
            (sum, c) => sum + c.conversionRate,
            0
          );
          const avgRate =
            (totalRate + newConversionRate) / (matchingConversions.length + 1);

          // Remove all existing duplicates
          existingDoc.conversion = existingDoc.conversion.filter(
            (c) =>
              !(
                c.primaryUnit === conversionData.baseUnit &&
                c.secondaryUnit === conversionData.secondaryUnit
              )
          );

          // Add the merged conversion with the average rate
          existingDoc.conversion.push({
            primaryUnit: conversionData.baseUnit,
            secondaryUnit: conversionData.secondaryUnit,
            conversionRate: avgRate,
          });
        } else {
          // Add new conversion if no duplicates exist
          existingDoc.conversion.push({
            primaryUnit: conversionData.baseUnit,
            secondaryUnit: conversionData.secondaryUnit,
            conversionRate: newConversionRate,
          });
        }

        await db.put({ ...existingDoc });

        setShowConversionModal(false);
        toast.success("Conversion rate updated successfully!");
      } catch (error) {
        console.error("Error updating conversion rate:", error);
        toast.error("Failed to add conversion rate.");
      }
    }
  };

  // Add Unit Modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUnitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add Unit Modal Component
  const AddUnitModal = () => {
    if (!showAddUnitModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Unit</h2>
            <button
              onClick={() => setShowAddUnitModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Name
            </label>
            <input
              type="text"
              name="name"
              value={newUnitData.name}
              onChange={(e) =>
                setNewUnitData({ ...newUnitData, name: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Enter unit name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Type
            </label>
            <select
              name="type"
              value={newUnitData.type}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="primary">Primary Unit</option>
              <option value="secondary">Secondary Unit</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setShowAddUnitModal(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUnit}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-72 bg-white shadow-sm">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border border-gray-200 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            className="mt-4 flex items-center gap-2 rounded-md bg-orange-100 text-orange-600 px-4 py-2 text-sm font-medium w-full"
            onClick={() => setShowAddUnitModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Units
          </button>
        </div>

        <div className="mt-2">
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>UNIT NAME</span>
              <span></span>
            </div>
          </div>

          <div className="max-h-[375px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {units.map((unit, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                  selectedUnit?.name === unit.name ? "bg-blue-50" : ""
                }`}
                onClick={() => handleUnitClick(unit)}
              >
                <span className="text-sm text-gray-900">{unit.name}</span>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Units Overview</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">
                {selectedUnit
                  ? `CONVERSIONS FOR ${selectedUnit.name}`
                  : "ALL UNITS"}
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search units..."
                    className="rounded-md border border-gray-200 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                  onClick={() => setShowConversionModal(true)}
                >
                  Add Conversion
                </button>
              </div>
            </div>

            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2 font-medium w-20">#</th>
                    <th className="pb-2 font-medium">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConversions.length > 0 ? (
                    filteredConversions.map((conversion, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          1 {conversion.primaryUnit} ={" "}
                          {conversion.conversionFactor}{" "}
                          {conversion.secondaryUnit}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="py-3 text-sm text-center text-gray-900"
                      >
                        No Conversions to Show
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Modal */}
      {showConversionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add Conversion</h2>
              <button
                onClick={() => setShowConversionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex space-x-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BASE UNIT
                </label>
                <select
                  value={conversionData.baseUnit}
                  onChange={(e) =>
                    setConversionData({
                      ...conversionData,
                      baseUnit: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select Base Unit</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <span>=</span>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  RATE
                </label>
                <input
                  type="number"
                  value={conversionData.rate}
                  onChange={(e) =>
                    setConversionData({
                      ...conversionData,
                      rate: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Enter conversion rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SECONDARY UNIT
                </label>
                <select
                  value={conversionData.secondaryUnit}
                  onChange={(e) =>
                    setConversionData({
                      ...conversionData,
                      secondaryUnit: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select Secondary Unit</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowConversionModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConversion}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      <AddUnitModal />
    </div>
  );
};

export default UnitsView;
