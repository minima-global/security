import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createHtmlPlugin } from "vite-plugin-html";
import legacy from "@vitejs/plugin-legacy";
import { copyFileSync } from "fs";

export default ({ mode }) => {
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
      minify: false,
    },
    // server: { host: "192.168.0.122", port: 5173 },
    plugins: [
      react(),
      legacy({
        targets: ["defaults", "not IE 11", "Android >= 9"],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            devEnv,
          },
        },
      }),
      {
        name: 'copy-changelog',
        closeBundle() {
          try {
            copyFileSync('CHANGELOG.md', 'build/CHANGELOG.md');
          } catch (error) {
            console.warn('Could not copy CHANGELOG.md, please check that it exists in the root directory');
          }
        }
      }
    ],
  });
};
