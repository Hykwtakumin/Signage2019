const {FuseBox, QuantumPlugin, WebIndexPlugin} = require("fuse-box");
const {TypeChecker} = require("fuse-box-typechecker");
const plugins = [WebIndexPlugin()];
if (process.env.NODE_ENV === "production") {
    plugins.push(QuantumPlugin({
        uglify: {
            mangle: {
                safari10: true,
            }
        },
        treeshake: true,
        bakeApiIntoBundle: "index",
    }))
}
const fuse = FuseBox.init({
    homeDir: "src",
    sourceMaps: true,
    target: "browser@es6",
    output: "./public/dist/$name.js",
    plugins,
});

const app = fuse
    .bundle("index")
    .instructions(`> client/index.tsx`)

if (process.env.NODE_ENV !== "production") {
    const testWatch = TypeChecker({
        tsConfig: './tsconfig.json',
        basePath:'./',
        name: 'Watch Async'
    });
    testWatch.runWatch('./src');
    app.watch()
}

fuse.run();