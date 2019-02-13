const { FuseBox, QuantumPlugin } = require("fuse-box");
const { TypeChecker } = require("fuse-box-typechecker");

const fuse = FuseBox.init({
  homeDir: "src",
  sourceMaps: true,
  target: "browser@es6",
  output: "./public/dist/$name.js",
  plugins: [
    process.env.NODE_ENV === "production" &&
      QuantumPlugin({
        treeshake: true,
        ugilyfy: true,
        bakeApiIntoBundle: "index",
      }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  const testWatch = TypeChecker({
    tsConfig: "./tsconfig.json",
    basePath: "./",
    name: "Watch Async",
  });
  testWatch.runWatch("./src");
  fuse
    .bundle("index")
    .instructions(">client/index.tsx")
    .watch();
} else {
  fuse.bundle("index").instructions(">client/index.tsx");
}

fuse.run();
