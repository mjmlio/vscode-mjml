const {readFileSync} = require("fs");
const mjml = require('mjml');

// Read input from process.stdin
const stdin = readFileSync(0, "utf-8");

// Parse input
const { directory, content, filePath, options } = JSON.parse(stdin);

function processMJML(filePath, content) {
    let html, errors = [];

    // you can do some preprocessing, e.g read frontmatter, inject custom styles or compile with handlebars.js
    // I'm just going to transpile `content` directly (essentially, doing what vscode-mjml already does)
    html = mjml(content).html;

    return {html, errors};
}

process.stdout.write(
    JSON.stringify(processMJML(filePath, content))
);