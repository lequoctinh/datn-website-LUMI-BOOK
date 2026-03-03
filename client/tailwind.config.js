/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        //  NỀN & TEXT
        background: "#F6F1E9",      // Kem giấy – nền chính
        surface: "#FFFFFF",        // Card / box
        text: {
          primary: "#1F2937",      // Text chính
          secondary: "#6B7280",    // Text phụ
          muted: "#9CA3AF",
        },

        //  BRAND – TRI THỨC
        brand: {
          primary: "#8B5E3C",      // Nâu sách (chủ đạo)
          dark: "#6F4A2E",         // Nâu đậm (hover / header)
          light: "#C4A484",        // Nâu nhạt (tag, badge)
        },

        //  ACCENT – CTA
        accent: {
          primary: "#C2410C",      // Cam đất (Add to cart / Buy)
          hover: "#9A3412",
        },

        //  TRẠNG THÁI
        state: {
          success: "#15803D",      // Còn hàng
          warning: "#D97706",      // Sắp hết
          danger: "#B91C1C",       // Hết hàng / hủy
        },

        //  BORDER & DIVIDER
        border: {
          light: "rgba(0,0,0,0.08)",
          default: "rgba(0,0,0,0.15)",
        },
      },

      fontFamily: {
        heading: ["Merriweather", "serif"], // Tiêu đề – học thuật
        body: ["Inter", "sans-serif"],      // Nội dung
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
        hover: "0 8px 24px rgba(0,0,0,0.12)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
}

