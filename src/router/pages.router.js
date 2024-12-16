const serve_static = require("serve-static");
const path = require("path");
const fs = require('fs');

const public_directory = path.join(__dirname, "../public");

module.exports = (app, express) => {
    app.use(express.static(public_directory));
    app.use(serve_static(public_directory, { index: ["index.html", "index.htm" ]}));

    app.get("/:uuid", (req, res) => {
        const uuid = req.params.uuid;
        const page = path.join(public_directory, 'message.html');

        fs.readFile(page, 'utf-8', (err, dta) => {
            if (err)
                return res.status(500).send('Something happen!');

            const modified = dta.replace('{{uuid}}', uuid);
            res.status(200).send(modified);
        });
    });
};