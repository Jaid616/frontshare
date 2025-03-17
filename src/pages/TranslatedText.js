import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';

const TranslatedText = ({ text }) => {
  const { translateText } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const fetchTranslation = async () => {
      const translated = await translateText(text);
      setTranslatedText(translated);
    };
    fetchTranslation();
  }, [text, translateText]);

  return <span>{translatedText}</span>;
};

export default TranslatedText;
