import React, { useState } from "react";

const DefaultThermalTheme = ({
  printerSettings,
  companyInfo,
  itemTableSettings,
  totalsAndTaxes,
  footerSettings,
  isEditable,
}) => {
  // Initialize state for styles
  const [styles, setStyles] = useState({
    fontSize: "text-sm",
    fontFamily: "font-mono",
    headerSize: "text-xl",
    subheaderSize: "text-base",
    spacing: "space-y-4",
    tableFontSize: "text-xs",
    headerBgColor: "bg-gray-100",
    headerTextColor: "text-gray-700",
    sectionHeaderColor: "text-gray-700",
    borderColor: "border-gray-300",
    accentColor: "bg-gray-50",
  });

  // Initialize sections for drag and drop with visibility state
  const [sections, setSections] = useState([
    {
      id: "header",
      title: "Company Info",
      component: "header",
      visible: false,
    },
    {
      id: "customer-info",
      title: "Customer Info",
      component: "customerInfo",
      visible: false,
    },
    {
      id: "items-table",
      title: "Items Table",
      component: "itemsTable",
      visible: false,
    },
    { id: "totals", title: "Totals", component: "totals", visible: false },
    { id: "footer", title: "Footer", component: "footer", visible: false },
  ]);

  const [draggedItem, setDraggedItem] = useState(null);

  // Helper function to get width based on page size
  const getPageWidth = () => {
    switch (printerSettings.pageSize) {
      case "2-inch":
        return "w-[220px]";
      case "3-inch":
        return "w-[380px]";
      case "4-inch":
        return "w-[480px]";
      case "custom":
        return "w-[380px]";
      default:
        return "w-[380px]";
    }
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(sections[index]);
    e.currentTarget.style.opacity = "0.4";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = sections[index];

    if (draggedItem === draggedOverItem) return;

    const items = [...sections];
    const draggedItemIndex = items.findIndex(
      (item) => item.id === draggedItem.id
    );
    items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);

    setSections(items);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "";
    setDraggedItem(null);
  };

  // Style controls component
  const StyleControls = () => {
    const fontSizeOptions = [
      { value: "text-xs", label: "Extra Small" },
      { value: "text-sm", label: "Small" },
      { value: "text-base", label: "Medium" },
      { value: "text-lg", label: "Large" },
    ];

    const fontFamilyOptions = [
      { value: "font-mono", label: "Monospace" },
      { value: "font-sans", label: "Sans Serif" },
      { value: "font-serif", label: "Serif" },
    ];

    const colorOptions = [
      { value: "gray", label: "Gray" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
      { value: "pink", label: "Pink" },
      { value: "orange", label: "Orange" },
    ];

    const getColorClasses = (color) =>
      ({
        gray: {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-300",
          header: "text-gray-700",
          accent: "bg-gray-50",
        },
        blue: {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-300",
          header: "text-blue-700",
          accent: "bg-blue-50",
        },
        green: {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-300",
          header: "text-green-700",
          accent: "bg-green-50",
        },
        purple: {
          bg: "bg-purple-100",
          text: "text-purple-700",
          border: "border-purple-300",
          header: "text-purple-700",
          accent: "bg-purple-50",
        },
        pink: {
          bg: "bg-pink-100",
          text: "text-pink-700",
          border: "border-pink-300",
          header: "text-pink-700",
          accent: "bg-pink-50",
        },
        orange: {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-300",
          header: "text-orange-700",
          accent: "bg-orange-50",
        },
      }[color]);

    const handleColorChange = (e) => {
      const colorClasses = getColorClasses(e.target.value);
      setStyles({
        ...styles,
        headerBgColor: colorClasses.bg,
        headerTextColor: colorClasses.text,
        borderColor: colorClasses.border,
        sectionHeaderColor: colorClasses.header,
        accentColor: colorClasses.accent,
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Style Controls</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Color Theme
            </label>
            <select
              className="w-full p-2 border rounded"
              onChange={handleColorChange}
              value={styles.headerBgColor.split("-")[1]}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <select
              className="w-full p-2 border rounded"
              value={styles.fontSize}
              onChange={(e) =>
                setStyles({ ...styles, fontSize: e.target.value })
              }
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Font Family
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.fontFamily}
              onChange={(e) =>
                setStyles({ ...styles, fontFamily: e.target.value })
              }
            >
              {fontFamilyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Section Order</h3>
          <p className="text-sm text-gray-600 mb-4">
            Toggle sections visibility and drag to reorder them
          </p>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="p-3 bg-white rounded border cursor-move hover:bg-gray-50 transition-colors flex items-center"
              >
                <input
                  type="checkbox"
                  checked={section.visible}
                  onChange={() => toggleSectionVisibility(section.id)}
                  className="mr-2"
                />
                {section.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render sections based on order
  const renderSection = (section) => {
    if (!section.visible) return null;

    switch (section.component) {
      case "header":
        return (
          <div className="text-center mb-4">
            <h1 className={`${styles.headerSize} ${styles.sectionHeaderColor}`}>
              {companyInfo.companyName || "My Company"}
            </h1>
            {companyInfo.gstin && (
              <p className="text-xs">GSTIN: {companyInfo.gstin}</p>
            )}
            <p className="text-xs">
              Ph.No.: {companyInfo.phone || "1234567890"}
            </p>
            {companyInfo.email && (
              <p className="text-xs">Email: {companyInfo.email}</p>
            )}
          </div>
        );

      case "customerInfo":
        return (
          <div className={`border-t border-dashed ${styles.borderColor} pt-4`}>
            <p>Paper Bill tech solutions (Sample Party Name)</p>
            <p>Ph.No:(+91) 9535 911 911</p>
            <div className="flex justify-between mt-2">
              <div>
                <p className={styles.subheaderSize}>Bill To:</p>
                <p>{companyInfo.address || "Sanjaay Road, Bangalore"}</p>
                <p className={`mt-2 ${styles.subheaderSize}`}>
                  Place of Supply:
                </p>
                <p>Karnataka</p>
              </div>
              <div className="text-right">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Invoice No.: inv12345</p>
              </div>
            </div>
          </div>
        );

      case "itemsTable":
        return (
          <div
            className={`mt-4 border-t border-dashed ${styles.borderColor} pt-4`}
          >
            <div className={`grid grid-cols-12 ${styles.headerTextColor}`}>
              {itemTableSettings.showSNo && <div className="col-span-1">#</div>}
              <div className="col-span-5">
                Item Name{itemTableSettings.showHSN && "(HSN)"}
              </div>
              {itemTableSettings.showMRP && (
                <div className="col-span-2">MRP</div>
              )}
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Amount</div>
            </div>

            <div
              className={`mt-2 border-t border-dashed ${styles.borderColor} pt-2`}
            >
              <div className="grid grid-cols-12">
                {itemTableSettings.showSNo && (
                  <div className="col-span-1">1</div>
                )}
                <div className="col-span-11">
                  <p>
                    Brittania Chocolate Cake
                    {itemTableSettings.showHSN && "(2345678)"}
                  </p>
                  <p className="text-xs">100 x 100.00</p>
                  {itemTableSettings.showDescription && (
                    <p className="text-xs">
                      Brittania Chocolate Cake description
                    </p>
                  )}
                  {itemTableSettings.showBatch && (
                    <p className="text-xs">Batch No.: N1234</p>
                  )}
                  {itemTableSettings.showExpiry && (
                    <p className="text-xs">Exp. Date: 01/2024</p>
                  )}
                  <div className="mt-1">
                    <p className="text-xs">Disc.(1%) -100.00</p>
                    <p className="text-xs">Final amount 10,000.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "totals":
        return (
          <div
            className={`mt-4 border-t border-dashed ${styles.borderColor} pt-4`}
          >
            <div className="space-y-1">
              {totalsAndTaxes.showTotalQuantity && <p>Total: 150 + 1</p>}
              <p>Disc.(0%) -500.00</p>
              {totalsAndTaxes.showTaxDetails && <p>Tax(0%) 500.00</p>}
              <p>Total Disc. -1,350.00</p>
              <p className={styles.headerTextColor}>Total 20,000.00</p>
              {totalsAndTaxes.showReceivedAmount && <p>Received 20,000.00</p>}
              {totalsAndTaxes.showBalance && <p>Balance 0.00</p>}
            </div>
          </div>
        );

      case "footer":
        return footerSettings.showPrintDescription ? (
          <div
            className={`mt-4 border-t border-dashed ${styles.borderColor} pt-4 text-center`}
          >
            <p>Balance to be paid in 5 days</p>
            <p className={`mt-2 ${styles.headerTextColor}`}>
              Terms & Conditions
            </p>
            <p className="mt-2">Thanks for doing business with us!</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return isEditable ? (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-50 p-4 rounded-lg overflow-y-auto">
        <StyleControls />
      </div>
      <div className="w-2/3 overflow-y-auto">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div
            className={`${getPageWidth()} bg-white p-8 ${styles.fontFamily} ${
              styles.fontSize
            } leading-tight`}
          >
            {sections.map((section) => (
              <div key={section.id}>{renderSection(section)}</div>
            ))}
            {printerSettings.extraLines > 0 && (
              <div style={{ height: `${printerSettings.extraLines * 24}px` }} />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="text-center mb-4">
        <h1 className={`${styles.headerSize} ${styles.sectionHeaderColor}`}>
          {companyInfo.companyName || "My Company"}
        </h1>
        {companyInfo.gstin && (
          <p className="text-xs">GSTIN: {companyInfo.gstin}</p>
        )}
        <p className="text-xs">Ph.No.: {companyInfo.phone || "1234567890"}</p>
        {companyInfo.email && (
          <p className="text-xs">Email: {companyInfo.email}</p>
        )}
      </div>
      <div className={`border-t border-dashed ${styles.borderColor} pt-4`}>
        <p>Paper Bill tech solutions (Sample Party Name)</p>
        <p>Ph.No:(+91) 9535 911 911</p>
        <div className="flex justify-between mt-2">
          <div>
            <p className={styles.subheaderSize}>Bill To:</p>
            <p>{companyInfo.address || "Sanjaay Road, Bangalore"}</p>
            <p className={`mt-2 ${styles.subheaderSize}`}>Place of Supply:</p>
            <p>Karnataka</p>
          </div>
          <div className="text-right">
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Invoice No.: inv12345</p>
          </div>
        </div>
      </div>
      <div className={`mt-4 border-t border-dashed ${styles.borderColor} pt-4`}>
        <div className={`grid grid-cols-12 ${styles.headerTextColor}`}>
          {itemTableSettings.showSNo && <div className="col-span-1">#</div>}
          <div className="col-span-5">
            Item Name{itemTableSettings.showHSN && "(HSN)"}
          </div>
          {itemTableSettings.showMRP && <div className="col-span-2">MRP</div>}
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Amount</div>
        </div>

        <div
          className={`mt-2 border-t border-dashed ${styles.borderColor} pt-2`}
        >
          <div className="grid grid-cols-12">
            {itemTableSettings.showSNo && <div className="col-span-1">1</div>}
            <div className="col-span-11">
              <p>
                Brittania Chocolate Cake
                {itemTableSettings.showHSN && "(2345678)"}
              </p>
              <p className="text-xs">100 x 100.00</p>
              {itemTableSettings.showDescription && (
                <p className="text-xs">Brittania Chocolate Cake description</p>
              )}
              {itemTableSettings.showBatch && (
                <p className="text-xs">Batch No.: N1234</p>
              )}
              {itemTableSettings.showExpiry && (
                <p className="text-xs">Exp. Date: 01/2024</p>
              )}
              <div className="mt-1">
                <p className="text-xs">Disc.(1%) -100.00</p>
                <p className="text-xs">Final amount 10,000.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-4 border-t border-dashed ${styles.borderColor} pt-4`}>
        <div className="space-y-1">
          {totalsAndTaxes.showTotalQuantity && <p>Total: 150 + 1</p>}
          <p>Disc.(0%) -500.00</p>
          {totalsAndTaxes.showTaxDetails && <p>Tax(0%) 500.00</p>}
          <p>Total Disc. -1,350.00</p>
          <p className={styles.headerTextColor}>Total 20,000.00</p>
          {totalsAndTaxes.showReceivedAmount && <p>Received 20,000.00</p>}
          {totalsAndTaxes.showBalance && <p>Balance 0.00</p>}
        </div>
      </div>
      {footerSettings.showPrintDescription && (
        <div
          className={`mt-4 border-t border-dashed ${styles.borderColor} pt-4 text-center`}
        >
          <p>Balance to be paid in 5 days</p>
          <p className={`mt-2 ${styles.headerTextColor}`}>Terms & Conditions</p>
          <p className="mt-2">Thanks for doing business with us!</p>
        </div>
      )}
    </>
  );
};

export default DefaultThermalTheme;
