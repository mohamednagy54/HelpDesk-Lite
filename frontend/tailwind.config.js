/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'svg-draw': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'ticket-front': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)', opacity: '1' },
          '25%': { transform: 'translate(12px, 0px) scale(0.9)', opacity: '0.8' },
          '50%': { transform: 'translate(6px, -6px) scale(0.8)', opacity: '0.6' },
          '75%': { transform: 'translate(-12px, -3px) scale(0.9)', opacity: '0.8' },
        },
        'ticket-back': {
          '0%, 100%': { transform: 'translate(6px, -6px) scale(0.8)', opacity: '0.6' },
          '25%': { transform: 'translate(-12px, -3px) scale(0.9)', opacity: '0.8' },
          '50%': { transform: 'translate(0px, 0px) scale(1)', opacity: '1' },
          '75%': { transform: 'translate(12px, 0px) scale(0.9)', opacity: '0.8' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'svg-draw': 'svg-draw 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ticket-front': 'ticket-front 1.6s ease-in-out infinite',
        'ticket-back': 'ticket-back 1.6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
