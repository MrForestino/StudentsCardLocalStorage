import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  base: '/StudentsCardLocalStorage', // дуже важливо для GitHub Pages
  plugins: [handlebars()]
});
