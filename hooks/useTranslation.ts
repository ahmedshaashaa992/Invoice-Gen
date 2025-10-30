import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { translations, language, loading } = useLanguage();

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    let translation = translations[key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }
    return translation;
  };

  return { t, language, loading };
};