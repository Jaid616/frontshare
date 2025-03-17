import React, { useState } from "react";
import { ArrowLeft, Upload, Download } from "lucide-react";
import ExcelImage from "../../assets/excelImage.png";
import * as XLSX from "xlsx";
import { addItem } from "../../Redux/itemSlice";
import { useDispatch } from "react-redux";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const ImportExcel = () => {
  const [dragActive, setDragActive] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [items, setItems] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log(e.dataTransfer.files, "THis is the Excel file");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0]);
    }
  };

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const transformedData = jsonData
          .filter((row) =>
            Object.values(row).some(
              (value) => value !== undefined && value !== ""
            )
          )
          .map((row) => ({
            itemName: row["Item name*"] || "",
            itemCode: row["Item code"] || "",
            itemHSN: "",
            categories: [],
            salePrice: row["Sale price"] || "",
            salePriceType: row["Inclusive Of Tax"] || "Without Tax",
            saleDiscount: row["Sale Discount"] || "",
            saleDiscountType: row["Discount Type"] || "Percentage",
            wholesalePrice: "",
            wholesalePriceType: "Without Tax",
            minWholesaleQty: row["Minimum stock quantity"] || "",
            purchasePrice: row["Purchase price"] || "",
            purchasePriceType: "Without Tax",
            taxRate: row["Tax Rate"] || "None",
            openingQuantity: row["Opening stock quantity"] || "",
            atPrice: "",
            asOfDate: "2024-12-23",
            minStockToMaintain: row["Minimum stock quantity"] || "",
            location: row["Item Location"] || "",
          }));

        setItems(transformedData);
        console.log(transformedData);

        // Simulate API import with a loading animation
        setIsImporting(true); // Show animation
        setTimeout(async () => {
          try {
            const existingDoc = await db.get(phone);

            // Check and add only new items
            const existingItems = existingDoc.items || [];
            const newItems = transformedData.filter(
              (newItem) =>
                !existingItems.some(
                  (existingItem) => existingItem.itemName === newItem.itemName
                )
            );

            if (newItems.length > 0) {
              existingDoc.items = [...existingItems, ...newItems];
              await db.put(existingDoc);
            }

            setIsImporting(false); // Hide animation
          } catch (err) {
            console.error("Error updating database:", err);
            setIsImporting(false);
          }
        }, 3000);
      } catch (error) {
        console.error("Error processing Excel file:", error);
        setDownloadError("Failed to process Excel file");
      }
    };

    reader.onerror = () => {
      setDownloadError("Failed to read Excel file");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processExcelFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloadError("");
    setDownloadSuccess(false);

    try {
      const templateUrl =
        "https://res.cloudinary.com/dmsmeq3ef/raw/upload/v1736420444/Import_Items_Template_mfpex8_znrqav.xlsx";

      const response = await fetch(templateUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          localStorage.setItem("importTemplate", reader.result);
          setDownloadSuccess(true);

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "Import_Items_Template.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error("Error storing template in localStorage:", error);
          setDownloadError("Failed to store template in localStorage");
        }
      };

      reader.onerror = () => {
        setDownloadError("Failed to read template file");
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error downloading the template:", error);
      setDownloadError("Failed to download template file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-8">
        <button className="hover:text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Import Items From Excel File
        </h1>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Steps to Import
          </h2>

          <div className="mb-6">
            <div className="text-red-500 font-medium mb-2">STEP 1</div>
            <p className="text-gray-600 mb-3">
              Create an Excel file with the following format.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 text-blue-500 border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-50 transition-colors"
              >
                <Download size={18} />
                Download Sample
              </button>
              {downloadSuccess && (
                <p className="text-green-500 text-sm">
                  Template downloaded and stored successfully!
                </p>
              )}
              {downloadError && (
                <p className="text-red-500 text-sm">{downloadError}</p>
              )}
            </div>

            <div className="mt-4">
              <img
                src={ExcelImage}
                alt="Excel Sample Format"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="text-red-500 font-medium mb-2">STEP 2</div>
            <div className="flex items-center gap-2 text-gray-600">
              <Upload size={18} />
              <p>
                Upload the file (
                <span className="font-medium">.xlsx or .xls</span>) by clicking
                on the Upload File button below.
              </p>
            </div>
          </div>

          <div>
            <div className="text-red-500 font-medium mb-2">STEP 3</div>
            <p className="text-gray-600">
              Verify the items from the file & complete the import.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-3 text-right text-gray-700">
            Upload your <span className="font-medium">.xls/ .xlsx</span> (excel
            sheet)
          </div>

          <div
            className={`
              border-2 border-dashed rounded-lg p-8
              flex flex-col items-center justify-center
              min-h-[300px] transition-colors
              ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <Upload size={48} className="text-blue-400" />
            </div>

            <p className="text-lg text-gray-700 mb-2">Drag & Drop files here</p>
            <p className="text-gray-500 mb-4">or</p>

            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileInput}
              />
              <span className="bg-red-500 text-white px-6 py-3 rounded-md inline-flex items-center gap-2 hover:bg-red-600 transition-colors">
                <Upload size={18} />
                Upload File
              </span>
            </label>
          </div>
          {isImporting && (
            <div className="mt-4 text-center text-lg text-blue-500">
              Importing your items...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExcel;
