import React, { useState } from 'react';
import { Printer, RotateCcw, X } from 'lucide-react';

const SalesBillForm = () => {
  const [items, setItems] = useState([
    {
      itemName: 'something',
      hsnCode: '1235',
      quantity: 12,
      unit: 1,
      rate: 'Rs. 150',
      tax: '18% GST',
      discount: '0%',
      total: 'Rs.177'
    }
  ]);

  const addNewItem = () => {
    setItems([...items, {
      itemName: '',
      hsnCode: '',
      quantity: 0,
      unit: 0,
      rate: '',
      tax: '',
      discount: '',
      total: ''
    }]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sale Bill</h1>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Printer size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <RotateCcw size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Customer and Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              defaultValue="Pratyaksh Lutare"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              defaultValue="1234567890"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Invoice Date</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              defaultValue="12-Dec-2024"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Billing Address</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              defaultValue="123, Anywhere, Indore, M.P"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Shipping Address</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              defaultValue="123, Anywhere, Bangalore, M.P"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Invoice Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              defaultValue="INV-001"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Item Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-pink-50">
                <th className="p-2 text-left">Item Name</th>
                <th className="p-2 text-left">HSN Code</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Unit</th>
                <th className="p-2 text-left">Rate</th>
                <th className="p-2 text-left">Tax</th>
                <th className="p-2 text-left">Discount</th>
                <th className="p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      defaultValue={item.itemName}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      defaultValue={item.hsnCode}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      defaultValue={item.quantity}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      defaultValue={item.unit}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      defaultValue={item.rate}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      defaultValue={item.tax}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      defaultValue={item.discount}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      defaultValue={item.total}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-4">
            <button
              onClick={addNewItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
            <div className="relative">
              <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded">
                Payment Type
              </button>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Generate E-invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesBillForm;