import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // allow external access (useful when exposing via ngrok)
    host: true,
    // keep default port unless overridden by env
    // configure HMR to use the ngrok host so live reload works over the tunnel
    hmr: {
      host: "4579-49-36-81-168.ngrok-free.app",
      protocol: "wss",
    },
    // origin helps Vite construct correct URLs when served behind a proxy
    origin: "https://4579-49-36-81-168.ngrok-free.app",
  },
});