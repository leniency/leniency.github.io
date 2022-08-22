import sass from "sass";
import fs from "fs";

var result = sass.renderSync({
    file: "src/styles/theme.scss",
    outputStyle: "compressed",
    outFile: "dist/theme.css"
});

fs.writeFile("dist/theme.css", result.css, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("File saved successfully!");
});