import React, { useEffect, useState } from "react";
import { X, Plus, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import db from "../config/dbConfig";
import { decodeToken } from "../DecodeToken";

const AddExpenses = () => {
  const [tabsData, setTabsData] = useState({
    1: {
      expenseNo: "",
      date: new Date().toISOString().split("T")[0],
      expenseCategory: "",
      gstEnabled: false,
      rows: [
        { id: 1, item: "", qty: 1, price: 0, amount: 0, expenseItemId: "" },
      ],
      paymentType: "cash",
      total: 0,
    },
  });

  const [tabs, setTabs] = useState([{ id: 1, title: "Expense #1" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseType, setExpenseType] = useState("Direct Expense");
  const [showItemModal, setShowItemModal] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);
  const [newItemData, setNewItemData] = useState({
    name: "",
    hsn: "",
    price: "",
    taxRate: "NONE",
  });
  const navigate = useNavigate();

  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [isLoading , setLoading ] = useState(true)

  useEffect(() => {
    const fetchPhone = async () => {
      setLoading(true);
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhone();
  }, []);

  const fetchExpenses = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      setExpenses(existingDoc?.expenses);
    }
  };
  const fetchExpenseItems = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      setExpenseItems(existingDoc?.expenseItems);
    }
  };

  const fetchExpenseCategories = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      setExpenseCategories(existingDoc?.expenseCategories);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [phone]);

  useEffect(() => {
    fetchExpenseItems();
  }, [phone]);

  useEffect(() => {
    fetchExpenseCategories();
  }, [phone]);

  const handleSelectExpenseItem = (selectedItem, rowId) => {
    const currentTabData = tabsData[activeTab];
    const updatedRows = currentTabData.rows.map((row) => {
      if (row.id === rowId) {
        const newAmount = selectedItem.price * row.qty;
        return {
          ...row,
          item: selectedItem.name,
          price: parseFloat(selectedItem.price),
          amount: newAmount,
          expenseItemId: selectedItem._id,
        };
      }
      return row;
    });

    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...currentTabData,
        rows: updatedRows,
        total: calculateTotal(updatedRows),
      },
    });
    setActivePopoverId(null);
  };

  const updateRow = (id, field, value) => {
    const currentTabData = tabsData[activeTab];
    const updatedRows = currentTabData.rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        if (field === "qty" || field === "price") {
          updatedRow.amount = updatedRow.qty * updatedRow.price;
        }
        return updatedRow;
      }
      return row;
    });

    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...currentTabData,
        rows: updatedRows,
        total: calculateTotal(updatedRows),
      },
    });
  };

  const addTab = () => {
    const newTabId = tabs.length + 1;
    const newTab = {
      id: newTabId,
      title: `Expense #${newTabId}`,
    };

    setTabs([...tabs, newTab]);
    setTabsData({
      ...tabsData,
      [newTabId]: {
        expenseNo: "",
        date: new Date().toISOString().split("T")[0],
        expenseCategory: "",
        gstEnabled: false,
        rows: [
          { id: 1, item: "", qty: 1, price: 0, amount: 0, expenseItemId: "" },
        ],
        paymentType: "cash",
        total: 0,
      },
    });
    setActiveTab(newTabId);
  };

  const removeTab = (tabId) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    if (newTabs.length === 0) {
      navigate(-1);
      return;
    }

    const newTabsData = { ...tabsData };
    delete newTabsData[tabId];

    setTabs(newTabs);
    setTabsData(newTabsData);
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const addRow = () => {
    const currentTabData = tabsData[activeTab];
    const newRow = {
      id: currentTabData.rows.length + 1,
      item: "",
      qty: 1,
      price: 0,
      amount: 0,
    };

    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...currentTabData,
        rows: [...currentTabData.rows, newRow],
      },
    });
  };

  const removeRow = (rowId) => {
    const currentTabData = tabsData[activeTab];
    if (currentTabData.rows.length > 1) {
      const updatedRows = currentTabData.rows.filter((row) => row.id !== rowId);
      setTabsData({
        ...tabsData,
        [activeTab]: {
          ...currentTabData,
          rows: updatedRows,
          total: calculateTotal(updatedRows),
        },
      });
    }
  };

  const calculateTotal = (rows) => {
    return rows.reduce((sum, row) => sum + row.amount, 0);
  };

  const handleExpenseNoChange = (value) => {
    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...tabsData[activeTab],
        expenseNo: value,
      },
    });
  };

  const handleDateChange = (value) => {
    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...tabsData[activeTab],
        date: value,
      },
    });
  };

  const handleGSTToggle = () => {
    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...tabsData[activeTab],
        gstEnabled: !tabsData[activeTab].gstEnabled,
      },
    });
  };

  const handleExpenseCategoryChange = (value) => {
    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...tabsData[activeTab],
        expenseCategory: value,
      },
    });
  };

  const handlePaymentTypeChange = (value) => {
    setTabsData({
      ...tabsData,
      [activeTab]: {
        ...tabsData[activeTab],
        paymentType: value,
      },
    });
  };

  const handleSave = async () => {
    const updatedTabsData = Object.keys(tabsData).reduce((acc, tabKey) => {
      const currentTabData = tabsData[tabKey];
      acc[tabKey] = {
        ...currentTabData,
        expenseItems: currentTabData.rows,
        rows: undefined,
      };

      return acc;
    }, {});

    const expensesArray = Object.values(tabsData).map((tab) => ({
      expenseNo: tab.expenseNo,
      date: tab.date,
      expenseCategory: tab.expenseCategory,
      gstEnabled: tab.gstEnabled,
      expenseItems: tab.rows.map((row) => ({
        item: row.item,
        quantity: row.qty,
        price: row.price,
        amount: row.amount,
        itemId: row.expenseItemId,
      })),
      paymentType: tab.paymentType,
      total: tab.total,
    }));

    try {
      const existingDoc = await db.get(phone);
      if (!existingDoc.expenses) {
        existingDoc.expenses = [];
      }
      existingDoc.expenses.push(...expensesArray);

      await db.put({ ...existingDoc });

      toast.success("Expense added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving expenses:", error);
      toast.error("Failed to save expenses.");
    }
  };

  const handleSaveCategory = async () => {
    if (!expenseCategory.trim()) {
      toast.error("Expense category is required!");
      return;
    }

    if (!expenseType.trim()) {
      toast.error("Expense type is required!");
      return;
    }

    try {
      let existingDoc = await db.get(phone);

      if (!existingDoc.expenseCategories) {
        existingDoc.expenseCategories = [];
      }

      const isCategoryExists = existingDoc.expenseCategories.some(
        (category) =>
          category.expenseCategory.toLowerCase() ===
          expenseCategory.trim().toLowerCase()
      );

      if (isCategoryExists) {
        toast.error("Expense category already exists!");
        return;
      }

      let isUnique = false;
      let categoryId;
      while (!isUnique) {
        categoryId = Math.floor(1000 + Math.random() * 9000).toString();
        isUnique = !existingDoc.expenseCategories.some(
          (category) => category.categoryId === categoryId
        );
      }
      const newExpenseCategory = {
        expenseCategory: expenseCategory.trim(),
        expenseType: expenseType.trim(),
        categoryId,
      };

      existingDoc.expenseCategories.push(newExpenseCategory);
      await db.put({ ...existingDoc });

      toast.success("Expense category added successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding expense category:", error);
      toast.error("Failed to add expense category. Please try again.");
    }
  };

  const handleItemFieldClick = (rowId) => {
    setActivePopoverId(activePopoverId === rowId ? null : rowId);
  };

  const handleAddItemClick = () => {
    setActivePopoverId(null);
    setShowItemModal(true);
  };

  const handleItemModalClose = () => {
    setShowItemModal(false);
    setNewItemData({
      name: "",
      hsn: "",
      price: "",
      taxRate: "NONE",
    });
  };

  const handleItemModalSave = async () => {
    if (!newItemData.name.trim()) {
      toast.error("Item name is required!");
      return;
    }
    if (!newItemData.price.trim() || isNaN(newItemData.price)) {
      toast.error("Valid price is required!");
      return;
    }

    try {
      let existingDoc = await db.get(phone);

      if (!existingDoc.expenseItems) {
        existingDoc.expenseItems = [];
      }

      const isItemExists = existingDoc.expenseItems.some(
        (item) =>
          item.name.toLowerCase() === newItemData.name.trim().toLowerCase()
      );

      if (isItemExists) {
        toast.error("Expense item already exists!");
        return;
      }

      const newExpenseItem = {
        name: newItemData.name.trim(),
        hsn: newItemData.hsn || "",
        price: newItemData.price.trim(),
        taxRate: newItemData.taxRate || 0,
      };

      existingDoc.expenseItems.push(newExpenseItem);

      await db.put({ ...existingDoc });

      toast.success("Item added successfully!");
      handleItemModalClose();
    } catch (error) {
      console.error("Error adding expense item:", error);
      toast.error("Failed to add the item. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg h-screen relative">
      {/* Modals remain the same */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add Expense Category</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Expense Category"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Expense Type</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                >
                  <option>Direct Expense</option>
                  <option>Indirect Expense</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add Expense Item</h2>
              <button
                onClick={handleItemModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Item Name*</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={newItemData.name}
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, name: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">HSN/SAC</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={newItemData.hsn}
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, hsn: e.target.value })
                  }
                  placeholder="Enter HSN/SAC code"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={newItemData.price}
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Tax Rate</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={newItemData.taxRate}
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, taxRate: e.target.value })
                  }
                >
                  <option value="NONE">NONE</option>
                  <option value="IGST@0%">IGST@0%</option>
                  <option value="GST@0%">GST@0%</option>
                  <option value="IGST@0.25%">IGST@0.25%</option>
                  <option value="GST@0.25%">GST@0.25%</option>
                  <option value="IGST@3%">IGST@3%</option>
                  <option value="GST@3%">GST@3%</option>
                  <option value="IGST@5%">IGST@5%</option>
                  <option value="GST@5%">GST@5%</option>
                  <option value="IGST@12%">IGST@12%</option>
                  <option value="GST@12%">GST@12%</option>
                  <option value="IGST@18%">IGST@18%</option>
                  <option value="GST@18%">GST@18%</option>
                  <option value="IGST@28%">IGST@28%</option>
                  <option value="GST@28%">GST@28%</option>
                  <option value="Exempted">Exempted</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleItemModalClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleItemModalSave}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center mb-4 border-b">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center">
            <button
              className={`px-4 py-2 text-sm ${
                activeTab === tab.id
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
            <button
              className="ml-2 text-gray-400 hover:text-gray-600"
              onClick={() => removeTab(tab.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          className="ml-2 p-1 text-blue-500 hover:text-blue-600"
          onClick={addTab}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Expense Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Expense</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">GST</span>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  tabsData[activeTab].gstEnabled ? "bg-blue-500" : "bg-gray-200"
                }`}
                onClick={handleGSTToggle}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                    tabsData[activeTab].gstEnabled
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Expense No</span>
              <input
                type="text"
                className="border rounded px-3 py-2 text-sm"
                value={tabsData[activeTab].expenseNo}
                onChange={(e) => handleExpenseNoChange(e.target.value)}
                placeholder="Enter expense no"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Date</span>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={tabsData[activeTab].date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <select
            className="border rounded px-3 py-2 w-64 text-sm"
            value={tabsData[activeTab].expenseCategory}
            onChange={(e) => handleExpenseCategoryChange(e.target.value)}
          >
            <option value="" disabled>
              Expense Category*
            </option>
            {expenses.map((category, index) => (
              <option key={index} value={category.expenseCategory}>
                {category.expenseCategory} ({category.expenseType})
              </option>
            ))}
          </select>
          <button
            className="ml-2 text-blue-500 hover:text-blue-600"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm overflow-visible">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">ITEM</th>
                <th className="border px-4 py-2 text-left">QTY</th>
                <th className="border px-4 py-2 text-left">PRICE/UNIT</th>
                <th className="border px-4 py-2 text-left">AMOUNT</th>
                <th className="border px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {tabsData[activeTab].rows.map((row) => (
                <tr key={row.id}>
                  <td className="border px-4 py-2">{row.id}</td>
                  <td className="border px-4 py-2 relative">
                    <input
                      type="text"
                      className="w-full border-none focus:outline-none text-sm"
                      value={row.item}
                      onChange={(e) =>
                        updateRow(row.id, "item", e.target.value)
                      }
                      onClick={() => handleItemFieldClick(row.id)}
                    />
                    {activePopoverId === row.id && (
                      <div className="absolute left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          <button
                            onClick={handleAddItemClick}
                            className="w-full text-left px-3 py-2 text-sm text-blue-500 hover:bg-blue-50 rounded flex items-center"
                          >
                            <Plus size={16} className="mr-2" />
                            Add An Expense Item
                          </button>
                        </div>
                        <div className="p-2">
                          {expenseItems && expenseItems.length > 0 ? (
                            expenseItems.map((expenseItem) => (
                              <div
                                key={expenseItem.id || expenseItem._id}
                                className="py-1 text-sm text-gray-700 hover:bg-gray-100 rounded px-2 cursor-pointer"
                                onClick={() =>
                                  handleSelectExpenseItem(expenseItem, row.id)
                                }
                              >
                                {expenseItem.name}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">
                              No expense items available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="w-full border-none focus:outline-none text-sm"
                      value={row.qty}
                      onChange={(e) =>
                        updateRow(
                          row.id,
                          "qty",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="w-full border-none focus:outline-none text-sm"
                      value={row.price}
                      onChange={(e) =>
                        updateRow(
                          row.id,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="border px-4 py-2">{row.amount}</td>
                  <td className="border px-4 py-2">
                    {tabsData[activeTab].rows.length > 1 && (
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeRow(row.id)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-sm">
          <button
            className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
            onClick={addRow}
          >
            <Plus size={16} />
            <span>ADD ROW</span>
          </button>
          <div className="flex items-center space-x-4">
            <span className="font-medium">TOTAL</span>
            <span>{tabsData[activeTab].total}</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={tabsData[activeTab].paymentType}
              onChange={(e) => handlePaymentTypeChange(e.target.value)}
            >
              <option value="cash">Cash</option>
            </select>
            <button className="text-blue-500 hover:text-blue-600 flex items-center space-x-1">
              <Plus size={16} />
              <span>Add Payment type</span>
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <div className="flex items-center space-x-2">
              <span>Total</span>
              <input
                type="number"
                className="border rounded px-3 py-2 text-sm"
                value={tabsData[activeTab].total}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 flex items-center space-x-2 text-sm">
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenses;
