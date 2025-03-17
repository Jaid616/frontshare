import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Eye, Plus, Printer, X, Search } from "lucide-react";
import Barcode from "react-barcode";
import { getItems } from "../../Redux/itemSlice";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";

export default function BarcodeGenerator() {
  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    noOfLabels: "0",
    header: "",
    line1: "",
    line2: "",
    line3: "",
    line4: "",
  });

  const [items, setItems] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [printerType, setPrinterType] = useState("regular");
  const [labelSize, setLabelSize] = useState("65-38x21");
  const [showPrinterDropdown, setShowPrinterDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const printerDropdownRef = useRef(null);
  const sizeDropdownRef = useRef(null);

  const printerTypes = {
    regular: {
      name: "Regular Printer",
      sizes: [
        { id: "65-38x21", name: "65 Labels (38 * 21mm)" },
        { id: "48-48x24", name: "48 Labels (48 * 24mm)" },
        { id: "24-64x34", name: "24 Labels (64 * 34mm)" },
        { id: "12-100x44", name: "12 Labels (100 * 44mm)" },
      ],
    },
    thermal: {
      name: "Label Printer",
      sizes: [
        { id: "2-50x25", name: "2 Labels (50 * 25mm)" },
        { id: "1-100x50", name: "1 Label (100 * 50mm)" },
        { id: "1-50x25", name: "1 Label (50 * 25mm)" },
        { id: "2-38x25", name: "2 Label (38 * 25mm)" },
      ],
    },
  };

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

  useEffect(() => {
    const fetchItems = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setAllItems(existingDoc.items);
      }
    };
    fetchItems();
  }, [phone]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = allItems?.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLabelDimensions = (sizeId) => {
    const [count, dimensions] = sizeId.split("-");
    const [width, height] = dimensions.split("x").map(Number);
    return { count: Number(count), width, height };
  };

  const getBarcodeDimensions = (sizeId) => {
    const { width, height } = getLabelDimensions(sizeId);
    const barcodeWidth = width * 0.8;
    const barcodeHeight = height * 0.6;
    return { width: barcodeWidth, height: barcodeHeight };
  };

  const handlePrinterTypeChange = (type) => {
    setPrinterType(type);
    setLabelSize(printerTypes[type].sizes[0].id);
    setShowPrinterDropdown(false);
  };

  const handleSizeChange = (sizeId) => {
    setLabelSize(sizeId);
    setShowSizeDropdown(false);
  };

  const handleItemSelect = (item) => {
    // Prevent immediate closing of popover
    setTimeout(() => {
      setFormData({
        ...formData,
        itemName: item.itemName,
        itemCode: item.itemCode,
      });
      setShowPopover(false);
    }, 0);
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddBarcode = () => {
    if (!formData.itemName || !formData.itemCode || !formData.noOfLabels) {
      alert("Please fill in all required fields");
      return;
    }

    const newItems = Array.from({ length: parseInt(formData.noOfLabels) }).map(
      () => ({
        ...formData,
        barcode: formData.itemCode,
      })
    );

    setItems([...items, ...newItems]);
    setFormData({
      itemName: "",
      itemCode: "",
      noOfLabels: "0",
      header: "",
      line1: "",
      line2: "",
      line3: "",
      line4: "",
    });
  };

  const handleGenerateBarcodes = () => {
    if (items.length === 0) {
      alert("Please add items first");
      return;
    }
    setSelectedItems(items);
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const ItemSearchPopover = () => (
    <div
      ref={popoverRef}
      className="absolute z-50 mt-2 w-[74%] max-h-64 overflow-auto bg-white border rounded-md shadow-lg"
    >
      <div className="p-2 border-b sticky top-0 bg-white">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 sticky top-[2.5rem]">
          <tr>
            <th className="px-4 py-2 border">Item Name</th>
            <th className="px-4 py-2 border">Code</th>
            <th className="px-4 py-2 border">Sale Price</th>
            <th className="px-4 py-2 border">Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems?.map((item) => (
            <tr
              key={item._id}
              onClick={(e) => {
                e.stopPropagation();
                handleItemSelect(item);
              }}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-4 py-2 border">{item.itemName}</td>
              <td className="px-4 py-2 border">{item.itemCode}</td>
              <td className="px-4 py-2 border">{item.salePrice}</td>
              <td className="px-4 py-2 border">{item.minStockToMaintain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const SimplifiedBarcode = ({ value, header, line1, line2, line3, line4 }) => {
    const dimensions = getBarcodeDimensions(labelSize);
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium mb-2">{header}</div>
        <Barcode
          value={value}
          width={1}
          height={dimensions.height}
          fontSize={10}
          displayValue={true}
          text={value}
          marginTop={5}
          marginBottom={5}
        />
        <div className="text-xs text-gray-600 mt-1">{line1}</div>
        <div className="text-xs text-gray-600">{line2}</div>
        <div className="text-xs text-gray-600 mt-1">{line3}</div>
        <div className="text-xs text-gray-600">{line4}</div>
      </div>
    );
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-4/5 max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Preview Barcodes</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {selectedItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <SimplifiedBarcode
                value={item.itemCode}
                header={item.header}
                line1={item.line1}
                line2={item.line2}
                line3={item.line3}
                line4={item.line4}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center gap-4 justify-end mb-3">
        <div className="relative">
          <span className="text-gray-600">Printer:</span>
          <button
            onClick={() => setShowPrinterDropdown(!showPrinterDropdown)}
            className="ml-2 px-3 py-1.5 border rounded flex items-center gap-2"
          >
            {printerTypes[printerType].name}
            <ChevronDown size={16} />
          </button>

          {showPrinterDropdown && (
            <div
              ref={printerDropdownRef}
              className="absolute z-50 mt-1 w-48 bg-white border rounded-md shadow-lg"
            >
              {Object.entries(printerTypes).map(([type, { name }]) => (
                <button
                  key={type}
                  onClick={() => handlePrinterTypeChange(type)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <span className="text-gray-600">Size:</span>
          <button
            onClick={() => setShowSizeDropdown(!showSizeDropdown)}
            className="ml-2 px-3 py-1.5 border rounded flex items-center gap-2"
          >
            {
              printerTypes[printerType].sizes.find(
                (size) => size.id === labelSize
              )?.name
            }
            <ChevronDown size={16} />
          </button>

          {showSizeDropdown && (
            <div
              ref={sizeDropdownRef}
              className="absolute z-50 mt-1 w-48 bg-white border rounded-md shadow-lg"
            >
              {printerTypes[printerType].sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size.id)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {size.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              Item Name<span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              onFocus={() => setShowPopover(true)}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter Item Name"
              required
            />
            {showPopover && <ItemSearchPopover />}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              Item Code<span className="text-red-500">*</span>
            </label>
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
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Enter Code"
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              No of Labels<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="noOfLabels"
              value={formData.noOfLabels}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="0"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Header</label>
            <input
              name="header"
              value={formData.header}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter Header"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Line 1</label>
            <input
              name="line1"
              value={formData.line1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter Line 1"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Line 2</label>
            <input
              name="line2"
              value={formData.line2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter Line 2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Line 3</label>
            <input
              name="line3"
              value={formData.line3}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter Line 3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Line 4</label>
            <input
              name="line4"
              value={formData.line4}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter Line 4"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleAddBarcode}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              formData.itemName && formData.itemCode && formData.noOfLabels > 0
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={
              !(
                formData.itemName &&
                formData.itemCode &&
                formData.noOfLabels > 0
              )
            }
          >
            <Plus size={16} />
            Add for Barcode
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm text-gray-700">
                Item Name
              </th>
              <th className="py-3 px-4 text-left text-sm text-gray-700">
                No of Labels
              </th>
              <th className="py-3 px-4 text-left text-sm text-gray-700">
                Header
              </th>
              <th className="py-3 px-4 text-left text-sm text-gray-700">
                Line 1
              </th>
              <th className="py-3 px-4 text-left text-sm text-gray-700">
                Line 2
              </th>
              <th className="py-3 px-4 text-left text-sm text-gray-700">
                Barcode
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-16">
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="w-32 h-8 bg-gray-100 mb-4"></div>
                    <p>Added items for Barcode generation</p>
                    <p>will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3 px-4 text-sm">{item.itemName}</td>
                  <td className="py-3 px-4 text-sm">{item.noOfLabels}</td>
                  <td className="py-3 px-4 text-sm">{item.header}</td>
                  <td className="py-3 px-4 text-sm">{item.line1}</td>
                  <td className="py-3 px-4 text-sm">{item.line2}</td>
                  <td className="py-3 px-4 text-sm">{item.line3}</td>
                  <td className="py-3 px-4 text-sm">{item.line4}</td>
                  <td className="py-3 px-4 text-sm">
                    <SimplifiedBarcode
                      value={item.itemCode}
                      header={item.header}
                      line1={item.line1}
                      line2={item.line2}
                      line3={item.line3}
                      line4={item.line4}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => handleGenerateBarcodes()}
          className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate
        </button>
      </div>

      {showPreview && <PreviewModal />}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-content, .modal-content * {
            visibility: visible;
          }
          .modal-content {
            position: absolute;
            left: 0;
            top: 0;
          }
          @page {
            size: ${printerType === "thermal" ? "50mm 25mm" : "A4"};
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
