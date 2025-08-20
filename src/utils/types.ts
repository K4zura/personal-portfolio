export interface Theme {
  name: "light" | "dark";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
}

export interface Language {
  code: "en" | "es";
  name: string;
  flag: string;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface ProjectData {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  technologies: string[];
  links: {
    demo?: string;
    github?: string;
  };
  image: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: Record<string, string>;
  duration: {
    start: Record<string, string>;
    end: Record<string, string>;
  };
  description: Record<string, string>;
  technologies: string[];
  logo?: string;
}

export interface Technology {
  name: string;
  icon: string;
  category: "frontend" | "backend" | "tools" | "database";
  level?: 1 | 2 | 3 | 4 | 5;
}

export interface PersonalInfo {
  name: string;
  title: Record<string, string>;
  bio: Record<string, string>;
  photo: string;
  resume: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export type SupportedLanguage = "en" | "es";
export type ThemeMode = "light" | "dark";
