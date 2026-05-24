import { useSelector } from "react-redux";

import {
  getGenderLabel,
  getGenderOptions,
  getLanguageLabel,
  getLanguageOptions,
  getTranslator,
  normalizeLanguage,
} from "./translations";

export function useTranslation(preferredLanguage) {
  const storedLanguage = useSelector((state) => state.auth.user?.language);
  const language = normalizeLanguage(preferredLanguage || storedLanguage);
  const t = getTranslator(language);

  return {
    language,
    t,
    genderOptions: getGenderOptions(language),
    languageOptions: getLanguageOptions(language),
    getGenderLabel: (value) => getGenderLabel(language, value),
    getLanguageLabel: (value) => getLanguageLabel(language, value),
  };
}
