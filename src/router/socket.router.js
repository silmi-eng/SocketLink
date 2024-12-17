module.exports = (server) => {
    const connection = require("socket.io")(server, { cors: { origin: "*"} });
    const { commands, remove, reenter, handleRequest, message, findConnectedUsers, exit } = require("../services/commands.service")(connection);

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
        socket.on("response-request", (cnt) => handleRequest(cnt));
        socket.on("message", (cnt) => message({ uuid: cnt.to, socket: socket.id, message: cnt.message}, findConnectedUsers));
        socket.on("exit-chat", (cnt) => exit({ uuid: cnt.to, socket: socket.id }, findConnectedUsers ));

        socket.on("disconnect", () => remove({ to: socket.id }));
    });

    
};
