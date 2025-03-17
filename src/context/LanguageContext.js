// context/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Google Translate API URL
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language is English
  const [translations, setTranslations] = useState({});
  const apiKey = 'AIzaSyAZcF5CDTNdOHU-K2E3_u7T0VO_di0p7vQ'; // Replace with your API key

  // Change the current language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Translate content dynamically when the language changes
  useEffect(() => {
    const translateAppContent = async () => {
      const translateContent = async (text) => {
        try {
          const response = await axios.post(GOOGLE_TRANSLATE_API_URL, null, {
            params: {
              q: text,
              target: language,
              key: apiKey,
            },
          });
          return response.data.data.translations[0].translatedText;
        } catch (error) {
          console.error('Translation API error:', error);
          return text; // Fallback to original text in case of error
        }
      };

      // Loop through all elements that need translation
      const elements = document.querySelectorAll('[data-translate]');
      for (const element of elements) {
        const text = element.getAttribute('data-translate');
        const translatedText = await translateContent(text);
        element.innerText = translatedText;
      }
    };

    translateAppContent();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
