// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/eliasnemr/projects/v3/security/node_modules/vite/dist/node/index.js";
import react from "file:///Users/eliasnemr/projects/v3/security/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { createHtmlPlugin } from "file:///Users/eliasnemr/projects/v3/security/node_modules/vite-plugin-html/dist/index.mjs";
import legacy from "file:///Users/eliasnemr/projects/v3/security/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var vite_config_default = ({ mode }) => {
  let devEnv = "";
  const env = Object.assign(
    globalThis.process.env,
    loadEnv(mode, globalThis.process.cwd())
  );
  if (mode === "development") {
    devEnv = `
      <script>
        var DEBUG = "${env.VITE_DEBUG}" === 'true';
        var DEBUG_HOST = "${env.VITE_DEBUG_HOST}";
        var DEBUG_PORT = "${env.VITE_DEBUG_MDS_PORT}";
        var DEBUG_UID = "${env.VITE_DEBUG_UID}";
      </script>
    `;
  }
  return defineConfig({
    base: "",
    build: {
      outDir: "build",
      minify: false
    },
    plugins: [
      react(),
      legacy({
        targets: ["defaults", "not IE 11", "Android >= 9"]
      }),
      createHtmlPlugin({
        inject: {
          data: {
            devEnv
          }
        }
      })
    ]
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZWxpYXNuZW1yL3Byb2plY3RzL3YzL3NlY3VyaXR5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZWxpYXNuZW1yL3Byb2plY3RzL3YzL3NlY3VyaXR5L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lbGlhc25lbXIvcHJvamVjdHMvdjMvc2VjdXJpdHkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xuaW1wb3J0IGxlZ2FjeSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tbGVnYWN5XCI7XG5cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xuICBsZXQgZGV2RW52ID0gXCJcIjtcbiAgY29uc3QgZW52ID0gT2JqZWN0LmFzc2lnbihcbiAgICBnbG9iYWxUaGlzLnByb2Nlc3MuZW52LFxuICAgIGxvYWRFbnYobW9kZSwgZ2xvYmFsVGhpcy5wcm9jZXNzLmN3ZCgpKVxuICApO1xuXG4gIGlmIChtb2RlID09PSBcImRldmVsb3BtZW50XCIpIHtcbiAgICBkZXZFbnYgPSBgXG4gICAgICA8c2NyaXB0PlxuICAgICAgICB2YXIgREVCVUcgPSBcIiR7ZW52LlZJVEVfREVCVUd9XCIgPT09ICd0cnVlJztcbiAgICAgICAgdmFyIERFQlVHX0hPU1QgPSBcIiR7ZW52LlZJVEVfREVCVUdfSE9TVH1cIjtcbiAgICAgICAgdmFyIERFQlVHX1BPUlQgPSBcIiR7ZW52LlZJVEVfREVCVUdfTURTX1BPUlR9XCI7XG4gICAgICAgIHZhciBERUJVR19VSUQgPSBcIiR7ZW52LlZJVEVfREVCVUdfVUlEfVwiO1xuICAgICAgPC9zY3JpcHQ+XG4gICAgYDtcbiAgfVxuXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xuICAgIGJhc2U6IFwiXCIsXG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogXCJidWlsZFwiLFxuICAgICAgbWluaWZ5OiBmYWxzZSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBsZWdhY3koe1xuICAgICAgICB0YXJnZXRzOiBbXCJkZWZhdWx0c1wiLCBcIm5vdCBJRSAxMVwiLCBcIkFuZHJvaWQgPj0gOVwiXSxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICAgIGluamVjdDoge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRldkVudixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgXSxcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUyxTQUFTLGNBQWMsZUFBZTtBQUN2VSxPQUFPLFdBQVc7QUFDbEIsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxZQUFZO0FBRW5CLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixNQUFJLFNBQVM7QUFDYixRQUFNLE1BQU0sT0FBTztBQUFBLElBQ2pCLFdBQVcsUUFBUTtBQUFBLElBQ25CLFFBQVEsTUFBTSxXQUFXLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDeEM7QUFFQSxNQUFJLFNBQVMsZUFBZTtBQUMxQixhQUFTO0FBQUE7QUFBQSx1QkFFVSxJQUFJO0FBQUEsNEJBQ0MsSUFBSTtBQUFBLDRCQUNKLElBQUk7QUFBQSwyQkFDTCxJQUFJO0FBQUE7QUFBQTtBQUFBLEVBRzdCO0FBRUEsU0FBTyxhQUFhO0FBQUEsSUFDbEIsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyxZQUFZLGFBQWEsY0FBYztBQUFBLE1BQ25ELENBQUM7QUFBQSxNQUNELGlCQUFpQjtBQUFBLFFBQ2YsUUFBUTtBQUFBLFVBQ04sTUFBTTtBQUFBLFlBQ0o7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
