import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, updateItems } from "../../Redux/itemSlice";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";

const BulkUpdatedItems = () => {
  const [activeTab, setActiveTab] = useState("pricing");
  const [updatedItems, setUpdatedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
        setError(err);
      }
    };

    fetchPhone();
  }, []);

  const fetchItems = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      setItems(existingDoc.items);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [phone]);

  const handleInputChange = (index, field, value) => {
    setUpdatedItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
      return newItems;
    });
  };

  const handleUpdate = async () => {
    try {
      const modifiedItems = updatedItems.filter((item, index) => {
        return JSON.stringify(item) !== JSON.stringify(items[index]);
      });

      if (!modifiedItems || modifiedItems.length === 0) {
        toast.info("No modifications detected");
        return;
      }

      const existingDoc = await db.get(phone);

      if (!existingDoc.items) {
        existingDoc.items = [];
      }

      const updateResults = {
        successful: [],
        failed: [],
      };

      for (const item of modifiedItems) {
        if (!item._id) {
          updateResults.failed.push({
            item,
            error: "Missing _id field",
          });
          continue;
        }

        try {
          const itemIndex = existingDoc.items.findIndex(
            (i) => i._id === item._id
          );

          if (itemIndex !== -1) {
            const { _id, ...updateData } = item;

            existingDoc.items[itemIndex] = {
              ...existingDoc.items[itemIndex],
              ...updateData,
            };

            updateResults.successful.push(existingDoc.items[itemIndex]);
          } else {
            updateResults.failed.push({
              item,
              error: "Item not found",
            });
          }
        } catch (error) {
          console.error("Error updating item:", error);
          updateResults.failed.push({
            item,
            error: error.message,
          });
        }
      }

      await db.put(existingDoc);
      fetchItems();
      let message;
      if (
        updateResults.failed.length > 0 &&
        updateResults.successful.length > 0
      ) {
        message = `Partially successful: ${updateResults.successful.length} updated, ${updateResults.failed.length} failed`;
        toast.warning(message);
      } else if (updateResults.successful.length === 0) {
        message = "All updates failed";
        toast.error(message);
        return;
      } else {
        message = `Successfully updated ${updateResults.successful.length} items`;
        toast.success(message);
      }
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error(
        error?.message || "An error occurred while updating the items"
      );
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "pricing" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("pricing")}
        >
          Pricing
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "stock" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("stock")}
        >
          Stock
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "itemInfo" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("itemInfo")}
        >
          Item Information
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left border">#</th>
              <th className="p-3 text-left border">Item Name</th>
              <th className="p-3 text-left border">Category</th>
              <th className="p-3 text-left border">Purchase Price</th>
              <th className="p-3 text-left border">Tax Type</th>
              <th className="p-3 text-left border">Sale Price</th>
              <th className="p-3 text-left border">Tax Type</th>
              <th className="p-3 text-left border">Discount</th>
              <th className="p-3 text-left border">Discount Type</th>
              <th className="p-3 text-left border">Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {updatedItems.map((item, index) => (
              <tr key={item._id} className="border-b">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={item.itemName || ""}
                    onChange={(e) =>
                      handleInputChange(index, "itemName", e.target.value)
                    }
                  />
                </td>
                <td className="p-3 border">
                  <select
                    className="w-full p-1 border rounded"
                    value={item.category || ""}
                    onChange={(e) =>
                      handleInputChange(index, "category", e.target.value)
                    }
                  >
                    <option value="">---</option>
                    {/* Add your categories here */}
                  </select>
                </td>
                <td className="p-3 border">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={item.purchasePrice || ""}
                    onChange={(e) =>
                      handleInputChange(index, "purchasePrice", e.target.value)
                    }
                  />
                </td>
                <td className="p-3 border">
                  <select
                    className="w-full p-1 border rounded"
                    value={item.taxType || "Included"}
                    onChange={(e) =>
                      handleInputChange(index, "taxType", e.target.value)
                    }
                  >
                    <option value="Included">Included</option>
                    <option value="Excluded">Excluded</option>
                  </select>
                </td>
                <td className="p-3 border">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={item.salePrice || ""}
                    onChange={(e) =>
                      handleInputChange(index, "salePrice", e.target.value)
                    }
                  />
                </td>
                <td className="p-3 border">
                  <select
                    className="w-full p-1 border rounded"
                    value={item.salePriceTaxType || "Included"}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "salePriceTaxType",
                        e.target.value
                      )
                    }
                  >
                    <option value="Included">Included</option>
                    <option value="Excluded">Excluded</option>
                  </select>
                </td>
                <td className="p-3 border">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={item.saleDiscount || ""}
                    onChange={(e) =>
                      handleInputChange(index, "saleDiscount", e.target.value)
                    }
                  />
                </td>
                <td className="p-3 border">
                  <select
                    className="w-full p-1 border rounded"
                    value={item.saleDiscountType || "Percentage"}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "saleDiscountType",
                        e.target.value
                      )
                    }
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Amount">Amount</option>
                  </select>
                </td>
                <td className="p-3 border">
                  <select
                    className="w-full p-1 border rounded"
                    value={item.taxRate || "None"}
                    onChange={(e) =>
                      handleInputChange(index, "taxRate", e.target.value)
                    }
                  >
                    <option value="None">None</option>
                    <option value="GST@3%">GST@3%</option>
                    <option value="GST@5%">GST@5%</option>
                    <option value="GST@12%">GST@12%</option>
                    <option value="GST@18%">GST@18%</option>
                    <option value="GST@28%">GST@28%</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Pricing - {updatedItems.length} Updates
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default BulkUpdatedItems;
