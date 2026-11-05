import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Every build gets an id, compiled into the app and published as
// /version.json. A tab left open across a deploy keeps running the code it
// loaded; UpdateBanner compares the two and offers a reload when they differ.
const BUILD_ID = new Date().toISOString();

const versionFile = {
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) });
  },
};

export default defineConfig({
  plugins: [react(), versionFile],
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  server: { port: 5173 },
});
