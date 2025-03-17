import React from 'react'
import Theme2Original from './Theme2Original.jsx'
import Theme2Triplicate from './Theme2Triplicate.jsx'
import Theme2Duplicate from './Theme2Duplicate.jsx'
import Theme2Base from './Theme2Base.jsx'

const Theme2 = ({ invoiceData, currentTheme }) => {
  return (
    <div>
          {invoiceData.printOriginalDuplicate ? (
            <div className="flex flex-col space-y-1">
              {invoiceData.printOriginalForRecipient && (
                <Theme2Original invoiceData={invoiceData}
                // currentTheme={currentTheme}
                isEditable={false}/>
              )}
              {invoiceData.printDuplicate && (
                <Theme2Duplicate invoiceData={invoiceData}
                // currentTheme={currentTheme}
                isEditable={false}/>
              )}
              {invoiceData.printTriplicate && (
                <Theme2Triplicate invoiceData={invoiceData}
                // currentTheme={currentTheme}
                isEditable={false}/>
              )}
            </div>
          ) : (
            <Theme2Base invoiceData={invoiceData}
            // currentTheme={currentTheme}
            isEditable={false}/>
          )}
        </div>
  )
}

export default Theme2