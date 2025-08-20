import type { SupportedLanguage } from "./types";

// Default language
export let DEFAULT_LANGUAGE: SupportedLanguage = "en";

// Supported languages
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "es"];

// Language configuration
export const LANGUAGE_CONFIG = {
  en: {
    name: "English",
    flag: "🇺🇸",
    dir: "ltr",
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    dir: "ltr",
  },
} as const;

export function setNewLang(lang: string) {
  DEFAULT_LANGUAGE = lang as SupportedLanguage;
}

/**
 * Get the current language from URL or localStorage
 */
export function getCurrentLanguage(): SupportedLanguage {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  // First, try to get language from URL path
  const pathLang = getLanguageFromPath(window.location.pathname);
  if (pathLang) {
    return pathLang;
  }

  // Then try localStorage
  const storedLang = localStorage.getItem(
    "preferred-language"
  ) as SupportedLanguage;
  if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
    return storedLang;
  }

  // Finally, try browser language
  const browserLang = getBrowserLanguage();
  return browserLang;
}

/**
 * Extract language from URL path
 */
export function getLanguageFromPath(
  pathname: string
): SupportedLanguage | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (
    firstSegment &&
    SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)
  ) {
    return firstSegment as SupportedLanguage;
  }

  return null;
}

/**
 * Get browser's preferred language
 */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const browserLang = navigator.language.split("-")[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(browserLang)
    ? browserLang
    : DEFAULT_LANGUAGE;
}

/**
 * Set language preference and persist to localStorage
 */
export function setLanguagePreference(lang: SupportedLanguage) {
  // if (typeof window === "undefined") return;

  localStorage.setItem("preferred-language", lang);

  // Update document lang attribute
  document.documentElement.lang = lang;
  window.location.href = lang;
  console.log("Language changed to:", lang);

  // Dispatch custom event for components to listen to
  // window.dispatchEvent(
  //   new CustomEvent("languageChange", {
  //     detail: { language: lang },
  //   })
  // );
}

/**
 * Generate URL for a specific language
 */
export function getLocalizedUrl(
  lang: SupportedLanguage,
  path: string = ""
): string {
  // Remove leading slash and language prefix from path
  const cleanPath = path.replace(/^\//, "").replace(/^(en|es)\//, "");

  // For default language, don't add language prefix
  if (lang === DEFAULT_LANGUAGE) {
    return `/${cleanPath}`.replace(/\/$/, "") || "/";
  }

  return `/${lang}/${cleanPath}`.replace(/\/$/, "") || `/${lang}`;
}

/**
 * Get localized content from translations object
 */
export function getLocalizedContent<T extends Record<string, any>>(
  content: T,
  lang: SupportedLanguage,
  fallbackLang: SupportedLanguage = DEFAULT_LANGUAGE
): T[SupportedLanguage] {
  return content[lang] || content[fallbackLang] || content[DEFAULT_LANGUAGE];
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

/**
 * Initialize i18n system
 */
export function initializeI18n(): SupportedLanguage {
  const currentLang = getCurrentLanguage();

  if (typeof window !== "undefined") {
    // Set document language
    document.documentElement.lang = currentLang;

    // Store current language
    setLanguagePreference(currentLang);
  }

  return currentLang;
}

// Content loading utilities
let contentCache: Record<string, any> | null = null;

/**
 * Load content from JSON file
 */
export async function loadContent(): Promise<Record<string, any>> {
  if (contentCache) {
    return contentCache;
  }

  try {
    // In Astro, we can import JSON directly
    const content = await import("../data/content.json");
    contentCache = content.default || content;
    return contentCache;
  } catch (error) {
    console.error("Failed to load content:", error);
    return {};
  }
}

/**
 * Get translated text for a given key path
 */
export async function t(
  keyPath: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE,
  fallbackLang: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<string> {
  const content = await loadContent();

  // Navigate through the key path (e.g., "hero.title")
  const keys = keyPath.split(".");
  let current = content;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath; // Return the key path as fallback
    }
  }

  // If we have a translation object, get the language-specific text
  if (current && typeof current === "object" && lang in current) {
    return (
      current[lang] ||
      current[fallbackLang] ||
      current[DEFAULT_LANGUAGE] ||
      keyPath
    );
  }

  // If it's a direct string, return it
  if (typeof current === "string") {
    return current;
  }

  console.warn(`Invalid translation structure for key: ${keyPath}`);
  return keyPath;
}

/**
 * Get translated object for a given key path
 */
export async function tObject(
  keyPath: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<Record<string, string>> {
  const content = await loadContent();

  // Navigate through the key path
  const keys = keyPath.split(".");
  let current = content;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      console.warn(`Translation object not found: ${keyPath}`);
      return {};
    }
  }

  // Return the entire object for the language
  if (current && typeof current === "object") {
    const result: Record<string, string> = {};

    // Extract all keys and get their translations
    for (const [key, value] of Object.entries(current)) {
      if (value && typeof value === "object" && lang in value) {
        result[key] =
          (value as any)[lang] || (value as any)[DEFAULT_LANGUAGE] || key;
      }
    }

    return result;
  }

  return {};
}
