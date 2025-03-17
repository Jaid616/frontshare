import React from "react";
import { QrCode } from "lucide-react";
import Theme1 from "./Theme1.jsx";
import Theme2 from "./Theme2.jsx";
const TaxInvoice = ({ invoiceData, currentTheme }) => {
  return (
    <>
      {currentTheme == 1 ? (
          <Theme1 invoiceData={invoiceData} isEditable={false}/>
      ) : currentTheme == 2 ? (
        // <Theme2 invoiceData={invoiceData} currentTheme={currentTheme}/>
        null
      ) : null}
    </>
  );
};

export default TaxInvoice;
