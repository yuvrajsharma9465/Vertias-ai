import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#EFF2F6",
        canvas: "#EFF2F6",
        sidebar: {
          DEFAULT: "#0F1117",
          dark: "#0B0E14",
          border: "#1E222D",
          text: "#8E97A6",
          active: "#FFFFFF",
          "active-text": "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#FBFBFC",
        },
        border: {
          DEFAULT: "#E5E7EB",
          subtle: "#F1F3F5",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
        brand: {
          green: "#16A34A",
          emerald: "#10B981",
          teal: "#14B8A6",
          blue: "#0EA5E9",
          indigo: "#4F46E5",
          purple: "#8B5CF6",
          amber: "#F59E0B",
          red: "#EF4444",
          rose: "#F43F5E",
          coral: "#FB7185",
        },
        verdict: {
          supported: "#10B981",
          contradicted: "#F43F5E",
          insufficient: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        card: "0 2px 12px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)",
        dropdown: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
export default config;
