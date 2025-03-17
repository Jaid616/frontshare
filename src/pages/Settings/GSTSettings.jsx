import React, { useState, useEffect } from "react";
import { Info, ChevronDown, Plus, Edit2, Trash2, X } from "lucide-react";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";

const GSTSettings = ({ settings, onSettingsChange, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [country, setCountry] = useState("");
  const [showTaxRateModal, setShowTaxRateModal] = useState(false);
  const [showTaxGroupModal, setShowTaxGroupModal] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState(null);
  const [editingTaxGroup, setEditingTaxGroup] = useState(null);
  const [newTaxRate, setNewTaxRate] = useState({ name: "", rate: "" });
  const [newTaxGroup, setNewTaxGroup] = useState({
    name: "",
    selectedTaxes: [],
  });

  const [phone, setPhone] = useState(null);
  console.log(settings, "This is settings for tax");
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {}
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setCountry(existingDoc.users.country);
      }
    };

    fetchCountry();
  }, [phone]);

  const handleAddTaxRate = () => {
    if (newTaxRate.name && newTaxRate.rate) {
      if (editingTaxRate) {
        // Update existing tax rate
        const updatedTaxRates = (settings.taxRates || []).map((tax) =>
          tax.id === editingTaxRate.id ? { ...tax, ...newTaxRate } : tax
        );
        onSettingsChange({ ...settings, taxRates: updatedTaxRates });
        onSave({ ...settings, taxRates: updatedTaxRates });
      } else {
        // Add new tax rate
        const newTaxRateWithId = {
          ...newTaxRate,
          id:
            Math.max(...(settings.taxRates || []).map((t) => t.id || 0), 0) + 1,
        };
        const updatedTaxRates = [
          ...(settings.taxRates || []),
          newTaxRateWithId,
        ];
        console.log("This is a new tax rate", updatedTaxRates)
        onSettingsChange({ ...settings, taxRates: updatedTaxRates });
        onSave({ ...settings, taxRates: updatedTaxRates });
      }
      setNewTaxRate({ name: "", rate: "" });
      setShowTaxRateModal(false);
      setEditingTaxRate(null);
    }
  };

  const handleAddTaxGroup = () => {
    if (newTaxGroup.name && newTaxGroup.selectedTaxes.length > 0) {
      if (editingTaxGroup) {
        // Update existing tax group
        const updatedTaxGroups = (settings.taxGroups || []).map((group) =>
          group.id === editingTaxGroup.id
            ? {
                ...group,
                name: newTaxGroup.name,
                components: newTaxGroup.selectedTaxes,
              }
            : group
        );
        onSettingsChange({ ...settings, taxGroups: updatedTaxGroups });
        onSave({ ...settings, taxGroups: updatedTaxGroups });
      } else {
        // Add new tax group
        const newGroupWithId = {
          id:
            Math.max(...(settings.taxGroups || []).map((g) => g.id || 0), 0) +
            1,
          name: newTaxGroup.name,
          components: newTaxGroup.selectedTaxes,
        };
        const updatedTaxGroups = [
          ...(settings.taxGroups || []),
          newGroupWithId,
        ];
        onSettingsChange({ ...settings, taxGroups: updatedTaxGroups });
        onSave({ ...settings, taxGroups: updatedTaxGroups });
      }
      setNewTaxGroup({ name: "", selectedTaxes: [] });
      setShowTaxGroupModal(false);
      setEditingTaxGroup(null);
    }
  };

  const handleEditTaxRate = (tax) => {
    setEditingTaxRate(tax);
    setNewTaxRate({ name: tax.name, rate: tax.rate });
    setShowTaxRateModal(true);
  };

  const handleEditTaxGroup = (group) => {
    setEditingTaxGroup(group);
    setNewTaxGroup({
      name: group.name,
      selectedTaxes: group.components,
    });
    setShowTaxGroupModal(true);
  };

  const handleDeleteTaxRate = (taxId) => {
    const updatedTaxRates = (settings.taxRates || []).filter(
      (tax) => tax.id !== taxId
    );
    onSettingsChange({ ...settings, taxRates: updatedTaxRates });
  };

  const handleDeleteTaxGroup = (groupId) => {
    const updatedTaxGroups = (settings.taxGroups || []).filter(
      (group) => group.id !== groupId
    );
    onSettingsChange({ ...settings, taxGroups: updatedTaxGroups });
  };

  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const GSTCheckbox = ({ label, checked, onChange, hasWarning = false }) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-gray-300"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
      <Info size={16} className="text-gray-400" />
      {hasWarning && <span className="text-yellow-500">⚠</span>}
    </div>
  );

  const isGSTCountry = country === "India";

  return (
    <div className="flex w-full h-[99vh] overflow-hidden">
      {/* Main GST Settings Panel */}
      {isGSTCountry && (
        <div className="w-96 bg-white shadow p-2 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">GST Settings</h2>
          </div>

          <div className="space-y-4">
            <GSTCheckbox
              label="Enable GST"
              checked={settings.gstEnabled}
              onChange={(checked) =>
                onSettingsChange({ ...settings, gstEnabled: checked })
              }
            />

            <GSTCheckbox
              label="Enable HSN/SAC Code"
              checked={settings.hsnEnabled}
              onChange={(checked) =>
                onSettingsChange({ ...settings, hsnEnabled: checked })
              }
            />

            <GSTCheckbox
              label="Additional Cess On Item"
              checked={settings.additionalCess}
              onChange={(checked) =>
                onSettingsChange({ ...settings, additionalCess: checked })
              }
            />

            <GSTCheckbox
              label="Reverse Charge"
              checked={settings.reverseCharge}
              onChange={(checked) =>
                onSettingsChange({ ...settings, reverseCharge: checked })
              }
            />

            <GSTCheckbox
              label="Enable Place of Supply"
              checked={settings.placeOfSupply}
              onChange={(checked) =>
                onSettingsChange({ ...settings, placeOfSupply: checked })
              }
            />

            <GSTCheckbox
              label="Composite Scheme"
              checked={settings.compositeScheme}
              onChange={(checked) =>
                onSettingsChange({ ...settings, compositeScheme: checked })
              }
            />

            <GSTCheckbox
              label="Enable TCS"
              checked={settings.tcsEnabled}
              onChange={(checked) =>
                onSettingsChange({ ...settings, tcsEnabled: checked })
              }
              hasWarning={true}
            />

            <GSTCheckbox
              label="Enable TDS"
              checked={settings.tdsEnabled}
              onChange={(checked) =>
                onSettingsChange({ ...settings, tdsEnabled: checked })
              }
              hasWarning={true}
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-4"
          >
            <span>Tax List</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      {/* Tax Rates and Groups Side Panel */}
      {(!isGSTCountry || isExpanded) && (
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
          {/* Tax Rates Panel */}
          <div className="bg-white shadow rounded-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Tax Rates</h3>
              <button
                onClick={() => {
                  setEditingTaxRate(null);
                  setNewTaxRate({ name: "", rate: "" });
                  setShowTaxRateModal(true);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {(settings.taxRates || []).map((tax) => (
                <div
                  key={tax.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <div>
                    <span>{tax.name}</span>
                    <span className="ml-4 text-gray-600">{tax.rate}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTaxRate(tax)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTaxRate(tax.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Groups Panel */}
          <div className="bg-white rounded-lg shadow flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Tax Groups</h3>
              <button
                onClick={() => {
                  setEditingTaxGroup(null);
                  setNewTaxGroup({ name: "", selectedTaxes: [] });
                  setShowTaxGroupModal(true);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {(settings.taxGroups || []).map((group) => (
                <div key={group.id} className="p-2 hover:bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{group.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTaxGroup(group)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTaxGroup(group.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {group.components.join(" + ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Tax Rate Modal */}
      {showTaxRateModal && (
        <Modal
          title={editingTaxRate ? "Edit Tax Rate" : "Add Tax Rate"}
          onClose={() => {
            setShowTaxRateModal(false);
            setEditingTaxRate(null);
            setNewTaxRate({ name: "", rate: "" });
          }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tax Name"
              className="w-full p-2 border rounded"
              value={newTaxRate.name}
              onChange={(e) =>
                setNewTaxRate({ ...newTaxRate, name: e.target.value })
              }
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Rate"
                className="flex-1 p-2 border rounded"
                value={newTaxRate.rate}
                onChange={(e) =>
                  setNewTaxRate({ ...newTaxRate, rate: e.target.value })
                }
              />
              <select className="p-2 border rounded">
                <option>Other</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowTaxRateModal(false);
                  setEditingTaxRate(null);
                  setNewTaxRate({ name: "", rate: "" });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTaxRate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingTaxRate ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add/Edit Tax Group Modal */}
      {showTaxGroupModal && (
        <Modal
          title={editingTaxGroup ? "Edit Tax Group" : "Add Tax Group"}
          onClose={() => {
            setShowTaxGroupModal(false);
            setEditingTaxGroup(null);
            setNewTaxGroup({ name: "", selectedTaxes: [] });
          }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Group Name"
              className="w-full p-2 border rounded"
              value={newTaxGroup.name}
              onChange={(e) =>
                setNewTaxGroup({ ...newTaxGroup, name: e.target.value })
              }
            />
            <div className="space-y-2">
              <h4 className="font-medium">Select Taxes</h4>
              {(settings.taxRates || []).map((tax) => (
                <div key={tax.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={newTaxGroup.selectedTaxes.includes(tax.name)}
                    onChange={(e) => {
                      const updatedTaxes = e.target.checked
                        ? [...newTaxGroup.selectedTaxes, tax.name]
                        : newTaxGroup.selectedTaxes.filter(
                            (t) => t !== tax.name
                          );
                      setNewTaxGroup({
                        ...newTaxGroup,
                        selectedTaxes: updatedTaxes,
                      });
                    }}
                  />
                  <span>
                    {tax.name} ({tax.rate}%)
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowTaxGroupModal(false);
                  setEditingTaxGroup(null);
                  setNewTaxGroup({ name: "", selectedTaxes: [] });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTaxGroup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingTaxGroup ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GSTSettings;
