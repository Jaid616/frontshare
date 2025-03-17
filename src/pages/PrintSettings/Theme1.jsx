import React from "react";
import Theme1Original from "./Theme1Original.jsx";
import Theme1Duplicate from "./Theme1Duplicate.jsx";
import Theme1Triplicate from "./Theme1Triplicate.jsx";
// import Theme1Base from "./Theme1Base.jsx";
import NotEditable from "./NotEditable.jsx";

const Theme1 = ({ invoiceData, isEditable }) => {
  return (
    <div>
      {invoiceData?.printOriginalDuplicate ? (
        <div className="flex flex-col space-y-1">
          {invoiceData?.printOriginalForRecipient && (
            <Theme1Original
              invoiceData={invoiceData}
              // currentTheme={currentTheme}
              isEditable={isEditable}
            />
          )}
          {invoiceData?.printDuplicate && (
            <Theme1Duplicate
              invoiceData={invoiceData}
              // currentTheme={currentTheme}
              isEditable={isEditable}
            />
          )}
          {invoiceData?.printTriplicate && (
            <Theme1Triplicate
              invoiceData={invoiceData}
              // currentTheme={currentTheme}
              isEditable={isEditable}
            />
          )}
        </div>
      ) : (
        <NotEditable invoiceData={invoiceData} />
      )}
    </div>
  );
};

export default Theme1;
