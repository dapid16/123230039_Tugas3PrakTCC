/** @type {import('tailwindcss').Config} */
module.exports = {
  // BAGIAN INI PALING PENTING: Kasih tau Tailwind buat scan semua file di folder src
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Biar class 'font-sans' di App.js lu otomatis pake Geist
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Lu bisa nambahin warna kustom di sini kalau mau
      },
    },
  },
  plugins: [],
}