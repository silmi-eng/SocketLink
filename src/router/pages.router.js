const serve_static = require("serve-static");
const path = require("path")
const public_directory = path.join(__dirname, "../public");

module.exports = (app, express) => {
    app.use(express.static(public_directory));
    app.use(serve_static(public_directory, { index: ["index.html", "index.htm" ]}));
};