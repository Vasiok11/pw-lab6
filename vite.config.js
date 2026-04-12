import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // IMPORTANT: This 'base' MUST match your exact GitHub repository name. 
  // If your GitHub repo is not named "pw-lab6", change this string!
  // Example: if your repo is "cyber-tracker", make it base: '/cyber-tracker/'
  base: '/pw-lab6/',
  plugins: [react(), tailwindcss()],
})
