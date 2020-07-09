const fs = require("fs-extra");
const path = require("path");
const globby = require("globby");
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-es");
const HtmlMinifier = require('html-minifier').minify;
const child_process = require("child_process");


// Get directory paths
let xpPaintDir = path.join(__dirname, "xp-paint"); 
let tempBuildDir = path.join(__dirname, "xp-paint-temp-build"); 

// Removing existing build path
if (fs.existsSync(tempBuildDir)) {
    fs.removeSync(tempBuildDir);
}

// Copy the source path to the build path
fs.copySync(xpPaintDir, tempBuildDir);

// Recursively search all files in build directory
globby.sync(path.join(tempBuildDir, "**")).forEach(filePath => {

    // Minify and clean each file
    switch (path.extname(filePath)) {
        case ".js":
            let result = UglifyJS.minify(fs.readFileSync(filePath).toString());
            if (!result.error) {
                fs.writeFileSync(filePath, result.code);
            }
            
            break;

        case ".css":
            let minifiedCSSCode = new CleanCSS({}).minify(fs.readFileSync(filePath).toString()).styles;
            // CSS minifier is failing somewhere
            //fs.writeFileSync(filePath, minifiedCSSCode);
            break;
    }
});

// Running monolith to create a single html file
let indexHtmlFilePath = path.join(tempBuildDir, "index.html");
let xpPaintHtmlOutputPath = path.join(__dirname, "xp-paint.html");
let proc = child_process.execSync(`monolith "${indexHtmlFilePath}" > "${xpPaintHtmlOutputPath}"`);

// Running the html minifier
let minfiedHtml = HtmlMinifier(fs.readFileSync(xpPaintHtmlOutputPath).toString(), {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyURLs: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    //removeScriptTypeAttributes: true,
    //removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
});

fs.writeFileSync(xpPaintHtmlOutputPath, minfiedHtml)

// Cleaning up the temporary build directory
fs.removeSync(tempBuildDir);

console.log("Build completed successfully.");
