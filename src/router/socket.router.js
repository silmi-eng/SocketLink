module.exports = (server) => {
    const connection = require("socket.io")(server, { cors: { origin: "*"} });
    const { commands, remove, response_request, reenter, message, findUUID } = require("../services/commands.service")(connection);

    connection.on("connection", socket => {
        socket.on("command", command => {
            if (command[0] in commands) {
                if (command.length === 2 ) { commands[command[0]].func(command[1], socket.id) }
                else if (command.length === 1)
                    commands[command[0]].func(socket.id)
            }
            else 
                connection.to(socket.id).emit("error", { code: 0, message :`Command not found! `})
        });

        socket.on("reenter", (cnt) => reenter(cnt, socket.id));

        socket.on("response_request", (dta) => response_request({ status: dta.status, to: dta.to, from: dta.from }, findUUID));

        socket.on("message", (dta) => message({ to: dta.to, from: dta.from, message: dta.message }, findUUID));

        socket.on("disconnect", () => remove({ to: socket.id }));
    });

    
};
