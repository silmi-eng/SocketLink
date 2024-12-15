const express = require("express");
const app = express();
const server = require("http").createServer(app);

app.use(require("cors")({

}));

require('./router/pages.router')(app, express);
require('./router/socket.router')(server);

module.exports = server;