/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Litale design tokens — keep in sync with the wireframe.
        litale: {
          bg: '#F3F8F0', // app background (pale sage wash)
          card: '#FFFFFF', // card surfaces
          border: '#E2ECE0', // 1px card borders
          forest: '#2B6E38', // primary green
          'forest-hover': '#235A2D',
          'forest-muted': '#4C7A55', // eyebrow labels (AA on white)
          mint: '#E5F1DF', // inactive pills, story items, placeholders
          butter: '#FCE89B', // mic, speech bubble, idea pills
          'butter-hover': '#F8DD74',
          ink: '#1B2E20', // primary text
          sage: '#88B87E', // dashed storyboard borders
          wash: '#F4F9F0', // storyboard scene fill
        },
      },
      keyframes: {
        // Slow, gentle bar breathing — no flashing, no sudden jumps.
        breathe: {
          '0%, 100%': { transform: 'scaleY(0.45)' },
          '50%': { transform: 'scaleY(1)' },
        },
        // Screen-to-screen: a soft fade with a tiny lift.
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        breathe: 'breathe 1.8s ease-in-out infinite',
        'fade-in': 'fade-in 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
