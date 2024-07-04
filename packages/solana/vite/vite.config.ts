import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        svgr(),
        react(),
        nodePolyfills(
            {
                globals: {
                    Buffer: true,
                    global: true,
                    process: true,
                },
                overrides: {
                    fs: 'memfs',
                },
            }
        )
    ],
})