import { babel } from "@rollup/plugin-babel";

const config = {
  input: "./index.js",
  output: {
    // dir: "./Deploy/server/",
    file: "./Deploy/server/index.js",
    format: "cjs",
  },
  plugins: [babel({ babelHelpers: "bundled" })],
};

export default config;
