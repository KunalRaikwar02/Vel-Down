import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <--- Maine yahan galti se react-react likh diya tha
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})