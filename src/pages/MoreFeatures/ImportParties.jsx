import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ArrowLeft, Upload, Download } from "lucide-react";
import { addParty } from "../../Redux/partySlice";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const ImportParties = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [items, setItems] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const navigate = useNavigate();
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
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
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
            partyName: row["Name"] || "",
            partyPhone: row["Contact No"] || "",
            partyEmail: row["Email ID"] || "",
            partyBillingAddress: row["Address"] || "",
            openingBalance: row["Opening Balance"] || "",
            asOfDate: row["Opening Date"] || "",
            partyGSTIN: row["GSTIN No"] || "",
            gstType: row["GST Type"] || "",
            partyState: row["State"] || "",
            partyType: row["Party Type"] || "",
            balanceType: row["Balance Type"] || "",
            additionalFields: {},
          }));

        setItems(transformedData);
        console.log(transformedData);

        setIsImporting(true);
        setTimeout(async () => {
          try {
            const existingDoc = await db.get(phone);
            const existingParties = existingDoc.parties || [];

            // Filter out new parties that are not already present
            const newParties = transformedData.filter(
              (newParty) =>
                !existingParties.some(
                  (existingParty) =>
                    existingParty.partyName === newParty.partyName
                )
            );

            if (newParties.length > 0) {
              existingDoc.parties = [...existingParties, ...newParties];
              await db.put(existingDoc);
            }

            setIsImporting(false);
            toast.success("Parties imported successfully!");
            navigate(-1);
          } catch (err) {
            console.error("Error updating database:", err);
            setIsImporting(false);
          }
        }, 3000);
      } catch (error) {
        console.error("Error processing Excel file:", error);
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
        "https://res.cloudinary.com/dmsmeq3ef/raw/upload/v1736423659/Import_Parties_Template_bgaabz.xlsx";

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
          link.download = "Import_Parties_Template.xlsx";
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

  const handleFile = (file) => {
    console.log("File received:", file);
  };

  return (
    <div className="w-full h-screen p-6 bg-white">
      <button className="hover:text-gray-700" onClick={() => navigate(-1)}>
        <ArrowLeft size={24} />
      </button>
      <h2 className="text-xl font-semibold mb-8">Import Parties</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center space-y-6">
          <p className="text-sm text-gray-700">
            Download .xls/.xlsx (excel sheet)
            <br />
            template file to enter Data
          </p>

          <div className="w-16 h-16">
            <svg
              className="w-full h-full text-blue-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
            </svg>
          </div>

          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
            onClick={handleDownloadTemplate}
          >
            Download
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

        {/* Upload Section */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-700 mb-4">
            Upload your .xls/.xlsx (excel sheet)
          </p>

          <div
            className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-4
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 text-blue-500">
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">Drag and drop or</p>
              <label className="inline-block">
                <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                  Click here to Browse
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xls,.xlsx"
                  onChange={handleFileInput}
                />
              </label>
              <p className="text-sm text-gray-600">
                formatted excel file to continue
              </p>
            </div>
            {isImporting && (
              <div className="mt-4 text-center text-lg text-blue-500">
                Importing your parties...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportParties;
