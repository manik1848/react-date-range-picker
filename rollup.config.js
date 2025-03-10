import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom", "react/jsx-runtime"], // ✅ Make sure this is external
  plugins: [
    postcss({
      extract: true,
      minimize: true,
    }),
    resolve({
      extensions: [".js", ".jsx"],
      preferBuiltins: false, // ✅ Ensure external React is used
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
      extensions: [".js", ".jsx"],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    terser(),
  ],
};
