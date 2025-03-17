// components/Language.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Language = () => {
  const { changeLanguage } = useLanguage();

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <div>
      <select onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="mr">Marathi</option>
        <option value="es">Spanish</option>
        {/* Add more language options as needed */}
      </select>
    </div>
  );
};

export default Language;
